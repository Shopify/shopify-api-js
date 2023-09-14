import {ApiVersion, ShopifyHeader} from '../../types';
import {ConfigInterface} from '../../base-types';
import {httpClientClass, HttpClient} from '../http_client/http_client';
import {DataType, HeaderParams, RequestReturn} from '../http_client/types';
import {Session} from '../../session/session';
import {logger} from '../../logger';
import * as ShopifyErrors from '../../error';

import {GraphqlParams, GraphqlClientParams} from './types';

export interface GraphqlClientClassParams {
  config: ConfigInterface;
  HttpClient?: typeof HttpClient;
}

export class GraphqlClient {
  public static config: ConfigInterface;
  public static HttpClient: typeof HttpClient;

  baseApiPath = '/admin/api';
  readonly session: Session;
  readonly client: HttpClient;
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
          ? `GraphQL client has a redundant API version override to the default ${params.apiVersion}`
          : `GraphQL client overriding default API version ${config.apiVersion} with ${params.apiVersion}`;

      logger(config).debug(message);
    }

    this.session = params.session;
    this.apiVersion = params.apiVersion;
    this.client = new (this.graphqlClass().HttpClient)({
      domain: this.session.shop,
    });
  }

  public async query<T = unknown>(
    params: GraphqlParams,
  ): Promise<RequestReturn<T>> {
    if (
      (typeof params.data === 'string' && params.data.length === 0) ||
      Object.entries(params.data).length === 0
    ) {
      throw new ShopifyErrors.MissingRequiredArgument('Query missing.');
    }

    const apiHeaders = this.getApiHeaders();
    params.extraHeaders = {...apiHeaders, ...params.extraHeaders};

    const path = `${this.baseApiPath}/${
      this.apiVersion || this.graphqlClass().config.apiVersion
    }/graphql.json`;

    let dataType: DataType.GraphQL | DataType.JSON;

    if (typeof params.data === 'object') {
      dataType = DataType.JSON;
    } else {
      dataType = DataType.GraphQL;
    }

    const result = await this.client.post<T>({
      path,
      type: dataType,
      ...params,
    });

    // Get errors array
    const errors = (result.body as unknown as {[key: string]: unknown})
      .errors as any[];

    // Throw error if response contains errors
    if (errors?.length > 0) {
      throw new ShopifyErrors.GraphqlQueryError({
        message: errors[0]?.message ?? 'GraphQL query returned errors',
        response: result.body as unknown as {[key: string]: unknown},
        headers: result.headers,
      });
    }

    return result;
  }

  protected getApiHeaders(): HeaderParams {
    const {config} = this.graphqlClass();

    let accessToken: string | undefined;
    if (config.isCustomStoreApp) {
      // Deprecated: starting in v8, we should only get the token from adminApiAccessToken
      accessToken = config.adminApiAccessToken ?? config.apiSecretKey;
    } else {
      accessToken = this.session.accessToken;

      if (!accessToken) {
        throw new ShopifyErrors.MissingRequiredArgument(
          'Session missing access token.',
        );
      }
    }

    return {
      [ShopifyHeader.AccessToken]: accessToken,
    };
  }

  private graphqlClass() {
    return this.constructor as typeof GraphqlClient;
  }
}

export function graphqlClientClass(
  params: GraphqlClientClassParams,
): typeof GraphqlClient {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = httpClientClass(params.config);
  }

  class NewGraphqlClient extends GraphqlClient {
    public static config = config;
    public static HttpClient = HttpClient!;
  }

  Reflect.defineProperty(NewGraphqlClient, 'name', {
    value: 'GraphqlClient',
  });

  return NewGraphqlClient as typeof GraphqlClient;
}
