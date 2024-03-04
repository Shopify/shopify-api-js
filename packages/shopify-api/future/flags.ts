import {type ShopifyLogger} from '../lib/logger';
import {type ConfigInterface} from '../lib/base-types';

/**
 * Future flags are used to enable features that are not yet available by default.
 */
export interface FutureFlags {
  /**
   * Enable line item billing, to make billing configuration more similar to the GraphQL API.
   */
  v10_lineItemBilling?: boolean;
}

/**
 * Configuration option for future flags.
 */
export type FutureFlagOptions = FutureFlags | undefined;

export type FeatureEnabled<
  Future extends FutureFlagOptions,
  Flag extends keyof FutureFlags,
> = Future extends FutureFlags
  ? Future[Flag] extends true
    ? true
    : false
  : false;

export function logDisabledFutureFlags(
  config: ConfigInterface,
  logger: ShopifyLogger,
) {
  if (!config._logDisabledFutureFlags) {
    return;
  }

  const logFlag = (flag: string, message: string) =>
    logger.info(`Future flag ${flag} is disabled.\n\n  ${message}\n`);

  if (!config.future?.v10_lineItemBilling) {
    logFlag(
      'v10_lineItemBilling',
      'Enable this flag to use the new billing API, that supports multiple line items per plan.',
    );
  }
}
