import {OnlineAccessInfo} from '../auth/oauth/types';
import {AuthScopes} from '../auth/scopes';

import {SessionInterface, SessionParams} from './types';

/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
export class Session implements SessionInterface {
  readonly id: string;
  public shop: string;
  public state: string;
  public isOnline: boolean;
  public scope?: string;
  public expires?: Date;
  public accessToken?: string;
  public onlineAccessInfo?: OnlineAccessInfo;

  constructor(params: SessionParams) {
    Object.assign(this, params);
  }

  public isActive(scopes: AuthScopes | string | string[]): boolean {
    const scopesObject =
      scopes instanceof AuthScopes ? scopes : new AuthScopes(scopes);

    const scopesUnchanged = scopesObject.equals(this.scope);
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
