import {Session} from './session';
import {SessionStorage} from './session_storage';
import {MemorySessionStorage} from './storage/memory';
import {CustomSessionStorage} from './storage/custom';
import {MySQLSessionStorage} from './storage/mysql';
import {MongoDBSessionStorage} from './storage/mongodb';
import {PostgreSQLSessionStorage} from './storage/postgresql';
import {RedisSessionStorage} from './storage/redis';
import {SQLiteSessionStorage} from './storage/sqlite';

const ShopifySession = {
  Session,
  MemorySessionStorage,
  CustomSessionStorage,
  MySQLSessionStorage,
  MongoDBSessionStorage,
  PostgreSQLSessionStorage,
  RedisSessionStorage,
  SQLiteSessionStorage,
};

export default ShopifySession;
export {
  Session,
  SessionStorage,
  MemorySessionStorage,
  CustomSessionStorage,
  MySQLSessionStorage,
  MongoDBSessionStorage,
  PostgreSQLSessionStorage,
  RedisSessionStorage,
  SQLiteSessionStorage,
};
