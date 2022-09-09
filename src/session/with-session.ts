import * as ShopifyErrors from '../error';
import {ClientType, ConfigInterface} from '../base-types';
import {createRestClientClass} from '../clients/rest/rest_client';
import {createGraphqlClientClass} from '../clients/graphql/graphql_client';

import {WithSessionParams, WithSessionResponse} from './types';
import {createGetCurrent} from './get-current';

export function createWithSession(config: ConfigInterface) {
  return async ({
    clientType,
    isOnline,
    ...adapterArgs
  }: WithSessionParams): Promise<WithSessionResponse> => {
    const session = await createGetCurrent(config)({isOnline, ...adapterArgs});
    if (!session) {
      throw new ShopifyErrors.SessionNotFound('No session found.');
    } else if (!session.accessToken) {
      throw new ShopifyErrors.InvalidSession(
        'Requested session does not contain an access token.',
      );
    }

    const RestClient = createRestClientClass({config});
    const GraphqlClient = createGraphqlClientClass({config});
    switch (clientType) {
      case ClientType.Rest:
        return {
          client: new RestClient({
            domain: session.shop,
            accessToken: session.accessToken,
          }),
          session,
        };
      case ClientType.Graphql:
        return {
          client: new GraphqlClient({
            domain: session.shop,
            accessToken: session.accessToken,
          }),
          session,
        };
      default:
        throw new ShopifyErrors.UnsupportedClientType(
          `"${clientType}" is an unsupported clientType. Please use "rest" or "graphql".`,
        );
    }
  };
}
