import {FutureFlagOptions, FutureFlags} from '../../future/flags';
import {AuthScopes} from '../auth/scopes';
import type {ConfigParams} from '../base-types';
import {LATEST_API_VERSION, LogSeverity} from '../types';

/*
 * This type combines both passed in types, by ignoring any keys from Type1 that are present (and not undefined)
 * in Type2, and then adding any keys from Type1 that are not present in Type2.
 *
 * This effectively enables us to create a type that is the const TEST_CONFIG below, plus any overrides passed in with
 * the output being a const object.
 */
type Modify<Type1, Type2> = {
  [key in keyof Type2 as Type2[key] extends undefined
    ? never
    : key]: Type2[key];
} & {
  [key in keyof Type1 as key extends keyof Type2 ? never : key]: Type1[key];
};

type DefaultedFutureFlags<Future> = Modify<typeof TEST_CONFIG.future, Future>;

/*
 * We omit the future prop and then redefine it with a partial of that object so we can pass the fully typed object in
 * to ConfigParams.
 */
type TestOverrides<Future> = Partial<
  Omit<ConfigParams<any, DefaultedFutureFlags<Future>>, 'future'> & {
    future: Partial<DefaultedFutureFlags<Future>>;
  }
>;

type TestOverridesOption<Future> = undefined | TestOverrides<Future>;

type TestConfig<Overrides extends TestOverridesOption<Future>, Future> = Modify<
  typeof TEST_CONFIG,
  Overrides
> & {
  future: Modify<typeof TEST_CONFIG.future, Future>;
  logger: Modify<
    typeof TEST_CONFIG.logger,
    Overrides extends TestOverrides<Future>
      ? Overrides['logger']
      : typeof TEST_CONFIG.logger
  >;
};

/*
 * This object mandates that all existing future flags be activated for tests. If a new flag is added, this object must
 * be updated to include it, which will also cause all tests to use the new behaviour by default (and likely fail).
 *
 * This way, we'll always ensure our tests are covering all future flags. Please make sure to also have tests for the
 * old behaviour.
 */
const TEST_FUTURE_FLAGS: Required<{
  [key in keyof FutureFlags]: true;
}> = {
  v10_lineItemBilling: true,
} as const;

const TEST_CONFIG = {
  apiKey: 'test_key',
  apiSecretKey: 'test_secret_key',
  scopes: new AuthScopes(['test_scope']),
  hostName: 'test_host_name',
  hostScheme: 'https',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
  isCustomStoreApp: false,
  customShopDomains: undefined,
  billing: undefined,
  restResources: undefined,
  logger: {
    log: jest.fn(),
    level: LogSeverity.Debug,
    httpRequests: false,
    timestamps: false,
  },
  future: TEST_FUTURE_FLAGS,
} as const;

beforeEach(() => {
  TEST_CONFIG.logger.log.mockReset();
});

export function testConfig<
  Overrides extends TestOverridesOption<Future>,
  Future extends FutureFlagOptions,
>(
  {future, ...overrides}: Overrides & {future?: Future} = {} as Overrides & {
    future?: Future;
  },
): TestConfig<Overrides, Future> {
  return {
    ...TEST_CONFIG,
    ...overrides,
    logger: {
      ...TEST_CONFIG.logger,
      ...(overrides as NonNullable<Overrides>).logger,
    },
    future: {...TEST_CONFIG.future, ...future},
  } as any;
}
