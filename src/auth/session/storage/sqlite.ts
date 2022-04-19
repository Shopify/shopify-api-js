import sqlite3 from 'sqlite3';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {sessionFromEntries, sessionEntries} from '../session';

export interface SQLiteSessionStorageOptions {
  createDBWhenMissing: boolean;
  sessionTableName: string;
}
const defaultMySQLSessionStorageOptions: SQLiteSessionStorageOptions = {
  createDBWhenMissing: true,
  sessionTableName: 'shopify_node_api_sessions',
};

export class SQLiteSessionStorage implements SessionStorage {
  private options: SQLiteSessionStorageOptions;
  private db: sqlite3.Database;
  private ready: Promise<void>;

  constructor(
    private filename: string,
    opts: Partial<SQLiteSessionStorageOptions> = {},
  ) {
    this.options = {...defaultMySQLSessionStorageOptions, ...opts};
    this.db = new sqlite3.Database(this.filename);
    this.ready = this.init();
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.ready;

    const entries = sessionEntries(session);

    const query = `
      INSERT OR REPLACE INTO ${this.options.sessionTableName}
      (${Object.keys(session).join(', ')})
      VALUES (${entries.map(() => '?').join(', ')});
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
      SELECT * FROM ${this.options.sessionTableName}
      WHERE id = ?;
    `;
    const rows = await this.query(query, [id]);
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

  private async hasSessionTable(): Promise<boolean> {
    const query = `
    SELECT name FROM sqlite_schema
    WHERE
      type = 'table' AND
      name = ?;
    `;
    const rows = await this.query(query, [this.options.sessionTableName]);
    return rows.length === 1;
  }

  private async init() {
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

  private query(sql: string, params: any[] = []): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}
