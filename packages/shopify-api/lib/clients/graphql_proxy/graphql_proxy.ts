import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';
import {adminGraphqlClientFactory} from '../admin';
import {graphqlClientClass} from '../legacy_graphql/legacy_admin_client';

import {GraphqlProxy} from './types';

export function graphqlProxy<Config extends ConfigInterface>(
  config: Config,
): GraphqlProxy<Config['future']> {
  return async ({session, rawBody}) => {
    if (!session.accessToken) {
      throw new ShopifyErrors.InvalidSession(
        'Cannot proxy query. Session not authenticated.',
      );
    }

    let response;
    if (config.future?.unstable_newApiClients) {
      const client = adminGraphqlClientFactory(config)({session});
      response = client.request(rawBody);
    } else {
      const GraphqlClient = graphqlClientClass({config});
      const client = new GraphqlClient({session});
      response = client.query({data: rawBody});
    }

    return response as ReturnType<GraphqlProxy<Config['future']>>;
  };
}
