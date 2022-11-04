import {Session} from '../session';
import {shopify} from '../../__tests__/test-helper';

describe('session', () => {
  it('can create a session from another session', () => {
    const session = new Session({
      id: 'original',
      shop: 'original-shop',
      state: 'original-state',
      isOnline: true,
      accessToken: 'original-access-token',
      expires: new Date(),
      scope: 'original-scope',
      onlineAccessInfo: {
        expires_in: 1,
        associated_user_scope: 'original-scope',
        associated_user: {
          id: 1,
          first_name: 'original-first-name',
          last_name: 'original-last-name',
          email: 'original-email',
          locale: 'original-locale',
          email_verified: true,
          account_owner: true,
          collaborator: false,
        },
      },
    });
    const sessionClone = new Session({...session, id: 'clone'});

    expect(session.id).not.toEqual(sessionClone.id);
    expect(session.shop).toStrictEqual(sessionClone.shop);
    expect(session.state).toStrictEqual(sessionClone.state);
    expect(session.scope).toStrictEqual(sessionClone.scope);
    expect(session.expires).toStrictEqual(sessionClone.expires);
    expect(session.isOnline).toStrictEqual(sessionClone.isOnline);
    expect(session.accessToken).toStrictEqual(sessionClone.accessToken);
    expect(session.onlineAccessInfo).toStrictEqual(
      sessionClone.onlineAccessInfo,
    );
  });
});

describe('isActive', () => {
  it('returns true if session is active', () => {
    const session = new Session({
      id: 'active',
      shop: 'active-shop',
      state: 'test_state',
      isOnline: true,
      scope: 'test_scope',
      accessToken: 'indeed',
      expires: new Date(Date.now() + 86400),
    });

    expect(session.isActive(shopify.config.scopes)).toBeTruthy();
  });

  it('returns false if session is not active', () => {
    const session = new Session({
      id: 'not_active',
      shop: 'inactive-shop',
      state: 'not_same',
      isOnline: true,
      scope: 'test_scope',
      expires: new Date(Date.now() - 1),
    });
    expect(session.isActive(shopify.config.scopes)).toBeFalsy();
  });
});

describe('serialize', () => {
  [
    {
      id: 'serialize',
      shop: 'serialize-shop',
      state: 'serialize-state',
      isOnline: false,
      scope: 'serialize-scope',
      accessToken: 'serialize-token',
      expires: new Date(Date.now() + 86400),
    },
    {
      id: 'serialize',
      shop: 'serialize-shop',
      state: 'serialize-state',
      isOnline: true,
      scope: 'serialize-scope',
      accessToken: 'serialize-token',
      expires: new Date(Date.now() + 86400),
      onlineAccessInfo: {
        expires_in: 1,
        associated_user_scope: 'serialize-user-scope',
        associated_user: {
          id: 1,
          first_name: 'serialize-first-name',
          last_name: 'serialize-last-name',
          email: 'serialize-email',
          locale: 'serialize-locale',
          email_verified: true,
          account_owner: true,
          collaborator: false,
        },
      },
    },
  ].forEach((testSessionParams) => {
    const onlineOrOffline = testSessionParams.isOnline ? 'online' : 'offline';
    it(`returns a serialized ${onlineOrOffline} session`, () => {
      const session = new Session(testSessionParams);
      expect(session.serialize()).toStrictEqual(testSessionParams);
    });

    it(`recreates a Session from a serialized ${onlineOrOffline} session`, () => {
      const session = new Session(testSessionParams);
      const sessionCopy = new Session(session.serialize());
      expect(session).toStrictEqual(sessionCopy);
    });
  });
});
