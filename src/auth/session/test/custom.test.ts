import {Session} from '../session';
import {CustomSessionStorage} from '../storage/custom';

test("can use custom session storage", async () => {
  const session_id = 'test_session';
  const session = new Session(session_id, (new Date()).getTime() + 86400000);

  let store_called = false;
  let load_called = false;
  let delete_called = false;
  let cleanup_called = false;
  const storage = new CustomSessionStorage(
    () => {
      store_called = true;
      return true;
    },
    () => {
      load_called = true;
      return session;
    },
    () => {
      delete_called = true;
      return true;
    },
    () => {
      cleanup_called = true;
      return true;
    }
  );

  await expect(storage.storeSession(session)).resolves.toBe(true);
  expect(store_called).toBe(true);

  await expect(storage.loadSession(session_id)).resolves.toEqual(session);
  expect(load_called).toBe(true);

  store_called = load_called = false;

  await expect(storage.storeSession(session)).resolves.toBe(true);
  expect(store_called).toBe(true);

  await expect(storage.loadSession(session_id)).resolves.toEqual(session);
  expect(load_called).toBe(true);

  await expect(storage.deleteSession(session_id)).resolves.toBe(true);
  expect(delete_called).toBe(true);
  expect(storage.loadSession(session_id)).resolves.toBeNull;

  // Deleting a non-existing session should work
  delete_called = false;
  await expect(storage.deleteSession(session_id)).resolves.toBe(true);
  expect(delete_called).toBe(true);

  await expect(storage.cleanUpOldSessions(0)).resolves.toBeUndefined();
  expect(cleanup_called).toBe(true);
});

test("custom session storage failures and exceptions are raised", async () => {
  const session_id = 'test_session';
  const session = new Session(session_id, (new Date()).getTime() + 86400000);

  let storage = new CustomSessionStorage(
    () => false,
    () => null,
    () => false,
    () => null
  );

  await expect(storage.storeSession(session)).resolves.toBe(false);
  await expect(storage.loadSession(session_id)).resolves.toBeNull();
  await expect(storage.deleteSession(session_id)).resolves.toBe(false);

  storage = new CustomSessionStorage(
    () => { throw 'Failed to store!'; },
    () => { throw 'Failed to load!'; },
    () => { throw 'Failed to delete!'; },
    () => { throw 'Failed to clean up!'; },
  );

  await expect(storage.storeSession(session)).rejects.toEqual('Failed to store!');
  await expect(storage.loadSession(session_id)).rejects.toEqual('Failed to load!');
  await expect(storage.deleteSession(session_id)).rejects.toEqual('Failed to delete!');
  await expect(storage.cleanUpOldSessions(0)).rejects.toEqual('Failed to clean up!');
});
