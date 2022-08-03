import Cookies from 'cookies';

import * as ShopifyErrors from '../error';
import {Context} from '../context';
import {ApiVersion, ContextParams} from '../base-types';

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
      LOG_FILE: '',
    };
    expect(() => Context.initialize(empty)).toThrow(ShopifyErrors.ShopifyError);
  });
});
