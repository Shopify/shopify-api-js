import mysql from 'mysql2/promise';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {sessionFromEntries, sessionEntries} from '../session-utils';
import {sanitizeShop} from '../../../utils/shop-validator';

export interface MySQLSessionStorageOptions {
  sessionTableName: string;
}
const defaultMySQLSessionStorageOptions: MySQLSessionStorageOptions = {
  sessionTableName: 'shopify_sessions',
};

export class MySQLSessionStorage implements SessionStorage {
  static withCredentials(
    host: string,
    dbName: string,
    username: string,
    password: string,
    opts: Partial<MySQLSessionStorageOptions>,
  ) {
    return new MySQLSessionStorage(
      new URL(
        `mysql://${encodeURIComponent(username)}:${encodeURIComponent(
          password,
        )}@${host}/${encodeURIComponent(dbName)}`,
      ),
      opts,
    );
  }

  public readonly ready: Promise<void>;
  private options: MySQLSessionStorageOptions;
  private connection: mysql.Connection;

  constructor(
    private dbUrl: URL,
    opts: Partial<MySQLSessionStorageOptions> = {},
  ) {
    if (typeof this.dbUrl === 'string') {
      this.dbUrl = new URL(this.dbUrl);
    }
    this.options = {...defaultMySQLSessionStorageOptions, ...opts};
    this.ready = this.init();
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.ready;

    const entries = sessionEntries(session);
    const query = `
      REPLACE INTO ${this.options.sessionTableName}
      (${entries.map(([key]) => key).join(', ')})
      VALUES (${entries.map(() => `?`).join(', ')})
    `;
    await this.query(
      query,
      entries.map(([_key, value]) => value),
    );
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    await this.ready;
    const query = `
      SELECT * FROM \`${this.options.sessionTableName}\`
      WHERE id = ?;
    `;
    const [rows] = await this.query(query, [id]);
    if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
    const rawResult = rows[0] as any;
    return sessionFromEntries(Object.entries(rawResult));
  }

  public async deleteSession(id: string): Promise<boolean> {
    await this.ready;
    const query = `
      DELETE FROM ${this.options.sessionTableName}
      WHERE id = ?;
    `;
    await this.query(query, [id]);
    return true;
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    await this.ready;
    const query = `
      DELETE FROM ${this.options.sessionTableName}
      WHERE id IN (${ids.map(() => '?').join(',')});
    `;
    await this.query(query, ids);
    return true;
  }

  public async findSessionsByShop(shop: string): Promise<SessionInterface[]> {
    await this.ready;
    const cleanShop = sanitizeShop(shop, true)!;

    const query = `
      SELECT * FROM ${this.options.sessionTableName}
      WHERE shop = ?;
    `;
    const [rows] = await this.query(query, [cleanShop]);
    if (!Array.isArray(rows) || rows?.length === 0) return [];

    const results: SessionInterface[] = rows.map((row) => {
      return sessionFromEntries(Object.entries(row as any));
    });
    return results;
  }

  public async disconnect(): Promise<void> {
    await this.connection.end();
  }

  private async init() {
    this.connection = await mysql.createConnection(this.dbUrl.toString());
    await this.createTable();
  }

  private async hasSessionTable(): Promise<boolean> {
    const query = `
      SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ?;
    `;
    const [rows] = await this.query(query, [this.options.sessionTableName]);
    return Array.isArray(rows) && rows.length === 1;
  }

  private async createTable() {
    const hasSessionTable = await this.hasSessionTable();
    if (!hasSessionTable) {
      const query = `
        CREATE TABLE ${this.options.sessionTableName} (
          id varchar(255) NOT NULL PRIMARY KEY,
          shop varchar(255) NOT NULL,
          state varchar(255) NOT NULL,
          isOnline tinyint NOT NULL,
          scope varchar(255),
          expires integer,
          onlineAccessInfo varchar(255),
          accessToken varchar(255)
        )
      `;
      await this.query(query);
    }
  }

  private query(sql: string, params: any[] = []): Promise<any> {
    return this.connection.query(sql, params);
  }
}
