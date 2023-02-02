import * as ShopifyErrors from '../error';
import {validateConfig} from '../config';
import {ConfigParams} from '../base-types';
import {ApiVersion, LogSeverity} from '../types';

let validParams: ConfigParams;

describe('Config object', () => {
  beforeEach(() => {
    validParams = {
      apiKey: 'apiKey',
      apiSecretKey: 'secret_key',
      scopes: ['scope'],
      hostName: 'host_name',
      apiVersion: ApiVersion.Unstable,
      isEmbeddedApp: true,
      isCustomStoreApp: false,
      logger: {
        log: jest.fn(),
        level: LogSeverity.Debug,
        httpRequests: false,
        timestamps: false,
      },
    };
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
      logger: undefined,
    };
    expect(() => validateConfig(empty)).toThrow(ShopifyErrors.ShopifyError);
  });

  it('can partially override logger settings', () => {
    const configWithLogger = {...validParams};
    configWithLogger.logger = {
      level: LogSeverity.Error,
      httpRequests: true,
    };

    const config = validateConfig(configWithLogger);

    expect(config.logger).toEqual({
      log: expect.any(Function),
      level: LogSeverity.Error,
      httpRequests: true,
      timestamps: false,
    });
  });

  it('removes trailing slashes from the host', () => {
    const configWithSlash = {...validParams};
    configWithSlash.hostName = 'my-host-name/';

    const config = validateConfig(configWithSlash);

    expect(config.hostName).toEqual('my-host-name');
  });
});
