import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';

import {GraphqlProxy} from './types';
import {graphqlClientClass} from './graphql_client';

export function graphqlProxy(config: ConfigInterface): GraphqlProxy {
  return async ({session, rawBody}) => {
    if (!session.accessToken) {
      throw new ShopifyErrors.InvalidSession(
        'Cannot proxy query. Session not authenticated.',
      );
    }

    const GraphqlClient = graphqlClientClass({config});
    const client = new GraphqlClient({session});
    return client.query({
      data: rawBody,
    });
  };
}
