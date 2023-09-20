import {ConfigInterface} from '../base-types';

import {httpClientClass} from './http_client/http_client';
import {restClientClass} from './rest/rest_client';
import {graphqlClientClass} from './graphql/graphql_client';
import {storefrontClientClass} from './graphql/storefront_client';
import {graphqlProxy} from './graphql/graphql_proxy';

export function clientClasses(config: ConfigInterface) {
  const HttpClient = httpClientClass(config);
  return {
    // We don't pass in the HttpClient because the RestClient inherits from it, and goes through the same setup process
    Rest: restClientClass({config}),
    Graphql: graphqlClientClass({config, HttpClient}),
    Storefront: storefrontClientClass({config, HttpClient}),
    graphqlProxy: graphqlProxy(config),
  };
}

export type ShopifyClients = ReturnType<typeof clientClasses>;
