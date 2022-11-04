import {ConfigInterface} from '../../base-types';
import {RequestReturn} from '../http_client/types';
import * as ShopifyErrors from '../../error';

import {GraphqlProxyParams} from './types';
import {createGraphqlClientClass} from './graphql_client';

export function createGraphqlProxy(config: ConfigInterface) {
  return async ({
    session,
    rawBody,
  }: GraphqlProxyParams): Promise<RequestReturn> => {
    if (!session.accessToken) {
      throw new ShopifyErrors.InvalidSession(
        'Cannot proxy query. Session not authenticated.',
      );
    }

    const GraphqlClient = createGraphqlClientClass({config});
    const client = new GraphqlClient({session});
    return client.query({
      data: rawBody,
    });
  };
}
