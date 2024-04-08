import {
  StorefrontApiClient,
  StorefrontOperations,
  ClientResponse,
  createStorefrontApiClient,
  ReturnData,
  ApiClientRequestOptions,
} from '@shopify/storefront-api-client';

import {ApiVersion} from '../../types';
import {logger} from '../../logger';
import * as ShopifyErrors from '../../error';
import {MissingRequiredArgument} from '../../error';
import type {
  GraphqlClientParams,
  GraphqlParams,
  GraphqlQueryOptions,
  RequestReturn,
} from '../types';
import {ConfigInterface} from '../../base-types';
import {Session} from '../../session/session';
import {abstractFetch} from '../../../runtime';
import {clientLoggerFactory, getUserAgent, throwFailedRequest} from '../common';

interface GraphqlClientClassParams {
  config: ConfigInterface;
}

export class StorefrontClient {
  public static config: ConfigInterface;

  readonly session: Session;
  readonly client: StorefrontApiClient;
  readonly apiVersion?: ApiVersion;

  constructor(params: GraphqlClientParams) {
    const config = this.storefrontClass().config;

    if (!config.isCustomStoreApp && !params.session.accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating GraphQL client',
      );
    }

    if (params.apiVersion) {
      const message =
        params.apiVersion === config.apiVersion
          ? `Storefront client has a redundant API version override to the default ${params.apiVersion}`
          : `Storefront client overriding default API version ${config.apiVersion} with ${params.apiVersion}`;

      logger(config).debug(message);
    }

    let accessToken: string | undefined;
    if (config.isCustomStoreApp) {
      accessToken = config.privateAppStorefrontAccessToken;

      if (!accessToken) {
        throw new MissingRequiredArgument(
          'Custom store apps must set the privateAppStorefrontAccessToken property to call the Storefront API.',
        );
      }
    } else {
      accessToken = params.session.accessToken;

      if (!accessToken) {
        throw new MissingRequiredArgument('Session missing access token.');
      }
    }

    this.session = params.session;
    this.apiVersion = params.apiVersion;
    this.client = createStorefrontApiClient({
      privateAccessToken: accessToken,
      apiVersion: this.apiVersion ?? config.apiVersion,
      storeDomain: this.session.shop,
      customFetchApi: abstractFetch,
      logger: clientLoggerFactory(config),
      clientName: getUserAgent(config),
    });
  }

  public async query<T = undefined>(
    params: GraphqlParams,
  ): Promise<RequestReturn<T>> {
    logger(this.storefrontClass().config).deprecated(
      '10.0.0',
      'The query method is deprecated, and was replaced with the request method.\n' +
        'See the migration guide: https://github.com/Shopify/shopify-api-js/blob/main/packages/shopify-api/docs/migrating-to-v9.md#using-the-new-clients.',
    );

    if (
      (typeof params.data === 'string' && params.data.length === 0) ||
      Object.entries(params.data).length === 0
    ) {
      throw new ShopifyErrors.MissingRequiredArgument('Query missing.');
    }

    let operation: string;
    let variables: Record<string, any> | undefined;
    if (typeof params.data === 'string') {
      operation = params.data;
    } else {
      operation = params.data.query;
      variables = params.data.variables;
    }

    const headers = Object.fromEntries(
      Object.entries(params?.extraHeaders ?? {}).map(([key, value]) => [
        key,
        Array.isArray(value) ? value.join(', ') : value.toString(),
      ]),
    );

    const response = await this.request<T>(operation, {
      headers,
      retries: params.tries ? params.tries - 1 : undefined,
      variables,
    });

    return {body: response as T, headers: {}};
  }

  public async request<
    T = undefined,
    Operation extends keyof Operations = string,
    Operations extends StorefrontOperations = StorefrontOperations,
  >(
    operation: Operation,
    options?: GraphqlQueryOptions<Operation, Operations>,
  ): Promise<
    ClientResponse<T extends undefined ? ReturnData<Operation, Operations> : T>
  > {
    const response = await this.client.request<T, Operation>(operation, {
      apiVersion: this.apiVersion || this.storefrontClass().config.apiVersion,
      ...(options as ApiClientRequestOptions<Operation, StorefrontOperations>),
    });

    if (response.errors) {
      const fetchResponse = response.errors.response;

      throwFailedRequest(response, (options?.retries ?? 0) > 0, fetchResponse);
    }

    return response;
  }

  private storefrontClass() {
    return this.constructor as typeof StorefrontClient;
  }
}

export function storefrontClientClass(params: GraphqlClientClassParams) {
  const {config} = params;
  class NewStorefrontClient extends StorefrontClient {
    public static config = config;
  }

  Reflect.defineProperty(NewStorefrontClient, 'name', {
    value: 'StorefrontClient',
  });

  return NewStorefrontClient as typeof StorefrontClient;
}
