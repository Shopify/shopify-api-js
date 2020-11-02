import {Session} from '../session';
import {SessionStorage} from '../session_storage';

export class CustomSessionStorage implements SessionStorage {
  constructor(
    readonly storeCallback: (session: Session) => boolean,
    readonly loadCallback: (id: string) => Session | null,
    readonly deleteCallback: (id: string) => boolean,
    readonly cleanUpCallback: (threshold: number) => void
  ) {
    this.storeCallback = storeCallback;
    this.loadCallback = loadCallback;
    this.deleteCallback = deleteCallback;
    this.cleanUpCallback = cleanUpCallback;
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

  public async cleanUpOldSessions(threshold: number): Promise<void> {
    this.cleanUpCallback(threshold);
  }
}
