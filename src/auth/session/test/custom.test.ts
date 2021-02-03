import '../../../test/test_helper';

import {Session} from '../session';
import {CustomSessionStorage} from '../storage/custom';
import {SessionStorageError} from '../../../error';

test('can use custom session storage', async () => {
  const sessionId = 'test_session';
  let session: Session | undefined = new Session(sessionId);

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

test('custom session storage failures and exceptions are raised', () => {
  const sessionId = 'test_session';
  const session = new Session(sessionId);

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
