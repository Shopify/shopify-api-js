import {ConfigInterface} from '../base-types';

import {createHttpClientClass} from './http_client/http_client';
import {createRestClientClass} from './rest/rest_client';
import {createGraphqlClientClass} from './graphql/graphql_client';
import {createStorefrontClientClass} from './graphql/storefront_client';
import {createGraphqlProxy} from './graphql/graphql_proxy';

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

export type ShopifyClients = ReturnType<typeof createClientClasses>;
