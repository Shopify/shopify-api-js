export interface DeprecatedV5Types {
  /**
   * @deprecated
   * `Shopify.Context` is now `Shopify.config` and its API has changed.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md
   */
  Context?: never;

  /**
   * @deprecated
   * `Shopify.Auth` is now `Shopify.auth` and its API has changed.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md#changes-to-authentication-functions
   */
  Auth?: never;

  /**
   * @deprecated
   * `Shopify.Billing` is now `Shopify.billing` and its API has changed.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md#billing
   */
  Billing?: never;

  /**
   * @deprecated
   * `Shopify.Session` is now `Shopify.session` and its API has changed.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md#changes-to-session-and-sessionstorage
   */
  Session?: never;

  /**
   * @deprecated
   * `Shopify.Clients` is now `Shopify.clients` and its API has changed.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md#changes-to-api-clients
   */
  Clients?: never;

  /**
   * @deprecated
   * `Shopify.Utils` is now `Shopify.utils` and its API has changed.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md#utility-functions
   */
  Utils?: never;

  /**
   * @deprecated
   * `Shopify.Webhooks` is now `Shopify.webhooks` and its API has changed.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md#changes-to-webhook-functions
   */
  Webhooks?: never;

  /**
   * @deprecated
   * `Shopify.Errors` was deprecated, error classes are now exported directly from the package.
   *
   * @see https://github.com/Shopify/shopify-api-js/blob/main/docs/migrating-to-v6.md#simplified-namespace-for-errors
   */
  Errors?: never;
}
