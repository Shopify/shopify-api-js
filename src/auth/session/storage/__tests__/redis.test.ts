import * as child_process from 'child_process';
import {promisify} from 'util';
import {resolve} from 'path';

import {createClient} from 'redis';

import {RedisSessionStorage} from '../redis';

import {batteryOfTests} from './battery-of-tests';
import {poll} from './utils';

const exec = promisify(child_process.exec);

const dbURL = new URL('redis://shopify:passify@localhost/1');

// SORRY NOT SORRY
jest.setTimeout(20000);

describe('RedisSessionStorage', () => {
  let storage: RedisSessionStorage;
  let containerId: string;
  beforeAll(async () => {
    const configPath = resolve(__dirname, './redis.conf');
    const runCommand = await exec(
      `docker run -d -p 6379:6379 -v ${configPath}:/redis.conf redis:6 redis-server /redis.conf`,
      {encoding: 'utf8'},
    );
    containerId = runCommand.stdout.trim();

    await poll(
      async () => {
        try {
          const client = createClient({
            url: dbURL.toString(),
          });
          await client.connect();
          await client.quit();
        } catch {
          return false;
        }
        return true;
      },
      {interval: 500, timeout: 20000},
    );
    storage = new RedisSessionStorage(dbURL);
    await storage.ready;
  });

  afterAll(async () => {
    await storage.disconnect();
    await exec(`docker rm -f ${containerId}`);
  });

  batteryOfTests(async () => storage);
});
