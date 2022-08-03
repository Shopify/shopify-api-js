import * as fs from 'fs/promises';

import {SQLiteSessionStorage} from '../sqlite';

import {batteryOfTests} from './battery-of-tests';

const sqliteDbFile = './sqlite.testDb';
describe('SQLiteSessionStorage', () => {
  let storage: SQLiteSessionStorage;
  beforeAll(async () => {
    await fs.unlink(sqliteDbFile).catch(() => {});
    storage = new SQLiteSessionStorage(sqliteDbFile);
  });

  afterAll(async () => {
    await fs.unlink(sqliteDbFile).catch(() => {});
  });

  batteryOfTests(async () => storage);
});
