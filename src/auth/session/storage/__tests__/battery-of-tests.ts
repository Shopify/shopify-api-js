import {Session} from '../../session';
import {SessionStorage} from '../../session_storage';

export function batteryOfTests(storageFactory: () => Promise<SessionStorage>) {
  it('can store and delete sessions in memory', async () => {
    const storage = await storageFactory();
    const sessionId = 'test_session';
    const session = new Session(sessionId, 'shop', 'state', false);

    await expect(storage.storeSession(session)).resolves.toBe(true);
    await expect(storage.loadSession(sessionId)).resolves.toEqual(session);

    await expect(storage.storeSession(session)).resolves.toBe(true);
    await expect(storage.loadSession(sessionId)).resolves.toEqual(session);

    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();

    // Deleting a non-existing session should work
    await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
  });

  it('wrong ids return null sessions from memory', async () => {
    const storage = await storageFactory();
    await expect(
      storage.loadSession('not_a_session_id'),
    ).resolves.toBeUndefined();
  });
}
