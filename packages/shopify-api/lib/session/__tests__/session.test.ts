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
    returnUserData: false,
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
    returnUserData: false,
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
    returnUserData: false,
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
    returnUserData: false,
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
    returnUserData: false,
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
    returnUserData: false,
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
    returnUserData: false,
  },
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
    returnUserData: true,
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
      ['userId', 1],
      ['firstName', 'online-session-first-name'],
      ['lastName', 'online-session-last-name'],
      ['email', 'online-session-email'],
      ['locale', 'online-session-locale'],
      ['emailVerified', true],
      ['accountOwner', true],
      ['collaborator', false],
    ],
    returnUserData: true,
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
      ['userId', 1],
    ],
    returnUserData: true,
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
    const userData = test.returnUserData ? 'with' : 'without';
    it(`returns a property array of an ${onlineOrOffline} session ${userData} user data`, () => {
      const session = new Session(test.session);
      expect(session.toPropertyArray(test.returnUserData)).toStrictEqual(
        test.propertyArray,
      );
    });

    it(`recreates a Session from a property array of an ${onlineOrOffline} session ${userData} user data`, () => {
      const session = new Session(test.session);
      const sessionCopy = Session.fromPropertyArray(
        session.toPropertyArray(test.returnUserData),
        test.returnUserData,
      );

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

      if (test.returnUserData) {
        expect(
          session.onlineAccessInfo?.associated_user.first_name,
        ).toStrictEqual(
          sessionCopy.onlineAccessInfo?.associated_user.first_name,
        );
        expect(
          session.onlineAccessInfo?.associated_user.last_name,
        ).toStrictEqual(
          sessionCopy.onlineAccessInfo?.associated_user.last_name,
        );
        expect(session.onlineAccessInfo?.associated_user.email).toStrictEqual(
          sessionCopy.onlineAccessInfo?.associated_user.email,
        );
        expect(session.onlineAccessInfo?.associated_user.locale).toStrictEqual(
          sessionCopy.onlineAccessInfo?.associated_user.locale,
        );
        expect(
          session.onlineAccessInfo?.associated_user.email_verified,
        ).toStrictEqual(
          sessionCopy.onlineAccessInfo?.associated_user.email_verified,
        );
        expect(
          session.onlineAccessInfo?.associated_user.account_owner,
        ).toStrictEqual(
          sessionCopy.onlineAccessInfo?.associated_user.account_owner,
        );
        expect(
          session.onlineAccessInfo?.associated_user.collaborator,
        ).toStrictEqual(
          sessionCopy.onlineAccessInfo?.associated_user.collaborator,
        );
        // Test that the user information is correctly moved to the associated_user object from property array
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            firstName: session.onlineAccessInfo?.associated_user.first_name,
          }),
        );
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            lastName: session.onlineAccessInfo?.associated_user.last_name,
          }),
        );
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            email: session.onlineAccessInfo?.associated_user.email,
          }),
        );
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            locale: session.onlineAccessInfo?.associated_user.locale,
          }),
        );
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            emailVerified:
              session.onlineAccessInfo?.associated_user.email_verified,
          }),
        );
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            accountOwner:
              session.onlineAccessInfo?.associated_user.account_owner,
          }),
        );
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            collaborator:
              session.onlineAccessInfo?.associated_user.collaborator,
          }),
        );
        expect(sessionCopy).toEqual(
          expect.not.objectContaining({
            associated_user: {id: session.onlineAccessInfo?.associated_user.id},
          }),
        );
      } else {
        expect(sessionCopy.onlineAccessInfo?.associated_user?.id).toStrictEqual(
          session.onlineAccessInfo?.associated_user?.id,
        );
        expect(
          sessionCopy.onlineAccessInfo?.associated_user.first_name,
        ).toBeUndefined();
        expect(
          sessionCopy.onlineAccessInfo?.associated_user.last_name,
        ).toBeUndefined();
        expect(
          sessionCopy.onlineAccessInfo?.associated_user.email,
        ).toBeUndefined();
        expect(
          sessionCopy.onlineAccessInfo?.associated_user.locale,
        ).toBeUndefined();
        expect(
          sessionCopy.onlineAccessInfo?.associated_user.email_verified,
        ).toBeUndefined();
        expect(
          sessionCopy.onlineAccessInfo?.associated_user.account_owner,
        ).toBeUndefined();
        expect(
          sessionCopy.onlineAccessInfo?.associated_user.collaborator,
        ).toBeUndefined();
      }
    });
    const describe = test.session.isOnline ? 'Does' : 'Does not';
    const isOnline = test.session.isOnline ? 'online' : 'offline';

    it(`${describe} have online access info when the token is ${isOnline}`, () => {
      const session = new Session(test.session);
      const sessionCopy = Session.fromPropertyArray(
        session.toPropertyArray(test.returnUserData),
        test.returnUserData,
      );
      if (test.session.isOnline) {
        expect(sessionCopy.onlineAccessInfo).toBeDefined();
      } else {
        expect(sessionCopy.onlineAccessInfo).toBeUndefined();
      }
    });
  });
});
