import {ConfigInterface, ShopifyHeader} from '../../base-types';
import {createHttpClientClass, HttpClient} from '../http_client/http_client';
import {DataType, RequestReturn} from '../http_client/types';
import {Session} from '../../session/session';
import * as ShopifyErrors from '../../error';
import {CreateGraphqlClientClassParams} from '..';

import {GraphqlParams} from './types';

export interface AccessTokenHeader {
  header: string;
  value: string;
}

export class GraphqlClient {
  baseApiPath = '/admin/api';
  readonly session: Session;
  readonly client: HttpClient;

  public static CONFIG: ConfigInterface;
  public static HTTP_CLIENT: typeof HttpClient;

  constructor(session: Session) {
    if (!this.graphqlClass().CONFIG.isPrivateApp && !session.accessToken) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Missing access token when creating GraphQL client',
      );
    }

    this.session = session;
    this.client = new (this.graphqlClass().HTTP_CLIENT)({
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

    const accessTokenHeader = this.getAccessTokenHeader();
    params.extraHeaders = {
      [accessTokenHeader.header]: accessTokenHeader.value,
      ...params.extraHeaders,
    };

    const path = `${this.baseApiPath}/${
      this.graphqlClass().CONFIG.apiVersion
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

    if ((result.body as unknown as {[key: string]: unknown}).errors) {
      throw new ShopifyErrors.GraphqlQueryError({
        message: 'GraphQL query returned errors',
        response: result.body as unknown as {[key: string]: unknown},
      });
    }
    return result;
  }

  protected getAccessTokenHeader(): AccessTokenHeader {
    return {
      header: ShopifyHeader.AccessToken,
      value: this.graphqlClass().CONFIG.isPrivateApp
        ? this.graphqlClass().CONFIG.apiSecretKey
        : (this.session.accessToken as string),
    };
  }

  private graphqlClass() {
    return this.constructor as typeof GraphqlClient;
  }
}

export function createGraphqlClientClass(
  params: CreateGraphqlClientClassParams,
): typeof GraphqlClient {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = createHttpClientClass(params.config);
  }

  class NewGraphqlClient extends GraphqlClient {
    public static CONFIG = config;
    public static HTTP_CLIENT = HttpClient!;
  }

  Reflect.defineProperty(NewGraphqlClient, 'name', {
    value: 'GraphqlClient',
  });

  return NewGraphqlClient as typeof GraphqlClient;
}
