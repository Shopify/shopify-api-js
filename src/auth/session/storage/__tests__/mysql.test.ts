import {MySQLSessionStorage} from '../mysql';

import {batteryOfTests} from './battery-of-tests';

const dbURL = new URL('mysql://shopify:passify@localhost/shopitest');

describe('MySQLSessionStorage', () => {
  let storage: MySQLSessionStorage;
  beforeAll(async () => {
    // spawn("docker run -e MYSQL_DATABASE=shopitest -e MYSQL_USER=shopify -e MYSQL_PASSWORD=passify -e MYSQL_RANDOM_ROOT_PASSWORD=1 -p 3306:3306 mysql:8-oracle");
    storage = new MySQLSessionStorage(dbURL, {createDBWhenMissing: true});
  });

  afterAll(async () => {
    await storage.disconnect();
  });

  batteryOfTests(async () => storage);
});
