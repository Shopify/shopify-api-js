import {Session} from '../session';
import {testConfig} from '../../__tests__/test-config';
import {shopifyApi} from '../..';

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
    const shopify = shopifyApi(testConfig());

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
    const shopify = shopifyApi(testConfig());

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

describe('isExpired', () => {
  it('returns true if session is expired', () => {
    const session = new Session({
      id: 'not_active',
      shop: 'inactive-shop',
      state: 'not_same',
      isOnline: true,
      scope: 'test_scope',
      expires: new Date(Date.now() - 1),
    });
    expect(session.isExpired()).toBeTruthy();
  });

  it('returns true if session expiry is within specified value', () => {
    const session = new Session({
      id: 'not_active',
      shop: 'inactive-shop',
      state: 'not_same',
      isOnline: true,
      scope: 'test_scope',
      expires: new Date(Date.now() + 55000),
    });
    expect(session.isExpired(60000)).toBeTruthy();
  });

  it('returns false if session expiry is not within specified value', () => {
    const session = new Session({
      id: 'not_active',
      shop: 'inactive-shop',
      state: 'not_same',
      isOnline: true,
      scope: 'test_scope',
      expires: new Date(Date.now() + 75000),
    });
    expect(session.isExpired(60000)).toBeFalsy();
  });

  it('returns false if session is not expired', () => {
    const session = new Session({
      id: 'active',
      shop: 'active-shop',
      state: 'test_state',
      isOnline: true,
      scope: 'test_scope',
      accessToken: 'indeed',
      expires: new Date(Date.now() + 86400),
    });

    expect(session.isExpired()).toBeFalsy();
  });

  it('returns false if session does not have expiry', () => {
    const session = new Session({
      id: 'active',
      shop: 'active-shop',
      state: 'test_state',
      isOnline: true,
      scope: 'test_scope',
      accessToken: 'indeed',
    });

    expect(session.isExpired()).toBeFalsy();
  });
});

describe('isScopeChanged', () => {
  it('returns true if scopes requested have changed', () => {
    const shopify = shopifyApi(testConfig());

    const session = new Session({
      id: 'not_active',
      shop: 'inactive-shop',
      state: 'not_same',
      isOnline: true,
      scope: shopify.config.scopes.toString(),
      expires: new Date(Date.now() - 1),
    });
    expect(
      session.isScopeChanged(`${shopify.config.scopes}, new_scope`),
    ).toBeTruthy();
  });

  it('returns false if scopes requested are unchanged', () => {
    const shopify = shopifyApi(testConfig());

    const session = new Session({
      id: 'not_active',
      shop: 'inactive-shop',
      state: 'not_same',
      isOnline: true,
      scope: shopify.config.scopes.toString(),
      expires: new Date(Date.now() - 1),
    });
    expect(session.isScopeChanged(shopify.config.scopes)).toBeFalsy();
  });
});

const expiresDate = new Date(Date.now() + 86400);
const expiresNumber = expiresDate.getTime();

const testSessions = [
  {
    session: {
      id: 'offline_session_id',
      shop: 'offline-session-shop',
      state: 'offline-session-state',
      isOnline: false,
      scope: 'offline-session-scope',
      accessToken: 'offline-session-token',
      expires: expiresDate,
    },
    propertyArray: [
      ['id', 'offline_session_id'],
      ['shop', 'offline-session-shop'],
      ['state', 'offline-session-state'],
      ['isOnline', false],
      ['scope', 'offline-session-scope'],
      ['accessToken', 'offline-session-token'],
      ['expires', expiresNumber],
    ],
  },
  {
    session: {
      id: 'offline_session_id',
      shop: 'offline-session-shop',
      state: 'offline-session-state',
      isOnline: false,
    },
    propertyArray: [
      ['id', 'offline_session_id'],
      ['shop', 'offline-session-shop'],
      ['state', 'offline-session-state'],
      ['isOnline', false],
    ],
  },
  {
    session: {
      id: 'offline_session_id',
      shop: 'offline-session-shop',
      state: 'offline-session-state',
      isOnline: false,
      scope: 'offline-session-scope',
    },
    propertyArray: [
      ['id', 'offline_session_id'],
      ['shop', 'offline-session-shop'],
      ['state', 'offline-session-state'],
      ['isOnline', false],
      ['scope', 'offline-session-scope'],
    ],
  },
  {
    session: {
      id: 'offline_session_id',
      shop: 'offline-session-shop',
      state: 'offline-session-state',
      isOnline: false,
      accessToken: 'offline-session-token',
    },
    propertyArray: [
      ['id', 'offline_session_id'],
      ['shop', 'offline-session-shop'],
      ['state', 'offline-session-state'],
      ['isOnline', false],
      ['accessToken', 'offline-session-token'],
    ],
  },
  {
    session: {
      id: 'offline_session_id',
      shop: 'offline-session-shop',
      state: 'offline-session-state',
      isOnline: false,
      expires: expiresDate,
    },
    propertyArray: [
      ['id', 'offline_session_id'],
      ['shop', 'offline-session-shop'],
      ['state', 'offline-session-state'],
      ['isOnline', false],
      ['expires', expiresNumber],
    ],
  },
  {
    session: {
      id: 'online_session_id',
      shop: 'online-session-shop',
      state: 'online-session-state',
      isOnline: true,
      scope: 'online-session-scope',
      accessToken: 'online-session-token',
      expires: expiresDate,
      onlineAccessInfo: {
        expires_in: 1,
        associated_user_scope: 'online-session-user-scope',
        associated_user: {
          id: 1,
          first_name: 'online-session-first-name',
          last_name: 'online-session-last-name',
          email: 'online-session-email',
          locale: 'online-session-locale',
          email_verified: true,
          account_owner: true,
          collaborator: false,
        },
      },
    },
    propertyArray: [
      ['id', 'online_session_id'],
      ['shop', 'online-session-shop'],
      ['state', 'online-session-state'],
      ['isOnline', true],
      ['scope', 'online-session-scope'],
      ['accessToken', 'online-session-token'],
      ['expires', expiresNumber],
      ['onlineAccessInfo', 1],
    ],
  },
  {
    session: {
      id: 'online_session_id',
      shop: 'online-session-shop',
      state: 'online-session-state',
      isOnline: true,
      onlineAccessInfo: {
        expires_in: 1,
        associated_user_scope: 'online-session-user-scope',
        associated_user: {
          id: 1,
          first_name: 'online-session-first-name',
          last_name: 'online-session-last-name',
          email: 'online-session-email',
          locale: 'online-session-locale',
          email_verified: true,
          account_owner: true,
          collaborator: false,
        },
      },
    },
    propertyArray: [
      ['id', 'online_session_id'],
      ['shop', 'online-session-shop'],
      ['state', 'online-session-state'],
      ['isOnline', true],
      ['onlineAccessInfo', 1],
    ],
  },
];

describe('toObject', () => {
  testSessions.forEach((test) => {
    const onlineOrOffline = test.session.isOnline ? 'online' : 'offline';
    it(`returns an object of an ${onlineOrOffline} session`, () => {
      const session = new Session(test.session);
      expect(session.toObject()).toStrictEqual(test.session);
    });

    it(`recreates a Session from an object form of an ${onlineOrOffline} session`, () => {
      const session = new Session(test.session);
      const sessionCopy = new Session(session.toObject());
      expect(session).toStrictEqual(sessionCopy);
    });
  });
});

describe('toPropertyArray and fromPropertyArray', () => {
  testSessions.forEach((test) => {
    const onlineOrOffline = test.session.isOnline ? 'online' : 'offline';
    it(`returns a property array of an ${onlineOrOffline} session`, () => {
      const session = new Session(test.session);
      expect(session.toPropertyArray()).toStrictEqual(test.propertyArray);
    });

    it(`recreates a Session from a property array of an ${onlineOrOffline} session`, () => {
      const session = new Session(test.session);
      const sessionCopy = Session.fromPropertyArray(session.toPropertyArray());
      expect(session.id).toStrictEqual(sessionCopy.id);
      expect(session.shop).toStrictEqual(sessionCopy.shop);
      expect(session.state).toStrictEqual(sessionCopy.state);
      expect(session.isOnline).toStrictEqual(sessionCopy.isOnline);
      expect(session.scope).toStrictEqual(sessionCopy.scope);
      expect(session.accessToken).toStrictEqual(sessionCopy.accessToken);
      expect(session.expires).toStrictEqual(sessionCopy.expires);
      expect(session.onlineAccessInfo?.associated_user.id).toStrictEqual(
        sessionCopy.onlineAccessInfo?.associated_user.id,
      );
    });
  });
});
