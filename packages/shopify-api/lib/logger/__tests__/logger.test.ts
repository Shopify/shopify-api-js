import {FeatureDeprecatedError} from '../../error';
import {LogSeverity} from '../../types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import {testConfig} from '../../__tests__/test-config';
import {shopifyApi} from '../..';

describe('shopify.logger', () => {
  describe('direct calls', () => {
    it('can log debug logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.log(LogSeverity.Debug, 'debug message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Debug,
        expect.stringContaining('debug message'),
      );
    });

    it('can log info logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.log(LogSeverity.Info, 'info message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Info,
        expect.stringContaining('info message'),
      );
    });

    it('can log warning logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.log(LogSeverity.Warning, 'warning message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Warning,
        expect.stringContaining('warning message'),
      );
    });

    it('can log error logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.log(LogSeverity.Error, 'error message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Error,
        expect.stringContaining('error message'),
      );
    });
  });

  describe('proxy calls', () => {
    it('can log debug logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.debug('debug message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Debug,
        expect.stringContaining('debug message'),
      );
    });

    it('can log info logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.info('info message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Info,
        expect.stringContaining('info message'),
      );
    });

    it('can log warning logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.warning('warning message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Warning,
        expect.stringContaining('warning message'),
      );
    });

    it('can log error logs', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.error('error message');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Error,
        expect.stringContaining('error message'),
      );
    });

    it('can log deprecations for future versions', async () => {
      const shopify = shopifyApi(testConfig());

      shopify.logger.deprecated('9999.0.0', 'This is a test');

      expect(shopify.config.logger.log).toHaveBeenCalledWith(
        LogSeverity.Warning,
        expect.stringContaining('[Deprecated | 9999.0.0]'),
      );
    });

    it('throws an error when we move past the release version', async () => {
      const shopify = shopifyApi(testConfig());

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
        const shopify = shopifyApi(testConfig());

        shopify.logger.log(config.severity, 'test message');

        expect(shopify.config.logger.log).toHaveBeenCalledWith(
          config.severity,
          `[shopify-api/${config.level}] test message`,
        );
      });

      it('includes context in output string', async () => {
        const shopify = shopifyApi(testConfig());

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
      const shopify = shopifyApi(
        testConfig({logger: {level: config.logLevel}}),
      );

      shopify.logger.log(LogSeverity.Debug, 'debug message');
      shopify.logger.log(LogSeverity.Info, 'info message');
      shopify.logger.log(LogSeverity.Warning, 'warning message');
      shopify.logger.log(LogSeverity.Error, 'error message');

      // We always log an INFO line with the runtime when starting up
      const expectedCallCount =
        config.expectedLevels.length +
        (config.logLevel >= LogSeverity.Info ? 1 : 0);

      expect(shopify.config.logger.log).toHaveBeenCalledTimes(
        expectedCallCount,
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
    const shopify = shopifyApi(testConfig({logger: {timestamps: false}}));

    shopify.logger.log(LogSeverity.Debug, 'debug message');

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      '[shopify-api/DEBUG] debug message',
    );
  });

  it('logs times when setting is on', async () => {
    jest.useFakeTimers();
    jest.setSystemTime(Date.UTC(2022, 0, 1, 0));

    const shopify = shopifyApi(testConfig({logger: {timestamps: true}}));

    shopify.logger.log(LogSeverity.Debug, 'debug message');

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      '[2022-01-01T00:00:00Z] [shopify-api/DEBUG] debug message',
    );
  });

  it('properly uses context.package', async () => {
    const shopify = shopifyApi(testConfig());

    shopify.logger.log(LogSeverity.Debug, 'debug message', {
      package: 'MyPackage',
    });

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Debug,
      '[MyPackage/DEBUG] debug message',
    );
  });

  it('can use a custom async logger', async () => {
    jest.useFakeTimers();

    const loggedMessages: string[] = [];

    function sleep(ms: number): Promise<void> {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const logPromise = sleep(1000);
    const log = async (
      severity: LogSeverity,
      message: string,
    ): Promise<void> => {
      await logPromise;
      loggedMessages.push(`${severity}: ${message}`);
    };

    const shopify = shopifyApi(testConfig({logger: {log}}));

    shopify.logger.log(LogSeverity.Debug, 'debug message');

    // The log messages aren't triggered until the promise resolves, even if more time elapses
    // Execution continues regardless of that happening
    jest.advanceTimersByTime(1100);
    expect(loggedMessages.length).toEqual(0);

    // Wait for the promise to resolve
    await logPromise;

    // We always log the runtime before the actual message
    expect(loggedMessages.length).toEqual(2);
    expect(loggedMessages[1]).toEqual(
      `${LogSeverity.Debug}: [shopify-api/DEBUG] debug message`,
    );
  });
});
