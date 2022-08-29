import {ConfigInterface} from '../base-types';

import {createRestClientClass} from './rest/rest_client';
import {createGraphqlClientClass} from './graphql/graphql_client';
import {createStorefrontClientClass} from './graphql/storefront_client';

export function createClientClasses(config: ConfigInterface) {
  return {
    Rest: createRestClientClass(config),
    Graphql: createGraphqlClientClass(config),
    Storefront: createStorefrontClientClass(config),
  };
}
