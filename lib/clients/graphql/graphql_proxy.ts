import {ConfigInterface} from '../../base-types';
import {RequestReturn} from '../http_client/types';
import * as ShopifyErrors from '../../error';
import {createGetCurrent} from '../../session/get-current';

import {GraphqlProxyParams} from './types';
import {createGraphqlClientClass} from './graphql_client';

export function createGraphqlProxy(config: ConfigInterface) {
  return async ({
    rawBody,
    ...adapterArgs
  }: GraphqlProxyParams): Promise<RequestReturn> => {
    const session = await createGetCurrent(config)({
      isOnline: true,
      ...adapterArgs,
    });
    if (!session) {
      throw new ShopifyErrors.SessionNotFound(
        'Cannot proxy query. No session found.',
      );
    } else if (!session.accessToken) {
      throw new ShopifyErrors.InvalidSession(
        'Cannot proxy query. Session not authenticated.',
      );
    }

    const GraphqlClient = createGraphqlClientClass({config});
    const client = new GraphqlClient({
      domain: session.shop,
      accessToken: session.accessToken,
    });
    return client.query({
      data: rawBody,
    });
  };
}
