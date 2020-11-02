import {Session} from '../session';
import {SessionStorage} from '../session_storage';

export class MemorySessionStorage implements SessionStorage {
  private sessions: {[id: string]: Session} = {};

  public async storeSession(session: Session): Promise<boolean> {
    this.sessions[session.id] = session;
    return true;
  }

  public async loadSession(id: string): Promise<Session | null> {
    return this.sessions[id] || null;
  }

  public async deleteSession(id: string): Promise<boolean> {
    if (this.sessions[id]) {
      delete this.sessions[id];
    }
    return true;
  }

  public async cleanUpOldSessions(threshold: number): Promise<void> {
    for (const id in this.sessions) {
      if (this.sessions[id].expires < threshold) {
        await this.deleteSession(id);
      }
    }
  }
}
