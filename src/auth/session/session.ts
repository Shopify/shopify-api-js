import {OnlineAccessInfo} from '../oauth/types';
import {Context} from '../../context';

import {SessionInterface} from './types';

/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
class Session implements SessionInterface {
  public static cloneSession(session: Session, newId: string): Session {
    const newSession = new Session(newId);

    newSession.shop = session.shop;
    newSession.state = session.state;
    newSession.scope = session.scope;
    newSession.expires = session.expires;
    newSession.isOnline = session.isOnline;
    newSession.accessToken = session.accessToken;
    newSession.onlineAccessInfo = session.onlineAccessInfo;

    return newSession;
  }

  public shop: string;
  public state: string;
  public scope: string;
  public expires?: Date;
  public isOnline?: boolean;
  public accessToken?: string;
  public onlineAccessInfo?: OnlineAccessInfo;

  constructor(readonly id: string) {}

  public isActive(): boolean {
    const scopesUnchanged = Context.SCOPES.equals(this.scope);
    if (scopesUnchanged && this.accessToken && (!this.expires || this.expires >= new Date())) {
      return true;
    }
    return false;
  }
}

export {Session};
