import * as child_process from 'child_process';
import {promisify} from 'util';

import mysql2 from 'mysql2/promise';

import {MySQLSessionStorage} from '../mysql';

import {batteryOfTests} from './battery-of-tests';
import {poll} from './utils';

const exec = promisify(child_process.exec);

const dbURL = new URL('mysql://shopify:passify@localhost/shopitest');

describe('MySQLSessionStorage', () => {
  let storage: MySQLSessionStorage;
  let containerId: string;
  beforeAll(async () => {
    const runCommand = await exec(
      'podman run -d -e MYSQL_DATABASE=shopitest -e MYSQL_USER=shopify -e MYSQL_PASSWORD=passify -e MYSQL_RANDOM_ROOT_PASSWORD=1 -p 3306:3306 mysql:8-oracle',
      {encoding: 'utf8'},
    );
    containerId = runCommand.stdout.trim();

    await poll(
      async () => {
        try {
          const connection = await mysql2.createConnection(dbURL.toString());
          await connection.end();
        } catch {
          return false;
        }
        return true;
      },
      {interval: 500, timeout: 20000},
    );
    storage = new MySQLSessionStorage(dbURL);
  });

  afterAll(async () => {
    await storage.disconnect();
    await exec(`podman rm -f ${containerId}`);
  });

  batteryOfTests(async () => storage);
});
