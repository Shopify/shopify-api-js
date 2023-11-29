import {ConfigInterface} from '../base-types';

import {httpClientClass} from './http_client/http_client';
import {
  adminRestClientFactory,
  restClientClass,
} from './admin/rest/rest_client';
import {graphqlClientClass} from './legacy_graphql/legacy_admin_client';
import {storefrontClientClass} from './legacy_graphql/legacy_storefront_client';
import {graphqlProxy} from './graphql_proxy/graphql_proxy';
import {ShopifyClients} from './types';
import {storefrontGraphqlClientFactory} from './storefront';
import {adminGraphqlClientFactory} from './admin';

export {ShopifyClients} from './types';

export function clientClasses<Config extends ConfigInterface>(
  config: Config,
): ShopifyClients<Config['future']> {
  if (config.future?.unstable_newApiClients) {
    return {
      admin: {
        rest: adminRestClientFactory(config),
        graphql: adminGraphqlClientFactory(config),
      },
      storefront: storefrontGraphqlClientFactory(config),
      graphqlProxy: graphqlProxy(config),
    } as ShopifyClients<Config['future']>;
  } else {
    const HttpClient = httpClientClass(config);
    return {
      // We don't pass in the HttpClient because the RestClient inherits from it, and goes through the same setup process
      Rest: restClientClass({config}),
      Graphql: graphqlClientClass({config, HttpClient}),
      Storefront: storefrontClientClass({config, HttpClient}),
      graphqlProxy: graphqlProxy(config),
    } as ShopifyClients<Config['future']>;
  }
}
