import {
  StorefrontApiClient,
  StorefrontOperations,
  createStorefrontApiClient,
  FetchResponseBody,
  ReturnData,
} from '@shopify/storefront-api-client';

import {ApiVersion} from '../../types';
import {logger} from '../../logger';
import * as ShopifyErrors from '../../error';
import {MissingRequiredArgument} from '../../error';
import type {
  GraphqlClientParams,
  GraphqlParams,
  GraphqlQueryOptions,
  HeaderParams,
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

  public async query<
    T = undefined,
    Operation extends keyof Operations = string,
    Operations extends StorefrontOperations = StorefrontOperations,
  >(
    params: GraphqlParams | Operation,
    options?: GraphqlQueryOptions<Operation, Operations>,
  ): Promise<
    RequestReturn<
      T extends undefined
        ? Required<FetchResponseBody<ReturnData<Operation, Operations>>>
        : T
    >
  > {
    const config = this.storefrontClass().config;

    let operation: Operation;
    let variables: {[key: string]: any} | undefined;
    let headers: HeaderParams = {};
    let tries: number | undefined;
    if (typeof params === 'object') {
      logger(config).deprecated(
        '10.0.0',
        'The query method with a single object argument is deprecated.\n' +
          'See the migration guide: https://github.com/Shopify/shopify-api-js/blob/main/packages/shopify-api/docs/migrating-to-v9.md#using-the-new-clients.',
      );

      if (
        (typeof params.data === 'string' && params.data.length === 0) ||
        Object.entries(params.data).length === 0
      ) {
        throw new ShopifyErrors.MissingRequiredArgument('Query missing.');
      }

      if (typeof params.data === 'string') {
        operation = params.data as typeof operation;
      } else {
        operation = params.data.query as typeof operation;
        variables = params.data.variables as typeof variables;
      }
      headers = params.extraHeaders ?? {};
      tries = params.tries;
    } else {
      operation = params;
      variables = options?.variables;
      headers = options?.extraHeaders ?? {};
      tries = options?.tries;
    }

    const response = await this.client.fetch(operation as string, {
      apiVersion: this.apiVersion || config.apiVersion,
      variables,
      retries: tries && tries > 0 ? tries - 1 : undefined,
      headers: Object.fromEntries(
        Object.entries(headers).map(([key, value]) => [
          key,
          Array.isArray(value) ? value.join(', ') : value.toString(),
        ]),
      ),
    });

    if (!response.ok) {
      const responseHeaders = Object.fromEntries(response.headers.entries());

      throwFailedRequest(
        await response.text(),
        {
          statusCode: response.status,
          statusText: response.statusText,
          headers: responseHeaders,
        },
        false,
      );
    }

    const body = (await response.json()) as T extends undefined
      ? Required<FetchResponseBody<ReturnData<Operation, Operations>>>
      : T;

    // Get errors array
    const errors = (body as unknown as {[key: string]: unknown})
      .errors as any[];

    const responseHeaders = Object.fromEntries(response.headers.entries());

    // Throw error if response contains errors
    if (errors?.length > 0) {
      throw new ShopifyErrors.GraphqlQueryError({
        message: errors[0]?.message ?? 'GraphQL query returned errors',
        response: body as unknown as {[key: string]: unknown},
        headers: responseHeaders,
      });
    }

    return {body, headers: responseHeaders};
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
