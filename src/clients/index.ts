import {ConfigInterface} from '../base-types';

import {createRestClientClass} from './rest/rest_client';
// import {GraphqlClient as Graphql} from './graphql';
// import {StorefrontClient as Storefront} from './graphql/storefront_client';

export function createClientClasses(config: ConfigInterface) {
  return {
    rest: createRestClientClass(config),
  };
}
