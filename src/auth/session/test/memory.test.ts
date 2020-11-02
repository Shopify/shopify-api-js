import {Session} from '../session';
import {MemorySessionStorage} from '../storage/memory';

test("can store and delete sessions in memory", async () => {
  const session_id = 'test_session';
  const storage = new MemorySessionStorage();
  const session = new Session(session_id, (new Date()).getTime() + 86400000);

  await expect(storage.storeSession(session)).resolves.toBe(true);
  await expect(storage.loadSession(session_id)).resolves.toEqual(session);

  await expect(storage.storeSession(session)).resolves.toBe(true);
  await expect(storage.loadSession(session_id)).resolves.toEqual(session);

  await expect(storage.deleteSession(session_id)).resolves.toBe(true);
  await expect(storage.loadSession(session_id)).resolves.toBeNull();

  // Deleting a non-existing session should work
  await expect(storage.deleteSession(session_id)).resolves.toBe(true);
});

test("wrong ids return null sessions from memory", async () => {
  const storage = new MemorySessionStorage();
  await expect(storage.loadSession('not_a_session_id')).resolves.toBeNull();
});

test("expired sessions are cleaned up", async () => {
  const storage = new MemorySessionStorage();

  const session_id = 'test_session';
  const session = new Session(session_id, (new Date()).getTime() - 60000); // Expired 1 minute ago
  await expect(storage.storeSession(session)).resolves.toBe(true);

  // We're abusing the object access to sessions within storage because that is a private attribute
  // and we don't want to either expose it as public or add a getter for all of the sessions.
  expect(Object.keys(storage['sessions'])).toHaveLength(1);

  const session_id2 = 'test_session_2';
  const session2 = new Session(session_id2, (new Date()).getTime() + 86400000);
  await expect(storage.storeSession(session2)).resolves.toBe(true);

  expect(Object.keys(storage['sessions'])).toHaveLength(2);
  await expect(storage.loadSession(session_id)).resolves.toEqual(session);
  await expect(storage.loadSession(session_id2)).resolves.toEqual(session2);

  await storage.cleanUpOldSessions((new Date()).getTime());

  expect(Object.keys(storage['sessions'])).toHaveLength(1);
  await expect(storage.loadSession(session_id)).resolves.toBeNull();
  await expect(storage.loadSession(session_id2)).resolves.toEqual(session2);
});
