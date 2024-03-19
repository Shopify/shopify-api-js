import {InvalidSession} from '../error';
import {OnlineAccessInfo, OnlineAccessUser} from '../auth/oauth/types';
import {AuthScopes} from '../auth/scopes';

import {SessionParams} from './types';

const propertiesToSave = [
  'id',
  'shop',
  'state',
  'isOnline',
  'scope',
  'accessToken',
  'expires',
  'onlineAccessInfo',
];

interface AssociatedUserObject {
  associated_user: Partial<OnlineAccessUser>;
}
/**
 * Stores App information from logged in merchants so they can make authenticated requests to the Admin API.
 */
export class Session {
  public static fromPropertyArray(
    entries: [string, string | number | boolean][],
  ): Session {
    if (!Array.isArray(entries)) {
      throw new InvalidSession(
        'The parameter is not an array: a Session cannot be created from this object.',
      );
    }

    const associatedUserObj: AssociatedUserObject = {
      associated_user: {},
    };
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
            case 'firstname':
              return ['firstName', value];
            case 'lastname':
              return ['lastName', value];
            case 'accountowner':
              return ['accountOwner', value];
            case 'emailverified':
              return ['emailVerified', value];
            case 'userid':
              return ['userId', value];
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
              return [key, value ? new Date(Number(value)) : undefined];
            case 'onlineAccessInfo':
              return [
                key,
                {
                  associated_user: {
                    id: Number(value),
                  },
                },
              ];
            case 'userId':
              return [
                key,
                (associatedUserObj.associated_user.id = Number(value)),
              ];
            case 'firstName':
              return [
                key,
                (associatedUserObj.associated_user.first_name = String(value)),
              ];
            case 'lastName':
              return [
                key,
                (associatedUserObj.associated_user.last_name = String(value)),
              ];
            case 'email':
              return [
                key,
                (associatedUserObj.associated_user.email = String(value)),
              ];
            case 'accountOwner':
              return [
                key,
                (associatedUserObj.associated_user.account_owner =
                  Boolean(value)),
              ];
            case 'locale':
              return [
                key,
                (associatedUserObj.associated_user.locale = String(value)),
              ];
            case 'collaborator':
              return [
                key,
                (associatedUserObj.associated_user.collaborator =
                  Boolean(value)),
              ];
            case 'emailVerified':
              return [
                key,
                (associatedUserObj.associated_user.email_verified =
                  Boolean(value)),
              ];
            default:
              return [key, value];
          }
        }),
    ) as any;
    // If the onlineAccessInfo is not present, we are using the new session info and  add it to the object
    if (!obj.onlineAccessInfo) {
      obj.onlineAccessInfo = associatedUserObj;
    }
    Object.setPrototypeOf(obj, Session.prototype);
    return obj;
  }

  /**
   * The unique identifier for the session.
   */
  readonly id: string;
  /**
   * The Shopify shop domain, such as `example.myshopify.com`.
   */
  public shop: string;
  /**
   * The state of the session. Used for the OAuth authentication code flow.
   */
  public state: string;
  /**
   * Whether the access token in the session is online or offline.
   */
  public isOnline: boolean;
  /**
   * The desired scopes for the access token, at the time the session was created.
   */
  public scope?: string;
  /**
   * The date the access token expires.
   */
  public expires?: Date;
  /**
   * The access token for the session.
   */
  public accessToken?: string;
  /**
   * Information on the user for the session. Only present for online sessions.
   */
  public onlineAccessInfo?: OnlineAccessInfo;

  constructor(params: SessionParams) {
    Object.assign(this, params);
  }

  /**
   * Whether the session is active. Active sessions have an access token that is not expired, and has the given scopes.
   */
  public isActive(scopes: AuthScopes | string | string[]): boolean {
    return (
      !this.isScopeChanged(scopes) &&
      Boolean(this.accessToken) &&
      !this.isExpired()
    );
  }

  /**
   * Whether the access token has the given scopes.
   */
  public isScopeChanged(scopes: AuthScopes | string | string[]): boolean {
    const scopesObject =
      scopes instanceof AuthScopes ? scopes : new AuthScopes(scopes);

    return !scopesObject.equals(this.scope);
  }

  /**
   * Whether the access token is expired.
   */
  public isExpired(withinMillisecondsOfExpiry = 0): boolean {
    return Boolean(
      this.expires &&
        this.expires.getTime() - withinMillisecondsOfExpiry < Date.now(),
    );
  }

  /**
   * Converts an object with data into a Session.
   */
  public toObject(): SessionParams {
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

  /**
   * Checks whether the given session is equal to this session.
   */
  public equals(other: Session | undefined): boolean {
    if (!other) return false;

    const mandatoryPropsMatch =
      this.id === other.id &&
      this.shop === other.shop &&
      this.state === other.state &&
      this.isOnline === other.isOnline;

    if (!mandatoryPropsMatch) return false;

    const copyA = this.toPropertyArray();
    copyA.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));

    const copyB = other.toPropertyArray();
    copyB.sort(([k1], [k2]) => (k1 < k2 ? -1 : 1));

    return JSON.stringify(copyA) === JSON.stringify(copyB);
  }

  /**
   * Converts the session into an array of key-value pairs.
   */
  public toPropertyArray(): [string, string | number | boolean][] {
    return (
      Object.entries(this)
        .filter(
          ([key, value]) =>
            propertiesToSave.includes(key) &&
            value !== undefined &&
            value !== null,
        )
        // Prepare values for db storage
        .flatMap(([key, value]) => {
          switch (key) {
            case 'expires':
              return [[key, value ? value.getTime() : undefined]];
            case 'onlineAccessInfo':
              if (
                value?.associated_user &&
                Object.keys(value.associated_user).length === 1 &&
                value.associated_user.id !== undefined
              ) {
                return [[key, value.associated_user.id]];
              } else {
                return [
                  ['userId', value?.associated_user?.id],
                  ['firstName', value?.associated_user?.first_name],
                  ['lastName', value?.associated_user?.last_name],
                  ['email', value?.associated_user?.email],
                  ['locale', value?.associated_user?.locale],
                  ['emailVerified', value?.associated_user?.email_verified],
                  ['accountOwner', value?.associated_user?.account_owner],
                  ['collaborator', value?.associated_user?.collaborator],
                ];
              }
            default:
              return [[key, value]];
          }
        })
    );
  }
}
