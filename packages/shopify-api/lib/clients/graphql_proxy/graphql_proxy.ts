import {ConfigInterface} from '../../base-types';
import * as ShopifyErrors from '../../error';
import {graphqlClientClass} from '../admin';

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

    let query: string;
    let variables: Record<string, any> | undefined;
    if (typeof rawBody === 'string') {
      query = rawBody;
    } else {
      query = rawBody.query;
      variables = rawBody.variables;
    }

    if (!query) {
      throw new ShopifyErrors.MissingRequiredArgument('Query missing.');
    }

    const response = await client.request(query, {variables});

    return {body: response, headers: {}};
  };
}
