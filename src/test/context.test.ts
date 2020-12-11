import './test_helper';

import * as ShopifyErrors from '../error';
import { Context } from '../context';
import { ApiVersion, ContextParams } from '../types';
import { CustomSessionStorage, Session } from '../auth/session';

jest.mock('cookies');
import Cookies from 'cookies';

const validParams: ContextParams = {
  API_KEY: 'api_key',
  API_SECRET_KEY: 'secret_key',
  SCOPES: ['scope'],
  HOST_NAME: 'host_name',
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
};

const originalWarn = console.warn;

describe('Context object', () => {
  afterEach(() => {
    console.warn = originalWarn;
    (Cookies as any).mockClear(); // eslint-disable-line @typescript-eslint/no-explicit-any
  });

  it('can initialize and update context', () => {
    Context.initialize(validParams);

    expect(Context.API_KEY).toEqual(validParams.API_KEY);
    expect(Context.API_SECRET_KEY).toEqual(validParams.API_SECRET_KEY);
    expect(Context.SCOPES).toEqual(validParams.SCOPES);
    expect(Context.HOST_NAME).toEqual(validParams.HOST_NAME);
  });

  it("can't initialize with empty values", () => {
    let invalid: ContextParams = Object.assign({}, validParams);
    invalid.API_KEY = '';
    try {
      Context.initialize(invalid);
      fail('Initializing without API_KEY did not throw an exception');
    } catch (e) {
      expect(e).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(e.message).toContain('Missing values for: API_KEY');
    }

    invalid = Object.assign({}, validParams);
    invalid.API_SECRET_KEY = '';
    try {
      Context.initialize(invalid);
      fail('Initializing without API_SECRET_KEY did not throw an exception');
    } catch (e) {
      expect(e).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(e.message).toContain('Missing values for: API_SECRET_KEY');
    }

    invalid = Object.assign({}, validParams);
    invalid.SCOPES = [];
    try {
      Context.initialize(invalid);
      fail('Initializing without SCOPES did not throw an exception');
    } catch (e) {
      expect(e).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(e.message).toContain('Missing values for: SCOPES');
    }

    invalid = Object.assign({}, validParams);
    invalid.HOST_NAME = '';
    try {
      Context.initialize(invalid);
      fail('Initializing without HOST_NAME did not throw an exception');
    } catch (e) {
      expect(e).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(e.message).toContain('Missing values for: HOST_NAME');
    }

    const empty: ContextParams = {
      API_KEY: '',
      API_SECRET_KEY: '',
      SCOPES: [],
      HOST_NAME: '',
      API_VERSION: ApiVersion.Unstable,
      IS_EMBEDDED_APP: true,
    };
    expect(() => Context.initialize(empty)).toThrow(ShopifyErrors.ShopifyError);
  });

  it('can store, load and delete memory sessions by default', async () => {
    Context.initialize(validParams);

    const sessionId = 'test_session';
    const session = new Session(sessionId);

    await expect(Context.storeSession(session)).resolves.toEqual(true);
    await expect(Context.loadSession(sessionId)).resolves.toEqual(session);
    await expect(Context.deleteSession(sessionId)).resolves.toEqual(true);
  });

  it('can store, load and delete custom storage sessions', async () => {
    const sessionId = 'test_session';
    const session = new Session(sessionId);

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
      }
    );

    const params = Object.assign({}, validParams);
    params.SESSION_STORAGE = storage;
    Context.initialize(params);

    await expect(Context.storeSession(session)).resolves.toEqual(true);
    expect(store_called).toBe(true);

    await expect(Context.loadSession(sessionId)).resolves.toEqual(session);
    expect(load_called).toBe(true);

    await expect(Context.deleteSession(sessionId)).resolves.toEqual(true);
    expect(delete_called).toBe(true);
  });
});
