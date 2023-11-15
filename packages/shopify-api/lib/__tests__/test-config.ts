import type {ConfigParams} from '../base-types';
import type {FutureFlags} from '../../future/flags';
import {LATEST_API_VERSION, LogSeverity} from '../types';

const FUTURE_FLAGS = {
  unstable_billingUpdates: true,
};

// type DefaultedFutureFlag<
//   Overrides extends Partial<ConfigParams>,
//   Flag extends keyof FutureFlags,
// > = Overrides['future'] extends FutureFlags ? Overrides['future'][Flag] : true;

// type TestConfig<Overrides extends Partial<ConfigParams>> = ConfigParams &
//   Overrides & {
//     // Create an object with all future flags defaulted to active to ensure our tests are updated when we introduce new flags
//     future: {
//       unstable_billingUpdates: DefaultedFutureFlag<
//         Overrides,
//         'unstable_billingUpdates'
//       >;
//     };
//   };

export function testConfig<Overrides extends Partial<ConfigParams>>(
  overrides: Overrides = {} as Overrides,
): ConfigParams<any, typeof FUTURE_FLAGS> &
  Overrides & {future: typeof FUTURE_FLAGS & Overrides['future']} {
  return {
    apiKey: 'test_key',
    apiSecretKey: 'test_secret_key',
    scopes: ['test_scope'],
    hostName: 'test_host_name',
    hostScheme: 'https',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
    isCustomStoreApp: false,
    customShopDomains: undefined,
    billing: undefined,
    ...overrides,
    logger: {
      log: jest.fn(),
      level: LogSeverity.Debug,
      httpRequests: false,
      timestamps: false,
      ...overrides.logger,
    },
    future: {
      ...FUTURE_FLAGS,
      ...(overrides.future as Overrides['future']),
    },
  };
}
