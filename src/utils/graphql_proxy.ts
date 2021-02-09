import http from 'http';

import {GraphqlClient} from '../clients/graphql';
import * as ShopifyErrors from '../error';

import loadCurrentSession from './load-current-session';

export default async function graphqlProxy(userReq: http.IncomingMessage, userRes: http.ServerResponse): Promise<void> {
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
  let query = '';

  const promise: Promise<void> = new Promise((resolve, _reject) => { // eslint-disable-line promise/param-names
    userReq.on('data', (chunk) => {
      query += chunk;
    });

    userReq.on('end', async () => {
      let body: unknown = '';
      try {
        const options = {
          data: query,
        };
        const client = new GraphqlClient(shopName, token);
        const response = await client.query(options);
        body = response.body;
      } catch (err) {
        let status;
        switch (err.constructor.name) {
          case 'MissingRequiredArgument':
            status = 400;
            break;
          case 'HttpResponseError':
            status = err.code;
            break;
          case 'HttpThrottlingError':
            status = 429;
            break;
          default:
            status = 500;
        }
        userRes.statusCode = status;
        body = err.message;
      } finally {
        userRes.end(JSON.stringify(body));
      }
      return resolve();
    });
  });
  return promise;
}
