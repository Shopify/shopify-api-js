import path from 'path';
import * as fs from 'fs';

import {FeatureDeprecatedError} from '../../error';
import {LogSeverity} from '../../types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import {shopify} from '../../__tests__/test-helper';

describe('shopify.logger', () => {
  beforeEach(() => {
    shopify.config.logger.log = jest.fn();
  });

  describe('direct calls', () => {
    it('can log debug logs', async () => {
      shopify.logger.log(LogSeverity.Debug, 'debug message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Debug,
        expect.stringContaining('debug message'),
      );
    });

    it('can log info logs', async () => {
      shopify.logger.log(LogSeverity.Info, 'info message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Info,
        expect.stringContaining('info message'),
      );
    });

    it('can log warning logs', async () => {
      shopify.logger.log(LogSeverity.Warning, 'warning message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Warning,
        expect.stringContaining('warning message'),
      );
    });

    it('can log error logs', async () => {
      shopify.logger.log(LogSeverity.Error, 'error message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Error,
        expect.stringContaining('error message'),
      );
    });
  });

  describe('proxy calls', () => {
    it('can log debug logs', async () => {
      shopify.logger.debug('debug message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Debug,
        expect.stringContaining('debug message'),
      );
    });

    it('can log info logs', async () => {
      shopify.logger.info('info message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Info,
        expect.stringContaining('info message'),
      );
    });

    it('can log warning logs', async () => {
      shopify.logger.warning('warning message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Warning,
        expect.stringContaining('warning message'),
      );
    });

    it('can log error logs', async () => {
      shopify.logger.error('error message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Error,
        expect.stringContaining('error message'),
      );
    });

    it('can log deprecations for future versions', async () => {
      shopify.logger.deprecated('9999.0.0', 'This is a test');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Warning,
        expect.stringContaining('[Deprecated | 9999.0.0]'),
      );
    });

    it('throws an error when we move past the release version', async () => {
      expect(() => {
        return shopify.logger.deprecated(
          SHOPIFY_API_LIBRARY_VERSION,
          'This is a test',
        );
      }).toThrow(FeatureDeprecatedError);
    });
  });

  [
    {severity: LogSeverity.Debug, level: 'DEBUG'},
    {severity: LogSeverity.Info, level: 'INFO'},
    {severity: LogSeverity.Warning, level: 'WARNING'},
    {severity: LogSeverity.Error, level: 'ERROR'},
  ].forEach((config) => {
    describe(`with context - config: ${JSON.stringify(config)}`, () => {
      it('includes base prefix without any context', async () => {
        shopify.logger.log(config.severity, 'test message');

        expect(shopify.config.logger.log).toHaveBeenCalledWith(
          config.severity,
          `[shopify-api/${config.level}] test message`,
        );
      });

      it('includes context in output string', async () => {
        shopify.logger.log(config.severity, 'test message', {
          key1: 'value1',
          key2: 2,
          key3: null,
          key4: undefined,
        });

        expect(shopify.config.logger.log).toHaveBeenCalledWith(
          config.severity,
          `[shopify-api/${config.level}] test message | {key1: value1, key2: 2, key3: null, key4: undefined}`,
        );
      });
    });
  });

  [
    {
      logLevel: LogSeverity.Debug,
      expectedLevels: [
        LogSeverity.Debug,
        LogSeverity.Info,
        LogSeverity.Warning,
        LogSeverity.Error,
      ],
    },
    {
      logLevel: LogSeverity.Info,
      expectedLevels: [
        LogSeverity.Info,
        LogSeverity.Warning,
        LogSeverity.Error,
      ],
    },
    {
      logLevel: LogSeverity.Warning,
      expectedLevels: [LogSeverity.Warning, LogSeverity.Error],
    },
    {logLevel: LogSeverity.Error, expectedLevels: [LogSeverity.Error]},
  ].forEach((config) => {
    it(`respects the logLevel setting for ${JSON.stringify(
      config,
    )}`, async () => {
      shopify.config.logger.level = config.logLevel;

      shopify.logger.log(LogSeverity.Debug, 'debug message');
      shopify.logger.log(LogSeverity.Info, 'info message');
      shopify.logger.log(LogSeverity.Warning, 'warning message');
      shopify.logger.log(LogSeverity.Error, 'error message');

      expect(shopify.config.logger.log).toHaveBeenCalledTimes(
        config.expectedLevels.length,
      );
      config.expectedLevels.forEach((expectedLevel) => {
        expect(shopify.config.logger.log).toHaveBeenCalledWith(
          expectedLevel,
          expect.any(String),
        );
      });
    });
  });

  it('does not log times when setting is off', async () => {
    shopify.config.logger.timestamps = false;

    shopify.logger.log(LogSeverity.Debug, 'debug message');

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      '[shopify-api/DEBUG] debug message',
    );
  });

  it('logs times when setting is on', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.UTC(2022, 0, 1, 0));
    shopify.config.logger.timestamps = true;

    shopify.logger.log(LogSeverity.Debug, 'debug message');

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      '[2022-01-01T00:00:00Z] [shopify-api/DEBUG] debug message',
    );
  });

  it('properly uses context.package', async () => {
    shopify.logger.log(LogSeverity.Debug, 'debug message', {
      package: 'MyPackage',
    });

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      '[MyPackage/DEBUG] debug message',
    );
  });

  it('can use a custom async logger', async () => {
    const testLogFilePath = path.join(__dirname, 'test.log');

    let promise: Promise<any> = Promise.resolve();
    const log = (severity: LogSeverity, message: string) => {
      promise = fs.promises
        .writeFile(testLogFilePath, `${severity}: ${message}`)
        .catch((error) => {
          console.error(error);
        });
    };

    shopify.config.logger = {
      ...shopify.config.logger,
      log,
    };

    shopify.logger.log(LogSeverity.Debug, 'debug message');

    // Wait for the write operation to finish
    await promise;

    const logContent = await fs.promises.readFile(testLogFilePath, 'utf8');

    expect(logContent).toEqual(
      `${LogSeverity.Debug}: [shopify-api/DEBUG] debug message`,
    );

    fs.promises.rm(testLogFilePath).catch((_error) => {
      // ignore
    });
  });
});
