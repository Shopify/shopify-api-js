/**
 * Future flags are used to enable features that are not yet available by default.
 */
export interface FutureFlags {
  /**
   * Enable the token exchange OAuth flow.
   */
  unstable_tokenExchange?: boolean;
  /**
   * Enable line item billing, to make billing configuration more similar to the GraphQL API.
   */
  unstable_lineItemBilling?: boolean;
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
