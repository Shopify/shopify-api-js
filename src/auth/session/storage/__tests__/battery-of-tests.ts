import {Context} from '../../../../context';
import {Session} from '../../session';
import {sessionEqual} from '../../session-utils';
import {SessionStorage} from '../../session_storage';
import {SessionInterface} from '../../types';

export function batteryOfTests(storageFactory: () => Promise<SessionStorage>) {
  it('can store and delete all kinds of sessions', async () => {
    const sessionFactories = [
      async () => {
        const session = new Session(sessionId, 'shop', 'state', false);
        session.scope = Context.SCOPES.toString();
        session.accessToken = '123';
        return session;
      },
      async () => {
        const session = new Session(sessionId, 'shop', 'state', false);
        const expiryDate = new Date();
        expiryDate.setMinutes(expiryDate.getMinutes() + 60);
        session.expires = expiryDate;
        session.accessToken = '123';
        session.scope = Context.SCOPES.toString();
        return session;
      },
      async () => {
        const session = new Session(sessionId, 'shop', 'state', false);
        session.expires = null as any;
        session.scope = Context.SCOPES.toString();
        session.accessToken = '123';
        return session;
      },
      async () => {
        const session = new Session(sessionId, 'shop', 'state', false);
        session.expires = undefined;
        session.scope = Context.SCOPES.toString();
        session.accessToken = '123';
        return session;
      },
      async () => {
        const session = new Session(sessionId, 'shop', 'state', false);
        // eslint-disable-next-line  @typescript-eslint/naming-convention
        session.onlineAccessInfo = {associated_user: {}} as any;
        session.onlineAccessInfo!.associated_user.id = 123;
        session.scope = Context.SCOPES.toString();
        session.accessToken = '123';
        return session;
      },
    ];

    const sessionId = 'test_session';
    const storage = await storageFactory();
    for (const factory of sessionFactories) {
      const session = await factory();

      await expect(storage.storeSession(session)).resolves.toBe(true);
      expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
        true,
      );

      await expect(storage.storeSession(session)).resolves.toBe(true);
      const loadedSession = await storage.loadSession(sessionId);
      expect(sessionEqual(loadedSession, session)).toBe(true);
      expect(loadedSession?.isActive()).toBe(true);

      await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
      await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();

      // Deleting a non-existing session should work
      await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    }
  });

  it('can store sessions with unexpected fields', async () => {
    const storage = await storageFactory();
    const sessionId = 'test_session';
    const session = new Session(sessionId, 'shop', 'state', true);
    (session as any).someField = 'lol';

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );
  });

  it('can store and delete sessions with online tokens', async () => {
    const storage = await storageFactory();
    const sessionId = 'test_session';
    const session = new Session(sessionId, 'shop', 'state', true);

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );
  });

  it('wrong ids return null sessions', async () => {
    const storage = await storageFactory();
    await expect(
      storage.loadSession('not_a_session_id'),
    ).resolves.toBeUndefined();
  });

  it('can find all the sessions for a given shop', async () => {
    const storage = await storageFactory();
    const sessionIdPrefix = 'test_session';
    const sessions = [
      new Session(`${sessionIdPrefix}_1`, 'shop1', 'state', true),
      new Session(`${sessionIdPrefix}_2`, 'shop2', 'state', true),
      new Session(`${sessionIdPrefix}_3`, 'shop1', 'state', true),
      new Session(`${sessionIdPrefix}_4`, 'shop3', 'state', true),
    ];

    for (const session of sessions) {
      await expect(storage.storeSession(session)).resolves.toBe(true);
    }
    expect(storage.findSessionsByShop).toBeDefined();
    if (storage.findSessionsByShop) {
      const shop1Sessions = await storage.findSessionsByShop('shop1');
      expect(shop1Sessions).toBeDefined();
      if (shop1Sessions) {
        expect(shop1Sessions.length).toBe(2);
        expect(
          sessionEqual(shop1Sessions[0] as SessionInterface, sessions[0]),
        ).toBe(true);
        expect(
          sessionEqual(shop1Sessions[1] as SessionInterface, sessions[2]),
        ).toBe(true);
      }
    }
  });

  it('can delete the sessions for a given array of ids', async () => {
    const storage = await storageFactory();
    const sessionIdPrefix = 'test_session';
    const sessions = [
      new Session(`${sessionIdPrefix}_1`, 'shop1', 'state', true),
      new Session(`${sessionIdPrefix}_2`, 'shop2', 'state', true),
      new Session(`${sessionIdPrefix}_3`, 'shop1', 'state', true),
      new Session(`${sessionIdPrefix}_4`, 'shop3', 'state', true),
    ];

    for (const session of sessions) {
      await expect(storage.storeSession(session)).resolves.toBe(true);
    }
    expect(storage.deleteSessions).toBeDefined();
    if (storage.deleteSessions && storage.findSessionsByShop) {
      let shop1Sessions = await storage.findSessionsByShop('shop1');
      expect(shop1Sessions).toBeDefined();
      if (shop1Sessions) {
        const idsToDelete = shop1Sessions.map((session) => session.id);
        await expect(
          storage.deleteSessions(idsToDelete as string[]),
        ).resolves.toBe(true);
        shop1Sessions = await storage.findSessionsByShop('shop1');
        expect(shop1Sessions).toBeUndefined();
      }
    }
  });
}
