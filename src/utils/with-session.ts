import * as ShopifyErrors from '../error';
import {SessionInterface} from '../auth/session/types';
import {GraphqlClient} from '../clients/graphql';
import {RestClient} from '../clients/rest';
import {ConfigInterface} from '../base-types';

import {WithSessionParams, WithSessionResponse} from './types';
import {createLoadOfflineSession} from './load-offline-session';
import {createLoadCurrentSession} from './load-current-session';

export function createWithSession(config: ConfigInterface) {
  return async ({
    clientType,
    isOnline,
    req,
    res,
    shop,
  }: WithSessionParams): Promise<WithSessionResponse> => {
    let session: SessionInterface | undefined;
    if (isOnline) {
      if (!req || !res) {
        throw new ShopifyErrors.MissingRequiredArgument(
          'Please pass in both the "request" and "response" objects.',
        );
      }

      const loadCurrentSession = createLoadCurrentSession(config);
      session = await loadCurrentSession(req, res);
    } else {
      if (!shop) {
        throw new ShopifyErrors.MissingRequiredArgument(
          'Please pass in a value for "shop"',
        );
      }

      const loadOfflineSession = createLoadOfflineSession(config);
      session = await loadOfflineSession(shop);
    }

    if (!session) {
      throw new ShopifyErrors.SessionNotFound('No session found.');
    } else if (!session.accessToken) {
      throw new ShopifyErrors.InvalidSession(
        'Requested session does not contain an accessToken.',
      );
    }

    let client: RestClient | GraphqlClient;
    switch (clientType) {
      case 'rest':
        client = new RestClient(session.shop, session.accessToken);
        return {
          client,
          session,
        };
      case 'graphql':
        client = new GraphqlClient(session.shop, session.accessToken);
        return {
          client,
          session,
        };
      default:
        throw new ShopifyErrors.UnsupportedClientType(
          `"${clientType}" is an unsupported clientType. Please use "rest" or "graphql".`,
        );
    }
  };
}
