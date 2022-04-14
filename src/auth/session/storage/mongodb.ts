import * as mongodb from 'mongodb';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {Session} from '../session';

export interface MongoDBSessionStorageOptions {
  createCollectionWhenMissing: boolean;
  sessionCollectionName: string;
}
const defaultMongoDBSessionStorageOptions: MongoDBSessionStorageOptions = {
  createCollectionWhenMissing: true,
  sessionCollectionName: 'shopify_node_api_sessions',
};

export class MongoDBSessionStorage implements SessionStorage {
  static withCredentials(
    host: string,
    dbName: string,
    username: string,
    password: string,
    opts: Partial<MongoDBSessionStorageOptions>,
  ) {
    return new MongoDBSessionStorage(
      new URL(
        `mongodb://${encodeURIComponent(username)}:${encodeURIComponent(
          password,
        )}@${host}/`,
      ),
      dbName,
      opts,
    );
  }

  public readonly ready: Promise<void>;
  private options: MongoDBSessionStorageOptions;
  // FIXME: `mongodb` has no types for `MongoClient`???!
  private client: any;

  constructor(
    private dbUrl: URL,
    private dbName: string,
    opts: Partial<MongoDBSessionStorageOptions> = {},
  ) {
    if (typeof this.dbUrl === 'string') {
      this.dbUrl = new URL(this.dbUrl);
    }
    this.options = {...defaultMongoDBSessionStorageOptions, ...opts};
    this.ready = this.init();
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.ready;

    await this.collection.findOneAndReplace({id: session.id}, session, {
      upsert: true,
    });
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    await this.ready;

    const rawResult = await this.collection.findOne({id});

    if (!rawResult) return undefined;

    const result = new Session(
      rawResult.id,
      rawResult.shop,
      rawResult.state,
      rawResult.isOnline,
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
    await this.collection.deleteOne({id});
    return true;
  }

  public async disconnect(): Promise<void> {
    await this.client.close();
  }

  private get collection() {
    return this.client
      .db(this.dbName)
      .collection(this.options.sessionCollectionName);
  }

  private async init() {
    this.client = new (mongodb as any).MongoClient(this.dbUrl.toString());
    await this.client.connect();
    await this.client.db().command({ping: 1});
    await this.createCollection();
  }

  private async hasSessionCollection(): Promise<boolean> {
    const collections = await this.client.db().collections();
    return collections
      .map((collection: any) => collection.collectionName)
      .includes(this.options.sessionCollectionName);
  }

  private async createCollection() {
    const hasSessionCollection = await this.hasSessionCollection();
    if (!hasSessionCollection && !this.options.createCollectionWhenMissing) {
      throw Error('Session collection is missing');
    } else if (!hasSessionCollection) {
      await this.client.db().collection(this.options.sessionCollectionName);
    }
  }
}
