import '../../../test/test_helper';

import { Session } from '../session';
import { CustomSessionStorage } from '../storage/custom';

test("can use custom session storage", async () => {
  const sessionId = 'test_session';
  const session = new Session(sessionId, (new Date()).getTime() + 86400000);

  let store_called = false;
  let load_called = false;
  let delete_called = false;
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
  );

  await expect(storage.storeSession(session)).resolves.toBe(true);
  expect(store_called).toBe(true);

  await expect(storage.loadSession(sessionId)).resolves.toEqual(session);
  expect(load_called).toBe(true);

  store_called = load_called = false;

  await expect(storage.storeSession(session)).resolves.toBe(true);
  expect(store_called).toBe(true);

  await expect(storage.loadSession(sessionId)).resolves.toEqual(session);
  expect(load_called).toBe(true);

  await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
  expect(delete_called).toBe(true);
  expect(storage.loadSession(sessionId)).resolves.toBeNull;

  // Deleting a non-existing session should work
  delete_called = false;
  await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
  expect(delete_called).toBe(true);
});

test("custom session storage failures and exceptions are raised", async () => {
  const sessionId = 'test_session';
  const session = new Session(sessionId, (new Date()).getTime() + 86400000);

  let storage = new CustomSessionStorage(
    () => false,
    () => null,
    () => false,
  );

  await expect(storage.storeSession(session)).resolves.toBe(false);
  await expect(storage.loadSession(sessionId)).resolves.toBeNull();
  await expect(storage.deleteSession(sessionId)).resolves.toBe(false);

  storage = new CustomSessionStorage(
    () => { throw 'Failed to store!'; },
    () => { throw 'Failed to load!'; },
    () => { throw 'Failed to delete!'; },
  );

  await expect(storage.storeSession(session)).rejects.toEqual('Failed to store!');
  await expect(storage.loadSession(sessionId)).rejects.toEqual('Failed to load!');
  await expect(storage.deleteSession(sessionId)).rejects.toEqual('Failed to delete!');
});
