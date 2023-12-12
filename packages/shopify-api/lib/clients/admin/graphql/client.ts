import {
  AdminApiClient,
  AdminOperations,
  createAdminApiClient,
  FetchResponseBody,
  ReturnData,
} from '@shopify/admin-api-client';

import {ApiVersion} from '../../../types';
import {ConfigInterface} from '../../../base-types';
import {HeaderParams, RequestReturn} from '../../http_client/types';
import {Session} from '../../../session/session';
import {logger} from '../../../logger';
import * as ShopifyErrors from '../../../error';
import type {
  GraphqlParams,
  GraphqlClientParams,
  GraphqlQueryOptions,
} from '../../types';
import {abstractFetch} from '../../../../runtime';
import {
  clientLoggerFactory,
  getUserAgent,
  throwFailedRequest,
} from '../../common';

interface GraphqlClientClassParams {
  config: ConfigInterface;
}
export class GraphqlClient {
  public static config: ConfigInterface;

  readonly session: Session;
  readonly client: AdminApiClient;
  readonly apiVersion?: ApiVersion;

  constructor(params: GraphqlClientParams) {
    const config = this.graphqlClass().config;

    if (!config.isCustomStoreApp && !params.session.accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating GraphQL client',
      );
    }

    if (params.apiVersion) {
      const message =
        params.apiVersion === config.apiVersion
          ? `Admin client has a redundant API version override to the default ${params.apiVersion}`
          : `Admin client overriding default API version ${config.apiVersion} with ${params.apiVersion}`;

      logger(config).debug(message);
    }

    this.session = params.session;
    this.apiVersion = params.apiVersion;
    this.client = createAdminApiClient({
      accessToken: config.adminApiAccessToken ?? this.session.accessToken!,
      apiVersion: this.apiVersion ?? config.apiVersion,
      storeDomain: this.session.shop,
      customFetchApi: abstractFetch,
      logger: clientLoggerFactory(config),
      userAgentPrefix: getUserAgent(config),
    });
  }

  public async query<
    T = undefined,
    Operation extends keyof Operations = string,
    Operations extends AdminOperations = AdminOperations,
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
    let operation: Operation;
    let variables: {[key: string]: any} | undefined;
    let headers: HeaderParams = {};
    let tries: number | undefined;
    if (typeof params === 'object') {
      logger(this.graphqlClass().config).deprecated(
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
        operation = params.data as Operation;
      } else {
        operation = params.data.query as Operation;
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
      apiVersion: this.apiVersion || this.graphqlClass().config.apiVersion,
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

  private graphqlClass() {
    return this.constructor as typeof GraphqlClient;
  }
}

export function graphqlClientClass({
  config,
}: GraphqlClientClassParams): typeof GraphqlClient {
  class NewGraphqlClient extends GraphqlClient {
    public static config = config;
  }

  Reflect.defineProperty(NewGraphqlClient, 'name', {
    value: 'GraphqlClient',
  });

  return NewGraphqlClient as typeof GraphqlClient;
}
