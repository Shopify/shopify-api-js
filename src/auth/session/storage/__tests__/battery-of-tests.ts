import {Session} from '../../session';
import {sessionEqual} from '../../session-utils';
import {SessionStorage} from '../../session_storage';

export function batteryOfTests(storageFactory: () => Promise<SessionStorage>) {
  it('can store and delete offline sessions', async () => {
    const storage = await storageFactory();
    const sessionId = 'test_session';
    const session = new Session(sessionId, 'shop', 'state', false);

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );

    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();

    // Deleting a non-existing session should work
    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
  });

  it('can store and delete offline sessions with expiry date', async () => {
    const storage = await storageFactory();
    const sessionId = 'test_session';
    const session = new Session(sessionId, 'shop', 'state', false);
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 60);
    session.expires = expiryDate;

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );

    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();

    // Deleting a non-existing session should work
    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
  });

  it('can store and delete offline sessions with user info', async () => {
    const storage = await storageFactory();
    const sessionId = 'test_session';
    const session = new Session(sessionId, 'shop', 'state', false);
    session.onlineAccessInfo = {associated_user: {} } as any;
    session.onlineAccessInfo!.associated_user.id = 123;

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );

    await expect(storage.storeSession(session)).resolves.toBe(true);
    expect(sessionEqual(await storage.loadSession(sessionId), session)).toBe(
      true,
    );

    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();

    // Deleting a non-existing session should work
    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
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
}
