import mysql from 'mysql2/promise';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {Session} from '../session';

export interface MySQLSessionStorageOptions {
  createDBWhenMissing: boolean;
  sessionTableName: string;
}
const defaultMySQLSessionStorageOptions: MySQLSessionStorageOptions = {
  createDBWhenMissing: true,
  sessionTableName: 'shopify_node_api_sessions',
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

    const query = `
      REPLACE INTO ${this.options.sessionTableName}
      (${Object.keys(session).join(', ')})
      VALUES (${Object.values(session)
        .map(() => `?`)
        .join(', ')})
    `;
    await this.query(query, Object.values(session));
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

    const result = new Session(
      rawResult.id,
      rawResult.shop,
      rawResult.state,
      rawResult.isOnline !== 0,
    );
    if (rawResult.onlineAccessInfo) {
      result.onlineAccessInfo = JSON.parse(
        rawResult.onlineAccessInfo as any,
      ) as any;
    }
    if (rawResult.expires) result.expires = new Date(rawResult.expires);
    if (rawResult.scope) result.scope = rawResult.scope;
    if (rawResult.accessToken) result.accessToken = rawResult.accessToken;

    return result;
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
    if (!hasSessionTable && !this.options.createDBWhenMissing) {
      throw Error('Session Table is missing');
    } else if (!hasSessionTable) {
      const query = `
        CREATE TABLE ${this.options.sessionTableName} (
          id varchar(255) NOT NULL PRIMARY KEY,
          shop varchar(255) NOT NULL,
          state varchar(255) NOT NULL,
          isOnline tinyint NOT NULL,
          scope varchar(255),
          expires varchar(255),
          accessToken varchar(255),
          onlineAccessInfo varchar(4096)
        )
      `;
      await this.query(query);
    }
  }

  private query(sql: string, params: any[] = []): Promise<any> {
    return this.connection.query(sql, params);
  }
}
