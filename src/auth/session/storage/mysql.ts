import mysql from 'mysql2/promise';
import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';

export interface MySQLSessionStorageOptions {
  createDBWhenMissing: boolean;
  sessionTableName: string;
}
const defaultMySQLSessionStorageOptions: MySQLSessionStorageOptions = {
  createDBWhenMissing: true,
  sessionTableName: 'sessions',
};

export class MySQLSessionStorage implements SessionStorage {
  private options: MySQLSessionStorageOptions;
  private ready: Promise<void>;
  private connection: mysql.Connection;

  constructor(private dbUrl: URL, opts: Partial<MySQLSessionStorageOptions>) {
    this.options = {...defaultMySQLSessionStorageOptions, ...opts};
    this.ready = this.init();
  }

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
    ); // ?ssl={"rejectUnauthorized":true}
  }

  private async init() {
    this.connection = await mysql.createConnection(this.dbUrl.toString());
    await this.createTable();
  }

  private async createTable() {
    const query = sql`
      IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = N'${this.options.sessionTableName}')
      BEGIN
        CREATE TABLE '${this.options.sessionTableName}' (
          'id' varchar(255) NOT NULL PRIMARY KEY,
          'payload' varchar(4095) NOT NULL,
        )
      END
    `;
    await this.connection.query(query);
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.ready;
    const id = session.id;
    const payload = JSON.stringify(session);

    const query = sql`
      INSERT INTO ${this.options.sessionTableName}
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
}

/**
 * Quick’n’dirty tagged template literal to allow string interpolation with
 * backticks without conflicting with SQL’s usage of backticks.
 * It effectively replaces single quotes with backticks,
 * leaving double quotes for strings.
 */
function sql({raw}: Parameters<typeof String.raw>[0], ...substitutions: any[]) {
  return String.raw(
    {raw: Array.from(raw).map((raw) => raw.replace(/'/g, '`'))},
    substitutions,
  );
}
