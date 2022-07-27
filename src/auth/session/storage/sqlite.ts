import sqlite3 from 'sqlite3';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {sessionFromEntries, sessionEntries} from '../session-utils';
import {sanitizeShop} from '../../../utils/shop-validator';

export interface SQLiteSessionStorageOptions {
  sessionTableName: string;
}
const defaultSQLiteSessionStorageOptions: SQLiteSessionStorageOptions = {
  sessionTableName: 'shopify_sessions',
};

export class SQLiteSessionStorage implements SessionStorage {
  private options: SQLiteSessionStorageOptions;
  private db: sqlite3.Database;
  private ready: Promise<void>;

  constructor(
    private filename: string,
    opts: Partial<SQLiteSessionStorageOptions> = {},
  ) {
    this.options = {...defaultSQLiteSessionStorageOptions, ...opts};
    this.db = new sqlite3.Database(this.filename);
    this.ready = this.init();
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.ready;

    const entries = sessionEntries(session);

    const query = `
      INSERT OR REPLACE INTO ${this.options.sessionTableName}
      (${entries.map(([key]) => key).join(', ')})
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
    const cleanShop = sanitizeShop(shop, true)!;

    await this.ready;
    const query = `
      SELECT * FROM ${this.options.sessionTableName}
      WHERE shop = ?;
    `;
    const rows = await this.query(query, [cleanShop]);
    if (!Array.isArray(rows) || rows?.length === 0) return [];

    const results: SessionInterface[] = rows.map((row) => {
      return sessionFromEntries(Object.entries(row as any));
    });
    return results;
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
    if (!hasSessionTable) {
      const query = `
        CREATE TABLE ${this.options.sessionTableName} (
          id varchar(255) NOT NULL PRIMARY KEY,
          shop varchar(255) NOT NULL,
          state varchar(255) NOT NULL,
          isOnline integer NOT NULL,
          expires integer,
          scope varchar(255),
          accessToken varchar(255),
          onlineAccessInfo varchar(255)
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
