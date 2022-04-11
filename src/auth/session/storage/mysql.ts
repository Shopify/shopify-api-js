import mysql from 'mysql2/promise';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';

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

  private options: MySQLSessionStorageOptions;
  private ready: Promise<void>;
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

  public async hasSessionTable(): Promise<boolean> {
    const query = sql`
      SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = ${JSON.stringify(
        this.options.sessionTableName,
      )}
    `;
    const [rows] = await this.connection.query(query);
    return Array.isArray(rows) && rows.length === 1;
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.ready;
    const id = session.id;
    const payload = JSON.stringify(session);

    const query = sql`
      REPLACE INTO ${this.options.sessionTableName}
      VALUES (${JSON.stringify(id)}, ${JSON.stringify(payload)});
    `;
    await this.connection.query(query);
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    await this.ready;
    const query = sql`
      SELECT payload FROM ${this.options.sessionTableName}
      WHERE id = ${JSON.stringify(id)};
    `;
    const [rows] = await this.connection.query(query);
    if (!Array.isArray(rows) || rows?.length !== 1) return undefined;
    return JSON.parse((rows[0] as any).payload);
  }

  public async deleteSession(id: string): Promise<boolean> {
    await this.ready;
    const query = sql`
      DELETE FROM ${this.options.sessionTableName}
      WHERE id = ${JSON.stringify(id)};
    `;
    await this.connection.query(query);
    return true;
  }

  public async disconnect(): Promise<void> {
    await this.connection.end();
  }

  private async init() {
    this.connection = await mysql.createConnection(this.dbUrl.toString());
    await this.createTable();
  }

  private async createTable() {
    const hasSessionTable = await this.hasSessionTable();
    if (!hasSessionTable && !this.options.createDBWhenMissing) {
      throw Error('Session Table is missing');
    } else if (!hasSessionTable) {
      const query = sql`
        CREATE TABLE ${this.options.sessionTableName} (
          id varchar(255) NOT NULL PRIMARY KEY,
          payload varchar(4095) NOT NULL
        )
      `;
      await this.connection.query(query);
    }
  }
}

/**
 * Quick’n’dirty tagged template literal to allow string interpolation with
 * backticks without conflicting with SQL’s usage of backticks.
 * It effectively replaces single quotes with backticks,
 * leaving double quotes for strings.
 */
function sql(raw: Parameters<typeof String.raw>[0], ...substitutions: any[]) {
  return String.raw(
    {raw: raw.map((raw) => raw.replace(/'/g, '`'))} as any,
    ...substitutions,
  );
}
