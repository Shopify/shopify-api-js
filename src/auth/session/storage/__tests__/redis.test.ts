import * as child_process from 'child_process';
import {promisify} from 'util';
import {resolve} from 'path';
import * as net from 'net';

import {RedisSessionStorage} from '../redis';

import {batteryOfTests} from './battery-of-tests';
import {poll, connectSocket, waitForData} from './utils';

const exec = promisify(child_process.exec);

const dbURL = new URL('redis://shopify:passify@localhost/1');

// SORRY NOT SORRY. Docker containers can take quite a while to get ready,
// especially on CI. This is hopefully enough.
jest.setTimeout(30000);

describe('RedisSessionStorage', () => {
  let storage: RedisSessionStorage | undefined;
  let containerId: string | undefined;
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
          const socket = new net.Socket();
          await Promise.race([
            connectSocket(socket, {
              port: 6379,
              host: 'localhost',
            }),
          ]);
          // Invalid command will trigger a text response from the server,
          // indicating that the server is ready and listening.
          socket.end('HELP I’M TRAPPED IN A REDIS FACTORY\n');
          const data = await waitForData(socket);
          if (data === 'no data') return false;
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
    await storage?.disconnect();
    if (containerId) await exec(`docker rm -f ${containerId}`);
  });

  batteryOfTests(async () => storage!);
});
