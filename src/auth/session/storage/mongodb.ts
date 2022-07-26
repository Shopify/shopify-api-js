import * as mongodb from 'mongodb';

import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {sessionFromEntries, sessionEntries} from '../session-utils';
import {sanitizeShop} from '../../../utils/shop-validator';

export interface MongoDBSessionStorageOptions {
  sessionCollectionName: string;
}
const defaultMongoDBSessionStorageOptions: MongoDBSessionStorageOptions = {
  sessionCollectionName: 'shopify_sessions',
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
  // `mongodb` has no types for `MongoClient`???!
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

    await this.collection.findOneAndReplace(
      {id: session.id},
      Object.fromEntries(sessionEntries(session)),
      {
        upsert: true,
      },
    );
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    await this.ready;

    const result = await this.collection.findOne({id});

    return result ? sessionFromEntries(Object.entries(result)) : undefined;
  }

  public async deleteSession(id: string): Promise<boolean> {
    await this.ready;
    await this.collection.deleteOne({id});
    return true;
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    await this.ready;
    await this.collection.deleteMany({id: {$in: ids}});
    return true;
  }

  public async findSessionsByShop(shop: string): Promise<SessionInterface[]> {
    await this.ready;
    const cleanShop = sanitizeShop(shop, true)!;

    const rawResults = await this.collection.find({shop: cleanShop}).toArray();
    if (!rawResults || rawResults?.length === 0) return [];

    return rawResults.map((rawResult: any) =>
      sessionFromEntries(Object.entries(rawResult)),
    );
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
    if (!hasSessionCollection) {
      await this.client.db().collection(this.options.sessionCollectionName);
    }
  }
}
