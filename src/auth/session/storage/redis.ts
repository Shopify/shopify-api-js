import {createClient, RedisClientType} from 'redis';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {sessionFromEntries, sessionEntries} from '../session';

export interface RedisSessionStorageOptions {
  sessionKeyPrefix: string;
}
const defaultRedisSessionStorageOptions: RedisSessionStorageOptions = {
  sessionKeyPrefix: 'shopify_node_api_sessions',
};

export class RedisSessionStorage implements SessionStorage {
  static withCredentials(
    host: string,
    db: number,
    username: string,
    password: string,
    opts: Partial<RedisSessionStorageOptions>,
  ) {
    return new RedisSessionStorage(
      new URL(
        `redis://${encodeURIComponent(username)}:${encodeURIComponent(
          password,
        )}@${host}/${db}`,
      ),
      opts,
    );
  }

  public readonly ready: Promise<void>;
  private options: RedisSessionStorageOptions;
  private client: RedisClientType;

  constructor(
    private dbUrl: URL,
    opts: Partial<RedisSessionStorageOptions> = {},
  ) {
    if (typeof this.dbUrl === 'string') {
      this.dbUrl = new URL(this.dbUrl);
    }
    this.options = {...defaultRedisSessionStorageOptions, ...opts};
    this.ready = this.init();
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.ready;

    await this.client.set(
      this.fullKey(session.id),
      JSON.stringify(sessionEntries(session)),
    );
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    await this.ready;

    let rawResult: any = await this.client.get(this.fullKey(id));

    if (!rawResult) return undefined;
    rawResult = JSON.parse(rawResult);

    return sessionFromEntries(rawResult);
  }

  public async deleteSession(id: string): Promise<boolean> {
    await this.ready;
    await this.client.del(this.fullKey(id));
    return true;
  }

  public async disconnect(): Promise<void> {
    await this.client.quit();
  }

  private fullKey(name: string): string {
    return `${this.options.sessionKeyPrefix}_${name}`;
  }

  private async init() {
    this.client = createClient({
      url: this.dbUrl.toString(),
    });
    await this.client.connect();
  }
}
