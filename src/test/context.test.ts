import './test_helper';

import Cookies from 'cookies';

import * as ShopifyErrors from '../error';
import {Context} from '../context';
import {ApiVersion, ContextParams} from '../types';
import {CustomSessionStorage, Session} from '../auth/session';

jest.mock('cookies');

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
    (Cookies as any).mockClear();
  });

  it('can initialize and update context', () => {
    Context.initialize(validParams);

    expect(Context.API_KEY).toEqual(validParams.API_KEY);
    expect(Context.API_SECRET_KEY).toEqual(validParams.API_SECRET_KEY);
    expect(Context.SCOPES).toEqual(validParams.SCOPES);
    expect(Context.HOST_NAME).toEqual(validParams.HOST_NAME);
  });

  it("can't initialize with empty values", () => {
    let invalid: ContextParams = {...validParams};
    invalid.API_KEY = '';
    try {
      Context.initialize(invalid);
      fail('Initializing without API_KEY did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: API_KEY');
    }

    invalid = {...validParams};
    invalid.API_SECRET_KEY = '';
    try {
      Context.initialize(invalid);
      fail('Initializing without API_SECRET_KEY did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: API_SECRET_KEY');
    }

    invalid = {...validParams};
    invalid.SCOPES = [];
    try {
      Context.initialize(invalid);
      fail('Initializing without SCOPES did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: SCOPES');
    }

    invalid = {...validParams};
    invalid.HOST_NAME = '';
    try {
      Context.initialize(invalid);
      fail('Initializing without HOST_NAME did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: HOST_NAME');
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
        return true;
      },
    );

    const params = {...validParams};
    params.SESSION_STORAGE = storage;
    Context.initialize(params);

    await expect(Context.storeSession(session)).resolves.toEqual(true);
    expect(storeCalled).toBe(true);

    await expect(Context.loadSession(sessionId)).resolves.toEqual(session);
    expect(loadCalled).toBe(true);

    await expect(Context.deleteSession(sessionId)).resolves.toEqual(true);
    expect(deleteCalled).toBe(true);
  });
});
