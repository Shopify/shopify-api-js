import {Session} from '../../session';
import {CustomSessionStorage} from '../custom';
import {SessionStorageError} from '../../../../error';

describe('custom session storage', () => {
  test('can perform core actions', async () => {
    const sessionId = 'test_session';
    let session: Session | undefined = new Session(
      sessionId,
      'shop-url',
      'state',
      true,
    );

    let storeCalled = false;
    let loadCalled = false;
    let deleteCalled = false;
    const storage = new CustomSessionStorage(
      () => {
        storeCalled = true;
        return Promise.resolve(true);
      },
      () => {
        loadCalled = true;
        return Promise.resolve(session);
      },
      () => {
        deleteCalled = true;
        session = undefined;
        return Promise.resolve(true);
      },
    );

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(storeCalled).toBe(true);
    storeCalled = false;

    await expect(storage.loadSession(sessionId)).resolves.toEqual(session);
    expect(loadCalled).toBe(true);
    loadCalled = false;

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(storeCalled).toBe(true);

    await expect(storage.loadSession(sessionId)).resolves.toEqual(session);
    expect(loadCalled).toBe(true);

    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    expect(deleteCalled).toBe(true);
    deleteCalled = false;

    await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();

    // Deleting a non-existing session should work
    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    expect(deleteCalled).toBe(true);
  });

  test('can perform optional actions', async () => {
    const prefix = 'custom_sessions';
    let sessions = [
      new Session(`${prefix}_1`, 'shop1-sessions.myshopify.io', 'state', true),
      new Session(`${prefix}_2`, 'shop2-sessions.myshopify.io', 'state', true),
      new Session(`${prefix}_3`, 'shop1-sessions.myshopify.io', 'state', true),
      new Session(`${prefix}_4`, 'shop3-sessions.myshopify.io', 'state', true),
    ];

    let deleteSessionsCalled = false;
    let findSessionsByShopCalled = false;
    const storage = new CustomSessionStorage(
      () => {
        return Promise.resolve(true);
      },
      () => {
        return Promise.resolve(sessions[0]);
      },
      () => {
        return Promise.resolve(true);
      },
      () => {
        deleteSessionsCalled = true;
        sessions = [sessions[1], sessions[3]];
        return Promise.resolve(true);
      },
      () => {
        findSessionsByShopCalled = true;
        if (deleteSessionsCalled) {
          return Promise.resolve([]);
        } else {
          return Promise.resolve([sessions[0], sessions[2]]);
        }
      },
    );

    await expect(
      storage.findSessionsByShop('shop1_sessions.myshopify.io'),
    ).resolves.toEqual([sessions[0], sessions[2]]);
    expect(findSessionsByShopCalled).toBe(true);

    await expect(
      storage.deleteSessions([`${prefix}_1`, `${prefix}_3`]),
    ).resolves.toBe(true);
    expect(deleteSessionsCalled).toBe(true);
    expect(sessions.length).toBe(2);
    await expect(
      storage.findSessionsByShop('shop1_sessions.myshopify.io'),
    ).resolves.toEqual([]);
  });

  test('missing optional actions generate warnings', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    const prefix = 'custom_sessions';
    const session = new Session(
      `${prefix}_1`,
      'shop1-sessions.myshopify.io',
      'state',
      true,
    );

    const storage = new CustomSessionStorage(
      () => {
        return Promise.resolve(true);
      },
      () => {
        return Promise.resolve(session);
      },
      () => {
        return Promise.resolve(true);
      },
    );

    await expect(
      storage.findSessionsByShop('shop1_sessions.myshopify.io'),
    ).resolves.toEqual([]);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('findSessionsByShopCallback not defined.'),
    );

    await expect(
      storage.deleteSessions([`${prefix}_1`, `${prefix}_3`]),
    ).resolves.toBe(false);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('deleteSessionsCallback not defined.'),
    );
  });

  test('failures and exceptions are raised', () => {
    const sessionId = 'test_session';
    const session = new Session(
      sessionId,
      'shop-url.myshopify.io',
      'state',
      true,
    );

    let storage = new CustomSessionStorage(
      () => Promise.resolve(false),
      () => Promise.resolve(undefined),
      () => Promise.resolve(false),
    );

    expect(storage.storeSession(session)).resolves.toBe(false);
    expect(storage.loadSession(sessionId)).resolves.toBeUndefined();
    expect(storage.deleteSession(sessionId)).resolves.toBe(false);

    storage = new CustomSessionStorage(
      () => Promise.reject(new Error('Failed to store!')),
      () => Promise.reject(new Error('Failed to load!')),
      () => Promise.reject(new Error('Failed to delete!')),
    );

    const expectedStore = expect(storage.storeSession(session)).rejects;
    expectedStore.toThrow(SessionStorageError);
    expectedStore.toThrow(/Error: Failed to store!/);

    const expectedLoad = expect(storage.loadSession(sessionId)).rejects;
    expectedLoad.toThrow(SessionStorageError);
    expectedLoad.toThrow(/Error: Failed to load!/);

    const expectedDelete = expect(storage.deleteSession(sessionId)).rejects;
    expectedDelete.toThrow(SessionStorageError);
    expectedDelete.toThrow(/Error: Failed to delete!/);

    storage = new CustomSessionStorage(
      () => Promise.resolve(true),
      () => Promise.resolve('this is not a Session' as any),
      () => Promise.resolve(true),
    );

    expect(storage.loadSession(sessionId)).rejects.toThrow(SessionStorageError);
  });

  it('converts the expiration date to a Date object', async () => {
    const sessionId = 'test_session';
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 10);

    let session: Session | undefined = new Session(
      sessionId,
      'shop',
      'state',
      true,
    );
    session.expires = expiration;

    const storage = new CustomSessionStorage(
      () => {
        (session as any).expires = (session as Session).expires?.toString();
        return Promise.resolve(true);
      },
      () => {
        return Promise.resolve(session);
      },
      () => {
        session = undefined;
        return Promise.resolve(true);
      },
    );

    await storage.storeSession(session);
    expect(typeof session.expires).toBe('string');

    expect(await storage.loadSession(sessionId)).toEqual(session);
  });

  it('can load session from serialized object', async () => {
    const sessionId = 'test_session';
    const expiration = new Date();
    expiration.setDate(expiration.getDate() + 10);

    /* eslint-disable @typescript-eslint/naming-convention */
    let session: Session | undefined = new Session(
      sessionId,
      'test.myshopify.io',
      '1234',
      true,
    );
    session.scope = 'read_products';
    session.expires = expiration;
    session.isOnline = true;
    session.accessToken = '12356';
    session.onlineAccessInfo = {
      associated_user_scope: 'read_products',
      expires_in: 12345,
      associated_user: {
        id: 54321,
        account_owner: true,
        collaborator: true,
        email: 'not@email',
        email_verified: true,
        first_name: 'first',
        last_name: 'last',
        locale: 'en',
      },
    };
    /* eslint-enable @typescript-eslint/naming-convention */

    let serializedSession = '';
    const storage = new CustomSessionStorage(
      () => {
        serializedSession = JSON.stringify(session);
        return Promise.resolve(true);
      },
      () => {
        return Promise.resolve(JSON.parse(serializedSession));
      },
      () => {
        session = undefined;
        return Promise.resolve(true);
      },
    );

    expect(serializedSession).toHaveLength(0);
    await storage.storeSession(session);
    expect(serializedSession).not.toHaveLength(0);

    expect(await storage.loadSession(sessionId)).toEqual(session);
  });

  it('allows empty fields in serialized object', async () => {
    const sessionId = 'test_session';

    let session: Session | undefined = new Session(
      sessionId,
      'shop.myshopify.io',
      'state',
      true,
    );

    let serializedSession = '';
    const storage = new CustomSessionStorage(
      () => {
        serializedSession = JSON.stringify(session);
        return Promise.resolve(true);
      },
      () => {
        return Promise.resolve(JSON.parse(serializedSession));
      },
      () => {
        session = undefined;
        return Promise.resolve(true);
      },
    );

    expect(serializedSession).toHaveLength(0);
    await storage.storeSession(session);
    expect(serializedSession).not.toHaveLength(0);

    expect(await storage.loadSession(sessionId)).toEqual(session);
  });
});
