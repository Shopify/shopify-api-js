import { Session } from '../session';
import { SessionStorage } from '../session_storage';

export class CustomSessionStorage implements SessionStorage {
  constructor(
    readonly storeCallback: (session: Session) => boolean,
    readonly loadCallback: (id: string) => Session | null,
    readonly deleteCallback: (id: string) => boolean,
  ) {
    this.storeCallback = storeCallback;
    this.loadCallback = loadCallback;
    this.deleteCallback = deleteCallback;
  }

  public async storeSession(session: Session): Promise<boolean> {
    return this.storeCallback(session);
  }

  public async loadSession(id: string): Promise<Session | null> {
    return this.loadCallback(id);
  }

  public async deleteSession(id: string): Promise<boolean> {
    return this.deleteCallback(id);
  }
}
