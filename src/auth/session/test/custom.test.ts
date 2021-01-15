import '../../../test/test_helper';

import {Session} from '../session';
import {CustomSessionStorage} from '../storage/custom';

test('can use custom session storage', async () => {
  const sessionId = 'test_session';
  let session: Session | undefined = new Session(sessionId);

  let storeCalled = false;
  let loadCalled = false;
  let deleteCalled = false;
  const storage = new CustomSessionStorage(
    () => {
      storeCalled = true;
      return true;
    },
    () => {
      loadCalled = true;
      return session;
    },
    () => {
      deleteCalled = true;
      session = undefined;
      return true;
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

test('custom session storage failures and exceptions are raised', async () => {
  const sessionId = 'test_session';
  const session = new Session(sessionId);

  let storage = new CustomSessionStorage(
    () => false,
    () => undefined,
    () => false,
  );

  await expect(storage.storeSession(session)).resolves.toBe(false);
  await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();
  await expect(storage.deleteSession(sessionId)).resolves.toBe(false);

  storage = new CustomSessionStorage(
    () => {
      throw Error('Failed to store!');
    },
    () => {
      throw Error('Failed to load!');
    },
    () => {
      throw Error('Failed to delete!');
    },
  );

  await expect(storage.storeSession(session)).rejects.toEqual(Error('Failed to store!'));
  await expect(storage.loadSession(sessionId)).rejects.toEqual(Error('Failed to load!'));
  await expect(storage.deleteSession(sessionId)).rejects.toEqual(Error('Failed to delete!'));
});
