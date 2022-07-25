import * as child_process from 'child_process';
import {promisify} from 'util';

import * as mongodb from 'mongodb';

import {MongoDBSessionStorage} from '../mongodb';

import {batteryOfTests} from './battery-of-tests';
import {poll} from './utils';

const exec = promisify(child_process.exec);

const dbURL = new URL('mongodb://shopify:passify@localhost');
const dbName = 'shopitest';

// SORRY NOT SORRY. Docker containers can take quite a while to get ready,
// especially on CI. This is hopefully enough.
jest.setTimeout(30000);

describe('MongoDBSessionStorage', () => {
  let storage: MongoDBSessionStorage;
  let containerId: string;
  beforeAll(async () => {
    const runCommand = await exec(
      'docker run -d -e MONGO_INITDB_DATABASE=shopitest -e MONGO_INITDB_ROOT_USERNAME=shopify -e MONGO_INITDB_ROOT_PASSWORD=passify -p 27017:27017 mongo:5',
      {encoding: 'utf8'},
    );
    containerId = runCommand.stdout.trim();

    await poll(
      async () => {
        try {
          const client = new (mongodb as any).MongoClient(dbURL.toString());
          await client.connect();
          await client.db().command({ping: 1});
          client.close();
        } catch {
          return false;
        }
        return true;
      },
      {interval: 500, timeout: 20000},
    );
    storage = new MongoDBSessionStorage(dbURL, dbName);
  });

  afterAll(async () => {
    await storage.disconnect();
    await exec(`docker rm -f ${containerId}`);
  });

  batteryOfTests(async () => storage);
});
