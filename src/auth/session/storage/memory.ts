import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';
import {sanitizeShop} from '../../../utils/shop-validator';

export class MemorySessionStorage implements SessionStorage {
  private sessions: {[id: string]: SessionInterface} = {};

  public async storeSession(session: SessionInterface): Promise<boolean> {
    this.sessions[session.id] = session;
    return true;
  }

  public async loadSession(id: string): Promise<SessionInterface | undefined> {
    return this.sessions[id] || undefined;
  }

  public async deleteSession(id: string): Promise<boolean> {
    if (this.sessions[id]) {
      delete this.sessions[id];
    }
    return true;
  }

  public async deleteSessions(ids: string[]): Promise<boolean> {
    ids.forEach((id) => delete this.sessions[id]);
    return true;
  }

  public async findSessionsByShop(shop: string): Promise<SessionInterface[]> {
    const cleanShop = sanitizeShop(shop, true)!;

    const results = Object.values(this.sessions).filter(
      (session) => session.shop === cleanShop,
    );
    return results;
  }
}
