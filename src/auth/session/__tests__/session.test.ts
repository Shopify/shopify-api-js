import {Session} from '..';

describe('session', () => {
  it('can clone a session', () => {
    const session = new Session(
      'original',
      'original-shop',
      'original-state',
      true,
    );
    const sessionClone = Session.cloneSession(session, 'new');

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
    const session = new Session('active', 'active-shop', 'test_state', true);
    session.scope = 'test_scope';
    session.accessToken = 'indeed';
    session.expires = new Date(Date.now() + 86400);

    expect(session.isActive()).toBeTruthy();
  });

  it('returns false if session is not active', () => {
    const session = new Session(
      'not_active',
      'inactive-shop',
      'not_same',
      true,
    );
    session.scope = 'test_scope';
    session.expires = new Date(Date.now() - 1);
    expect(session.isActive()).toBeFalsy();
  });
});
