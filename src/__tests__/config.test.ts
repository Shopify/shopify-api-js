import Cookies from 'cookies';

import * as ShopifyErrors from '../error';
import {config, setConfig} from '../config';
import {ApiVersion, ConfigParams} from '../base-types';

jest.mock('cookies');

const validParams: ConfigParams = {
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

describe('Config object', () => {
  afterEach(() => {
    console.warn = originalWarn;
    (Cookies as any).mockClear();
  });

  it('can initialize and update config', () => {
    setConfig(validParams);

    expect(config.API_KEY).toEqual(validParams.API_KEY);
    expect(config.API_SECRET_KEY).toEqual(validParams.API_SECRET_KEY);
    expect(config.SCOPES.equals(validParams.SCOPES)).toBeTruthy();
    expect(config.HOST_NAME).toEqual(validParams.HOST_NAME);
  });

  it("can't initialize with empty values", () => {
    let invalid: ConfigParams = {...validParams};
    invalid.API_KEY = '';
    try {
      setConfig(invalid);
      fail('Initializing without API_KEY did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: API_KEY');
    }

    invalid = {...validParams};
    invalid.API_SECRET_KEY = '';
    try {
      setConfig(invalid);
      fail('Initializing without API_SECRET_KEY did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: API_SECRET_KEY');
    }

    invalid = {...validParams};
    invalid.SCOPES = [];
    try {
      setConfig(invalid);
      fail('Initializing without SCOPES did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: SCOPES');
    }

    invalid = {...validParams};
    invalid.HOST_NAME = '';
    try {
      setConfig(invalid);
      fail('Initializing without HOST_NAME did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: HOST_NAME');
    }

    const empty: ConfigParams = {
      API_KEY: '',
      API_SECRET_KEY: '',
      SCOPES: [],
      HOST_NAME: '',
      API_VERSION: ApiVersion.Unstable,
      IS_EMBEDDED_APP: true,
      LOG_FILE: '',
    };
    expect(() => setConfig(empty)).toThrow(ShopifyErrors.ShopifyError);
  });
});
