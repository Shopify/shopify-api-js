import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';
import {graphqlClientClass} from '../legacy_graphql/legacy_admin_client';

import {GraphqlProxy} from './types';

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
