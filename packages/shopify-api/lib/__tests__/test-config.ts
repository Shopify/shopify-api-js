import type {ConfigParams} from '../base-types';
// import type {FutureFlags} from '../../future/flags';
import {LATEST_API_VERSION, LogSeverity} from '../types';

// Uncomment this when we add a flag
// type DefaultedFutureFlag<
//   Overrides extends Partial<ConfigParams>,
//   Flag extends keyof FutureFlags,
// > = Overrides['future'] extends FutureFlags ? Overrides['future'][Flag] : true;

type TestConfig<Overrides extends Partial<ConfigParams>> = ConfigParams &
  Overrides & {
    // Create an object with all future flags defaulted to active to ensure our tests are updated when we introduce new flags
    // future: {
    //   // e.g.
    //   // v8_newHttpClients: DefaultedFutureFlag<Overrides, 'v8_newHttpClients'>;
    // };
  };

export function testConfig<Overrides extends Partial<ConfigParams>>(
  overrides: Overrides = {} as Overrides,
): TestConfig<Overrides> {
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
    // future: {
    //   v8_newHttpClients: true,
    //   ...(overrides.future as Overrides['future']),
    // },
  };
}
