import {
  AdminApiClient,
  AdminOperations,
  ApiClientRequestOptions,
  ClientResponse,
  createAdminApiClient,
  ReturnData,
} from '@shopify/admin-api-client';

import {ApiVersion} from '../../../types';
import {ConfigInterface} from '../../../base-types';
import type {
  RequestReturn,
  GraphqlParams,
  GraphqlClientParams,
  GraphqlQueryOptions,
} from '../../types';
import {Session} from '../../../session/session';
import {logger} from '../../../logger';
import * as ShopifyErrors from '../../../error';
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

  public async query<T = undefined>(
    params: GraphqlParams,
  ): Promise<RequestReturn<T>> {
    logger(this.graphqlClass().config).deprecated(
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
    Operations extends AdminOperations = AdminOperations,
  >(
    operation: Operation,
    options?: GraphqlQueryOptions<Operation, Operations>,
  ): Promise<
    ClientResponse<T extends undefined ? ReturnData<Operation, Operations> : T>
  > {
    const response = await this.client.request<T, Operation>(operation, {
      apiVersion: this.apiVersion || this.graphqlClass().config.apiVersion,
      ...(options as ApiClientRequestOptions<Operation, AdminOperations>),
    });

    if (response.errors) {
      const fetchResponse = response.errors.response;

      throwFailedRequest(response, (options?.retries ?? 0) > 0, fetchResponse);
    }

    return response;
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
