import {Session} from './session';

export interface SessionStorage {
  storeSession(session: Session): Promise<boolean>;

  loadSession(id: string): Promise<Session | null>;

  deleteSession(id: string): Promise<boolean>;

  cleanUpOldSessions(threshold: number): Promise<void>;
}
