import * as child_process from 'child_process';
import {promisify} from 'util';

import {MySQLSessionStorage} from '../mysql';

import {batteryOfTests} from './battery-of-tests';
import {pollTCPSocketForAResponse} from './utils';

const exec = promisify(child_process.exec);

const dbURL = new URL('mysql://shopify:passify@localhost/shopitest');

// SORRY NOT SORRY
jest.setTimeout(20000);

describe('MySQLSessionStorage', () => {
  let storage: MySQLSessionStorage;
  let containerId: string;
  beforeAll(async () => {
    const runCommand = await exec(
      'docker run -d -e MYSQL_DATABASE=shopitest -e MYSQL_USER=shopify -e MYSQL_PASSWORD=passify -e MYSQL_RANDOM_ROOT_PASSWORD=1 -p 3306:3306 mysql:8-oracle',
      {encoding: 'utf8'},
    );
    containerId = runCommand.stdout.trim();
    // This seems to be necessary :S
    await pollTCPSocketForAResponse(3306, '127.0.0.1', {
      interval: 500,
      timeout: 20000,
    });
    storage = new MySQLSessionStorage(dbURL, {createDBWhenMissing: true});
  });

  afterAll(async () => {
    await exec(`docker rm -f ${containerId}`);
  });

  batteryOfTests(async () => storage);
});
