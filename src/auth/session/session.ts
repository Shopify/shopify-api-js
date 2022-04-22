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

/**
 * Like Object.fromEntries(), but normalizes the keys and filters out null values.
 */
export function sessionFromEntries(
  entries: [string, string | number][],
): SessionInterface {
  const obj = Object.fromEntries(
    entries
      .filter(([_key, value]) => value !== null)
      .map(([key, value]) => {
        switch (key.toLowerCase()) {
          case 'isonline':
            return ['isOnline', value];
          case 'accesstoken':
            return ['accessToken', value];
          default:
            return [key.toLowerCase(), value];
        }
      }),
  ) as any;
  if (typeof obj.isOnline === 'string') {
    obj.isOnline = obj.isOnline.toString().toLowerCase() === 'true';
  } else if (typeof obj.isOnline === 'number') {
    obj.isOnline = Boolean(obj.isOnline);
  }
  if (obj.scope) obj.scope = obj.scope.toString();
  return obj;
}

const includedKeys = [
  'id',
  'shop',
  'state',
  'isOnline',
  'scope',
  'accessToken',
];
export function sessionEntries(
  session: SessionInterface,
): [string, string | number][] {
  return Object.entries(session).filter(([key]) => includedKeys.includes(key));
}
