import './test_helper';

import {ShopifyError} from '../error';
import {Context} from '../context';
import {ContextParams} from '../types';
import {CustomSessionStorage, Session} from '../auth/session';

test("can initialize and update context", () => {
  Context.initialize(
    {
      API_KEY: 'api_key',
      API_SECRET_KEY: 'api_secret_key',
      SCOPES: ['do_one_thing', 'do_something_else'],
      HOST_NAME: 'host_name',
    }
  );

  expect(Context.API_KEY).toEqual('api_key');
  expect(Context.API_SECRET_KEY).toEqual('api_secret_key');
  expect(Context.SCOPES).toEqual(['do_one_thing', 'do_something_else']);
  expect(Context.HOST_NAME).toEqual('host_name');
});

test("can't initialize with empty values", () => {
  const valid: ContextParams = {
    API_KEY: 'api_key',
    API_SECRET_KEY: 'secret_key',
    SCOPES: ['scope'],
    HOST_NAME: 'host_name',
  };

  let invalid: ContextParams = Object.assign({}, valid);
  invalid.API_KEY = '';
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  invalid = Object.assign({}, valid);
  invalid.API_SECRET_KEY = '';
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  invalid = Object.assign({}, valid);
  invalid.SCOPES = [];
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  invalid = Object.assign({}, valid);
  invalid.HOST_NAME = '';
  expect(() => Context.initialize(invalid)).toThrow(ShopifyError);

  const empty: ContextParams = {
    API_KEY: '',
    API_SECRET_KEY: '',
    SCOPES: [],
    HOST_NAME: '',
  };
  expect(() => Context.initialize(empty)).toThrow(ShopifyError);
});

test("can store, load and delete memory sessions by default", async () => {
  Context.initialize(
    {
      API_KEY: 'api_key',
      API_SECRET_KEY: 'api_secret_key',
      SCOPES: ['do_one_thing', 'do_something_else'],
      HOST_NAME: 'host_name',
    }
  );

  const sessionId = 'test_session';
  const session = new Session(sessionId, (new Date()).getTime() + 86400000);

  await expect(Context.storeSession(session)).resolves.toEqual(true);
  await expect(Context.loadSession(sessionId)).resolves.toEqual(session);
  await expect(Context.deleteSession(sessionId)).resolves.toEqual(true);
});

test("can store, load and delete custom storage sessions", async () => {
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

  Context.initialize(
    {
      API_KEY: 'api_key',
      API_SECRET_KEY: 'api_secret_key',
      SCOPES: ['do_one_thing', 'do_something_else'],
      HOST_NAME: 'host_name',
      SESSION_STORAGE: storage,
    },
  );

  await expect(Context.storeSession(session)).resolves.toEqual(true);
  expect(store_called).toBe(true);

  await expect(Context.loadSession(sessionId)).resolves.toEqual(session);
  expect(load_called).toBe(true);

  await expect(Context.deleteSession(sessionId)).resolves.toEqual(true);
  expect(delete_called).toBe(true);
});
