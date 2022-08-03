import http from 'http';

import {GraphqlClient} from '../clients/graphql';
import {RequestReturn} from '../clients/http_client/types';
import * as ShopifyErrors from '../error';

import loadCurrentSession from './load-current-session';

export default async function graphqlProxy(
  userReq: http.IncomingMessage,
  userRes: http.ServerResponse,
): Promise<RequestReturn> {
  const session = await loadCurrentSession(userReq, userRes);
  if (!session) {
    throw new ShopifyErrors.SessionNotFound(
      'Cannot proxy query. No session found.',
    );
  } else if (!session.accessToken) {
    throw new ShopifyErrors.InvalidSession(
      'Cannot proxy query. Session not authenticated.',
    );
  }

  const shopName: string = session.shop;
  const token: string = session.accessToken;
  let reqBodyString = '';

  return new Promise((resolve, reject) => {
    userReq.on('data', (chunk) => {
      reqBodyString += chunk;
    });

    userReq.on('end', async () => {
      let reqBodyObject: {[key: string]: unknown} | undefined;
      try {
        reqBodyObject = JSON.parse(reqBodyString);
      } catch (err) {
        // we can just continue and attempt to pass the string
      }

      try {
        const options = {
          data: reqBodyObject ? reqBodyObject : reqBodyString,
        };
        const client = new GraphqlClient(shopName, token);
        const response = await client.query(options);
        return resolve(response);
      } catch (err) {
        return reject(err);
      }
    });
  });
}
