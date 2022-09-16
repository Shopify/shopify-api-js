import {ConfigInterface} from '../base-types';

import {createHttpClientClass} from './http_client/http_client';
import {createRestClientClass} from './rest/rest_client';
import {createGraphqlClientClass} from './graphql/graphql_client';
import {createStorefrontClientClass} from './graphql/storefront_client';
import {createGraphqlProxy} from './graphql/graphql_proxy';

export interface CreateClientClassParams {
  config: ConfigInterface;
  HttpClient?: ReturnType<typeof createHttpClientClass>;
}

export function createClientClasses(config: ConfigInterface) {
  const HttpClient = createHttpClientClass(config);
  return {
    Rest: createRestClientClass({config, HttpClient}),
    Graphql: createGraphqlClientClass({config, HttpClient}),
    Storefront: createStorefrontClientClass({config, HttpClient}),
    graphqlProxy: createGraphqlProxy(config),
  };
}
