import * as child_process from 'child_process';
import {promisify} from 'util';

import pg from 'pg';

import {PostgreSQLSessionStorage} from '../postgresql';

import {batteryOfTests} from './battery-of-tests';
import {poll} from './utils';

const exec = promisify(child_process.exec);

const dbURL = new URL('postgres://shopify:passify@localhost/shopitest');

// SORRY NOT SORRY. Docker containers can take quite a while to get ready,
// especially on CI. This is hopefully enough.
jest.setTimeout(30000);

describe('PostgreSQLSessionStorage', () => {
  let storage: PostgreSQLSessionStorage;
  let containerId: string;
  beforeAll(async () => {
    const runCommand = await exec(
      'docker run -d -e POSTGRES_DB=shopitest -e POSTGRES_USER=shopify -e POSTGRES_PASSWORD=passify -p 5432:5432 postgres:14',
      {encoding: 'utf8'},
    );
    containerId = runCommand.stdout.trim();

    await poll(
      async () => {
        try {
          const client = new pg.Client({connectionString: dbURL.toString()});
          await new Promise<void>((resolve, reject) => {
            client.connect((err) => {
              if (err) reject(err);
              resolve();
            });
          });
          await client.end();
        } catch {
          return false;
        }
        return true;
      },
      {interval: 500, timeout: 20000},
    );
    storage = new PostgreSQLSessionStorage(dbURL);
    await storage.ready;
  });

  afterAll(async () => {
    await storage.disconnect();
    await exec(`docker rm -f ${containerId}`);
  });

  batteryOfTests(async () => storage);
});
