import {OnlineAccessInfo} from '../auth/oauth/types';
import {AuthScopes} from '../auth/scopes';

import {SessionParams} from './types';

const includedKeys = [
  'id',
  'shop',
  'state',
  'isOnline',
  'scope',
  'accessToken',
  'expires',
  'onlineAccessInfo',
];

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

  public static deserialize(entries: [string, string | number][]): Session {
    const obj = Object.fromEntries(
      entries
        .filter(([_key, value]) => value !== null && value !== undefined)
        // Sanitize keys
        .map(([key, value]) => {
          switch (key.toLowerCase()) {
            case 'isonline':
              return ['isOnline', value];
            case 'accesstoken':
              return ['accessToken', value];
            case 'onlineaccessinfo':
              return ['onlineAccessInfo', value];
            default:
              return [key.toLowerCase(), value];
          }
        })
        // Sanitize values
        .map(([key, value]) => {
          switch (key) {
            case 'isOnline':
              if (typeof value === 'string') {
                return [key, value.toString().toLowerCase() === 'true'];
              } else if (typeof value === 'number') {
                return [key, Boolean(value)];
              }
              return [key, value];
            case 'scope':
              return [key, value.toString()];
            case 'expires':
              return [key, value ? new Date(Number(value) * 1000) : undefined];
            case 'onlineAccessInfo':
              return [
                key,
                {
                  associated_user: {
                    id: Number(value),
                  },
                },
              ];
            default:
              return [key, value];
          }
        }),
    ) as any;

    Object.setPrototypeOf(obj, Session.prototype);

    return obj;
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

  public serialize(): [string, string | number][] {
    return (
      Object.entries(this)
        .filter(
          ([key, value]) =>
            includedKeys.includes(key) && value !== undefined && value !== null,
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

  public equals(other: Session | undefined): boolean {
    if (!other) return false;

    const copyA = this.serialize();
    copyA.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));

    const copyB = other.serialize();
    copyB.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));

    return JSON.stringify(copyA) === JSON.stringify(copyB);
  }
}
