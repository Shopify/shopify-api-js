import {ConfigInterface} from '../base-types';

import {restClientClass, graphqlClientClass} from './admin';
import {storefrontClientClass} from './storefront';
import {graphqlProxy} from './graphql_proxy/graphql_proxy';
import {ShopifyClients} from './types';

export {ShopifyClients} from './types';

export function clientClasses(config: ConfigInterface): ShopifyClients {
  return {
    // We don't pass in the HttpClient because the RestClient inherits from it, and goes through the same setup process
    Rest: restClientClass({config}),
    Graphql: graphqlClientClass({config}),
    Storefront: storefrontClientClass({config}),
    graphqlProxy: graphqlProxy(config),
  };
}
