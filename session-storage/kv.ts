import {SessionInterface} from '../lib/session/types';
import {SessionStorage} from '../lib/session/session_storage';
import {createSanitizeShop} from '../lib/utils/shop-validator';
import {sessionEntries, sessionFromEntries} from '../lib/session/session-utils';

export class KVSessionStorage extends SessionStorage {
  private bucket: KVNamespace;

  constructor(bucket?: KVNamespace | undefined) {
    super();

    if (bucket) {
      this.setBucket(bucket);
    }
  }

  public setBucket(bucket: KVNamespace) {
    this.bucket = bucket;
  }

  public async storeSession(session: SessionInterface): Promise<boolean> {
    await this.bucket.put(session.id, JSON.stringify(sessionEntries(session)));
    await this.addShopIds(session.shop, [session.id]);
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    const sessionData = await this.bucket.get<[string, string | number][]>(
      id,
      'json',
    );
    return sessionData ? sessionFromEntries(sessionData) : undefined;
  }

  public async deleteSession(id: string): Promise<boolean> {
    const session = await this.loadSession(id);
    if (!session) {
      return true;
    }

    await this.bucket.delete(id);
    await this.removeShopIds(session.shop, [session.id]);
    return true;
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    let result = true;
    for (const id of ids) {
      result = result && (await this.deleteSession(id));
    }

    return result;
  }

  public async findSessionsByShop(shop: string): Promise<SessionInterface[]> {
    const cleanShop = createSanitizeShop(this.config)(shop, true)!;

    const sessionIds = await this.bucket.get<string[]>(
      this.getShopSessionIdsKey(cleanShop),
      {
        type: 'json',
      },
    );

    if (!sessionIds) {
      return [];
    }

    return Promise.all(
      sessionIds.map(async (id) => (await this.loadSession(id))!),
    );
  }

  private getShopSessionIdsKey(shop: string): string {
    return `shop:${shop}`;
  }

  private async addShopIds(shop: string, ids: string[]) {
    const key = this.getShopSessionIdsKey(shop);
    const shopIds = (await this.bucket.get<string[]>(key, 'json')) ?? [];
    await this.bucket.put(key, JSON.stringify([...shopIds, ...ids]));
  }

  private async removeShopIds(shop: string, ids: string[]) {
    const key = this.getShopSessionIdsKey(shop);
    const shopIds = (await this.bucket.get<string[]>(key, 'json')) ?? [];
    await this.bucket.put(
      key,
      JSON.stringify(shopIds.filter((id) => !ids.includes(id))),
    );
  }
}
