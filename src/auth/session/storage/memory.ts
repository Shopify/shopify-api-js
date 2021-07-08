import {SessionInterface} from '../types';
import {SessionStorage} from '../session_storage';

export class MemorySessionStorage implements SessionStorage {
  private sessions: {[id: string]: SessionInterface;} = {};

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
}
