import {Context} from '../../context';
import {OnlineAccessInfo} from '../oauth/types';

import {SessionInterface} from './types';

/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
class Session implements SessionInterface {
  public static cloneSession(session: Session, newId: string): Session {
    const newSession = new Session(
      newId,
      session.shop,
      session.state,
      session.isOnline,
    );

    newSession.scope = session.scope;
    newSession.expires = session.expires;
    newSession.accessToken = session.accessToken;
    newSession.onlineAccessInfo = session.onlineAccessInfo;

    return newSession;
  }

  public scope?: string;
  public expires?: Date;
  public accessToken?: string;
  public onlineAccessInfo?: OnlineAccessInfo;

  constructor(
    readonly id: string,
    public shop: string,
    public state: string,
    public isOnline: boolean,
  ) {}

  public isActive(): boolean {
    const scopesUnchanged = Context.SCOPES.equals(this.scope);
    if (
      scopesUnchanged &&
      this.accessToken &&
      (!this.expires || this.expires >= new Date())
    ) {
      return true;
    }
    return false;
  }
}

export {Session};
