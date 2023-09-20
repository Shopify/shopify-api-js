import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import {LIBRARY_NAME, ShopifyHeader} from '../../types';
import {httpClientClass} from '../http_client/http_client';
import {Session} from '../../session/session';
import {HeaderParams} from '../http_client/types';
import {logger} from '../../logger';
import {MissingRequiredArgument} from '../../error';
import {enableCodeAfterVersion} from '../../utils/versioned-codeblocks';

import {GraphqlClient, GraphqlClientClassParams} from './graphql_client';
import {DeprecatedStorefrontClientParams, GraphqlClientParams} from './types';

export class StorefrontClient extends GraphqlClient {
  baseApiPath = '/api';
  readonly session: Session;
  /** @deprecated This package should not use public Storefront API tokens. Use `session` instead. */
  readonly domain: string;
  /** @deprecated This package should not use public Storefront API tokens. Use `session` instead. */
  readonly storefrontAccessToken: string;

  /** @deprecated This package should not use public Storefront API tokens */
  private readonly tokenHeader:
    | ShopifyHeader.StorefrontPrivateToken
    | ShopifyHeader.StorefrontAccessToken =
    ShopifyHeader.StorefrontPrivateToken;

  constructor(params: GraphqlClientParams | DeprecatedStorefrontClientParams) {
    let session: Session;
    if (isDeprecatedParamsType(params)) {
      session = new Session({
        shop: params.domain,
        id: '',
        state: '',
        isOnline: true,
        accessToken: params.storefrontAccessToken,
      });
    } else {
      session = params.session;
    }

    super({session, apiVersion: params.apiVersion});

    const config = this.storefrontClass().config;

    if (params.apiVersion) {
      const message =
        params.apiVersion === config.apiVersion
          ? `Storefront client has a redundant API version override to the default ${params.apiVersion}`
          : `Storefront client overriding default API version ${config.apiVersion} with ${params.apiVersion}`;

      logger(config).debug(message);
    }

    if (isDeprecatedParamsType(params)) {
      this.tokenHeader = ShopifyHeader.StorefrontAccessToken;
      this.storefrontAccessToken = params.storefrontAccessToken;
      logger(config).deprecated(
        '8.0.0',
        [
          'The domain and storefrontAccessToken params are deprecated, because they assume public access tokens for the Storefront API.',
          'Apps should not use public Storefront API tokens for backend requests. Pass the session param instead.',
          'See https://shopify.dev/docs/api/usage/authentication#access-tokens-for-the-storefront-api for more information.',
        ].join('\n'),
      );
    }

    this.session = session;
  }

  protected getApiHeaders(): HeaderParams {
    const config = this.storefrontClass().config;

    let accessToken: string | undefined;
    if (config.isCustomStoreApp) {
      accessToken = config.privateAppStorefrontAccessToken;

      if (!accessToken) {
        enableCodeAfterVersion('8.0.0', () => {
          throw new MissingRequiredArgument(
            'Custom store apps must set the privateAppStorefrontAccessToken property to call the Storefront API.',
          );
        });
        accessToken = this.session.accessToken || this.storefrontAccessToken;
      }
    } else {
      accessToken = this.session.accessToken;

      if (!accessToken) {
        throw new MissingRequiredArgument('Session missing access token.');
      }
    }

    const sdkVariant = LIBRARY_NAME.toLowerCase().split(' ').join('-');
    return {
      [this.tokenHeader]: accessToken,
      [ShopifyHeader.StorefrontSDKVariant]: sdkVariant,
      [ShopifyHeader.StorefrontSDKVersion]: SHOPIFY_API_LIBRARY_VERSION,
    };
  }

  private storefrontClass() {
    return this.constructor as typeof StorefrontClient;
  }
}

export function storefrontClientClass(params: GraphqlClientClassParams) {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = httpClientClass(config);
  }
  class NewStorefrontClient extends StorefrontClient {
    public static config = config;
    public static HttpClient = HttpClient!;
  }

  Reflect.defineProperty(NewStorefrontClient, 'name', {
    value: 'StorefrontClient',
  });

  return NewStorefrontClient as typeof StorefrontClient;
}

function isDeprecatedParamsType(
  params: GraphqlClientParams | DeprecatedStorefrontClientParams,
): params is DeprecatedStorefrontClientParams {
  return 'domain' in params;
}
