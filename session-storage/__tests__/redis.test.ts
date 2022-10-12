import * as child_process from 'child_process';
import {promisify} from 'util';
import {resolve} from 'path';

import {RedisSessionStorage} from '../redis';

import {batteryOfTests} from './battery-of-tests';
import {wait} from './utils';

const exec = promisify(child_process.exec);

const dbURL = new URL('redis://shopify:passify@localhost/1');

describe('RedisSessionStorage', () => {
  let storage: RedisSessionStorage | undefined;
  let containerId: string | undefined;
  beforeAll(async () => {
    const configPath = resolve(__dirname, './redis.conf');
    const runCommand = await exec(
      `podman run -d -p 6379:6379 -v ${configPath}:/redis.conf redis:6 redis-server /redis.conf`,
      {encoding: 'utf8'},
    );
    containerId = runCommand.stdout.trim();

    // Give the container a lot of time to set up since polling is ineffective with podman
    await wait(10000);

    storage = new RedisSessionStorage(dbURL);
    await storage.ready;
  });

  afterAll(async () => {
    await storage?.disconnect();
    if (containerId) await exec(`podman rm -f ${containerId}`);
  });

  batteryOfTests(async () => storage!);
});
