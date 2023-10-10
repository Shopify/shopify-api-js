import {SHOPIFY_API_LIBRARY_VERSION} from '../../version';
import {LIBRARY_NAME, ShopifyHeader} from '../../types';
import {httpClientClass} from '../http_client/http_client';
import {HeaderParams} from '../http_client/types';
import {logger} from '../../logger';
import {MissingRequiredArgument} from '../../error';

import {GraphqlClient, GraphqlClientClassParams} from './graphql_client';
import {GraphqlClientParams} from './types';

export class StorefrontClient extends GraphqlClient {
  baseApiPath = '/api';

  constructor(params: GraphqlClientParams) {
    super({session: params.session, apiVersion: params.apiVersion});

    const config = this.storefrontClass().config;

    if (params.apiVersion) {
      const message =
        params.apiVersion === config.apiVersion
          ? `Storefront client has a redundant API version override to the default ${params.apiVersion}`
          : `Storefront client overriding default API version ${config.apiVersion} with ${params.apiVersion}`;

      logger(config).debug(message);
    }
  }

  protected getApiHeaders(): HeaderParams {
    const config = this.storefrontClass().config;

    let accessToken: string | undefined;
    if (config.isCustomStoreApp) {
      accessToken = config.privateAppStorefrontAccessToken;

      if (!accessToken) {
        throw new MissingRequiredArgument(
          'Custom store apps must set the privateAppStorefrontAccessToken property to call the Storefront API.',
        );
      }
    } else {
      accessToken = this.session.accessToken;

      if (!accessToken) {
        throw new MissingRequiredArgument('Session missing access token.');
      }
    }

    const sdkVariant = LIBRARY_NAME.toLowerCase().split(' ').join('-');
    return {
      [ShopifyHeader.StorefrontPrivateToken]: accessToken,
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
