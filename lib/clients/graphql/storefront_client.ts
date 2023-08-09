import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import {LIBRARY_NAME, ShopifyHeader} from '../../types';
import {httpClientClass} from '../http_client/http_client';
import {Session} from '../../session/session';
import {HeaderParams} from '../http_client/types';
import {logger} from '../../logger';

import {GraphqlClient, GraphqlClientClassParams} from './graphql_client';
import {StorefrontClientParams} from './types';

export class StorefrontClient extends GraphqlClient {
  baseApiPath = '/api';
  readonly domain: string;
  readonly storefrontAccessToken: string;

  constructor(params: StorefrontClientParams) {
    const session = new Session({
      shop: params.domain,
      id: '',
      state: '',
      isOnline: true,
      accessToken: params.storefrontAccessToken,
    });

    super({session, apiVersion: params.apiVersion});

    const config = this.storefrontClass().config;

    if (params.apiVersion) {
      const message =
        params.apiVersion === config.apiVersion
          ? `Storefront client has a redundant API version override to the default ${params.apiVersion}`
          : `Storefront client overriding default API version ${config.apiVersion} with ${params.apiVersion}`;

      logger(config).debug(message);
    }

    this.domain = params.domain;
    this.storefrontAccessToken = params.storefrontAccessToken;
  }

  protected getApiHeaders(): HeaderParams {
    const sdkVariant = LIBRARY_NAME.toLowerCase().split(' ').join('-');

    return {
      [ShopifyHeader.StorefrontAccessToken]: this.storefrontClass().config
        .isCustomStoreApp
        ? this.storefrontClass().config.privateAppStorefrontAccessToken ||
          this.storefrontAccessToken
        : this.storefrontAccessToken,
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
