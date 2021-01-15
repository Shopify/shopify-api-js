import {OnlineAccessInfo} from '../types';

/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
class Session {
  public static cloneSession(session: Session, newId: string): Session {
    const newSession = new Session(newId);

    newSession.shop = session.shop;
    newSession.state = session.state;
    newSession.scope = session.scope;
    newSession.expires = session.expires;
    newSession.isOnline = session.isOnline;
    newSession.accessToken = session.accessToken;
    newSession.onlineAccesInfo = session.onlineAccesInfo;

    return newSession;
  }

  public shop: string;
  public state: string;
  public scope: string;
  public expires?: Date;
  public isOnline?: boolean;
  public accessToken?: string;
  public onlineAccesInfo?: OnlineAccessInfo;

  constructor(readonly id: string) {}
}

export {Session};
