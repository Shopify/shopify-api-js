import {ConfigInterface} from '../base-types';

import {createHttpClientClass, HttpClient} from './http_client/http_client';
import {createRestClientClass} from './rest/rest_client';
import {createGraphqlClientClass} from './graphql/graphql_client';
import {createStorefrontClientClass} from './graphql/storefront_client';
import {createGraphqlProxy} from './graphql/graphql_proxy';

export interface CreateRestClientClassParams {
  config: ConfigInterface;
}

export interface CreateGraphqlClientClassParams {
  config: ConfigInterface;
  HttpClient?: typeof HttpClient;
}

export function createClientClasses(config: ConfigInterface) {
  const HttpClient = createHttpClientClass(config);
  return {
    // We don't pass in the HttpClient because the RestClient inherits from it, and goes through the same setup process
    Rest: createRestClientClass({config}),
    Graphql: createGraphqlClientClass({config, HttpClient}),
    Storefront: createStorefrontClientClass({config, HttpClient}),
    graphqlProxy: createGraphqlProxy(config),
  };
}
