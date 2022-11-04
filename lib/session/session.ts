import {OnlineAccessInfo} from '../auth/oauth/types';
import {AuthScopes} from '../auth/scopes';

import {SessionParams} from './types';

/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
export class Session {
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

  public serialize(): SessionParams {
    const object: SessionParams = {
      id: this.id,
      shop: this.shop,
      state: this.state,
      isOnline: this.isOnline,
    };

    if (this.scope) {
      object.scope = this.scope;
    }
    if (this.expires) {
      object.expires = this.expires;
    }
    if (this.accessToken) {
      object.accessToken = this.accessToken;
    }
    if (this.onlineAccessInfo) {
      object.onlineAccessInfo = this.onlineAccessInfo;
    }
    return object;
  }

  public equals(other: Session | undefined): boolean {
    if (!other) return false;

    const mandatoryPropsMatch =
      this.id === other.id &&
      this.shop === other.shop &&
      this.state === other.state &&
      this.isOnline === other.isOnline;

    if (!mandatoryPropsMatch) return false;

    const copyA = this.toArray();
    copyA.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));

    const copyB = other.toArray();
    copyB.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));

    return JSON.stringify(copyA) === JSON.stringify(copyB);
  }

  private toArray(): [string, string | number][] {
    const keys = Object.keys(this);

    return (
      Object.entries(this)
        .filter(
          ([key, value]) =>
            keys.includes(key) && value !== undefined && value !== null,
        )
        // Prepare values for db storage
        .map(([key, value]) => {
          switch (key) {
            case 'expires':
              return [
                key,
                value ? Math.floor(value.getTime() / 1000) : undefined,
              ];
            case 'onlineAccessInfo':
              return [key, value?.associated_user?.id];
            default:
              return [key, value];
          }
        })
    );
  }
}
