import './test_helper';

import Cookies from 'cookies';

import {MemorySessionStorage} from '../auth/session/storage/memory';
import * as ShopifyErrors from '../error';
import {Context} from '../context';
import {ApiVersion, ContextParams} from '../base_types';

jest.mock('cookies');

const validParams: ContextParams = {
  API_KEY: 'api_key',
  API_SECRET_KEY: 'secret_key',
  SCOPES: ['scope'],
  HOST_NAME: 'host_name',
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
  IS_PRIVATE_APP: false,
  LOG_FILE: 'some-file-path.txt',
  WEBHOOKS_REGISTRY: {
    PRODUCTS_CREATE: {
      path: '/webhooks',
      webhookHandler: async () => {},
    },
  },
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
    expect(Context.SCOPES.equals(validParams.SCOPES)).toBeTruthy();
    expect(Context.HOST_NAME).toEqual(validParams.HOST_NAME);
    expect(Context.WEBHOOKS_REGISTRY).toEqual(validParams.WEBHOOKS_REGISTRY);
  });

  it("can't initialize without required values", () => {
    const {API_KEY, ...withoutApiKey} = validParams;
    try {
      Context.initialize(withoutApiKey as ContextParams);
      fail('Initializing without API_KEY did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: API_KEY');
    }

    const {API_SECRET_KEY, ...withoutApiSecretKey} = validParams;
    try {
      Context.initialize(withoutApiSecretKey as ContextParams);
      fail('Initializing without API_SECRET_KEY did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: API_SECRET_KEY');
    }

    const {SCOPES, ...withoutScopes} = validParams;
    try {
      Context.initialize(withoutScopes as ContextParams);
      fail('Initializing without SCOPES did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: SCOPES');
    }

    const {HOST_NAME, ...withoutHostName} = validParams;
    try {
      Context.initialize(withoutHostName as ContextParams);
      fail('Initializing without HOST_NAME did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: HOST_NAME');
    }

    const {API_VERSION, ...withoutApiVersion} = validParams;
    try {
      Context.initialize(withoutApiVersion as ContextParams);
      fail('Initializing without API_VERSION did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: API_VERSION');
    }

    const empty = {} as ContextParams;
    expect(() => Context.initialize(empty)).toThrow(ShopifyErrors.ShopifyError);
  });

  it('can initialize without optionals properties', () => {
    const {
      IS_PRIVATE_APP,
      SESSION_STORAGE,
      WEBHOOKS_REGISTRY,
      LOG_FILE,
      USER_AGENT_PREFIX,
      PRIVATE_APP_STOREFRONT_ACCESS_TOKEN,
      ...withoutOptionals
    } = validParams;

    Context.initialize(withoutOptionals);

    expect(Context.IS_PRIVATE_APP).toBe(false);
    expect(Context.SESSION_STORAGE).toEqual(new MemorySessionStorage());
    expect(Context.WEBHOOKS_REGISTRY).toEqual({});
    expect(Context.LOG_FILE).toBeUndefined();
    expect(Context.USER_AGENT_PREFIX).toBeUndefined();
    expect(Context.PRIVATE_APP_STOREFRONT_ACCESS_TOKEN).toBeUndefined();
  });
});
