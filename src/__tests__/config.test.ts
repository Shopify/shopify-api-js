import Cookies from 'cookies';

import * as ShopifyErrors from '../error';
import {validateConfig} from '../config';
import {ApiVersion, ConfigParams} from '../base-types';

jest.mock('cookies');

const validParams: ConfigParams = {
  apiKey: 'apiKey',
  apiSecretKey: 'secret_key',
  scopes: ['scope'],
  hostName: 'host_name',
  apiVersion: ApiVersion.Unstable,
  isEmbeddedApp: true,
  isPrivateApp: false,
  logFile: 'some-file-path.txt',
};

const originalWarn = console.warn;

describe('Config object', () => {
  afterEach(() => {
    console.warn = originalWarn;
    (Cookies as any).mockClear();
  });

  it('can initialize and update config', () => {
    const config = validateConfig(validParams);

    expect(config.apiKey).toEqual(validParams.apiKey);
    expect(config.apiSecretKey).toEqual(validParams.apiSecretKey);
    expect(config.scopes.equals(validParams.scopes)).toBeTruthy();
    expect(config.hostName).toEqual(validParams.hostName);
  });

  it("can't initialize with empty values", () => {
    let invalid: ConfigParams = {...validParams};
    invalid.apiKey = '';
    try {
      validateConfig(invalid);
      fail('Initializing without apiKey did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: apiKey');
    }

    invalid = {...validParams};
    invalid.apiSecretKey = '';
    try {
      validateConfig(invalid);
      fail('Initializing without apiSecretKey did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: apiSecretKey');
    }

    invalid = {...validParams};
    invalid.scopes = [];
    try {
      validateConfig(invalid);
      fail('Initializing without scopes did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: scopes');
    }

    invalid = {...validParams};
    invalid.hostName = '';
    try {
      validateConfig(invalid);
      fail('Initializing without hostName did not throw an exception');
    } catch (error) {
      expect(error).toBeInstanceOf(ShopifyErrors.ShopifyError);
      expect(error.message).toContain('Missing values for: hostName');
    }

    const empty: ConfigParams = {
      apiKey: '',
      apiSecretKey: '',
      scopes: [],
      hostName: '',
      apiVersion: ApiVersion.Unstable,
      isEmbeddedApp: true,
      logFile: '',
    };
    expect(() => validateConfig(empty)).toThrow(ShopifyErrors.ShopifyError);
  });
});
