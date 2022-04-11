import sqlite3 from 'sqlite3';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';

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

    const id = session.id;
    const payload = JSON.stringify(session);

    const query = sql`
      INSERT OR REPLACE INTO ${this.options.sessionTableName}
      VALUES (${JSON.stringify(id)}, '${payload.replace(/"'"/g, "''")}');
    `;

    await this.query(query);
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    await this.ready;
    const query = sql`
      SELECT payload FROM ${this.options.sessionTableName}
      WHERE id = ${JSON.stringify(id)};
    `;
    const result = await this.query(query);
    if (!Array.isArray(result) || result?.length !== 1) return undefined;
    return JSON.parse((result[0] as any).payload);
  }

  public async deleteSession(id: string): Promise<boolean> {
    await this.ready;
    const query = sql`
      DELETE FROM ${this.options.sessionTableName}
      WHERE id = ${JSON.stringify(id)};
    `;
    await this.query(query);
    return true;
  }

  private async hasSessionTable(): Promise<boolean> {
    const query = sql`
    SELECT name FROM sqlite_schema
    WHERE
      type = "table" AND
      name = ${JSON.stringify(this.options.sessionTableName)}
    `;
    const rows = await this.query(query);
    return rows.length === 1;
  }

  private async init() {
    const hasSessionTable = await this.hasSessionTable();
    console.log({hasSessionTable});
    if (!hasSessionTable && !this.options.createDBWhenMissing) {
      throw Error('Session Table is missing');
    } else if (!hasSessionTable) {
      console.log('CREATING');
      const query = sql`
        CREATE TABLE ${this.options.sessionTableName} (
          id varchar(255) NOT NULL PRIMARY KEY,
          payload varchar(4095) NOT NULL
        )
      `;
      await this.query(query);
    }
  }

  private query(sql: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }
}

/**
 * Quick’n’dirty tagged template literal to allow string interpolation with
 * backticks without conflicting with SQL’s usage of backticks.
 * It effectively replaces single quotes with backticks,
 * leaving double quotes for strings.
 */
function sql(raw: Parameters<typeof String.raw>[0], ...substitutions: any[]) {
  return String.raw({raw} as any, ...substitutions);
}
