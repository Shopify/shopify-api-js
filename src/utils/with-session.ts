import * as ShopifyErrors from '../error';
import {Session} from '../auth/session';
import {GraphqlClient} from '../clients/graphql';
import {RestClient} from '../clients/rest';
import {Context} from '../context';

import {WithSessionParams, WithSessionResponse} from './types';
import loadOfflineSession from './load-offline-session';
import loadCurrentSession from './load-current-session';

export default async function withSession({
  clientType,
  isOnline,
  req,
  shop,
}: WithSessionParams): Promise<WithSessionResponse> {
  Context.throwIfUninitialized();

  let session: Session | undefined;
  if (isOnline) {
    if (!req) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Please pass in the "request" object.',
      );
    }

    session = await loadCurrentSession(req);
  } else {
    if (!shop) {
      throw new ShopifyErrors.MissingRequiredArgument(
        'Please pass in a value for "shop"',
      );
    }

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
}
