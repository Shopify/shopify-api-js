import http from 'http';

import {GraphqlClient} from '../clients/graphql';
import * as ShopifyErrors from '../error';

import loadCurrentSession from './load-current-session';

export default async function graphqlProxy(
  userReq: http.IncomingMessage,
  userRes: http.ServerResponse,
): Promise<void> {
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

  const promise: Promise<void> = new Promise((resolve, _reject) => {
    userReq.on('data', (chunk) => {
      reqBodyString += chunk;
    });

    userReq.on('end', async () => {
      let reqBodyObject: {[key: string]: unknown;} | undefined;
      try {
        reqBodyObject = JSON.parse(reqBodyString);
      } catch (err) {
        // we can just continue and attempt to pass the string
      }

      let status = 200;
      let body: unknown = '';

      try {
        const options = {
          data: reqBodyObject ? reqBodyObject : reqBodyString,
        };
        const client = new GraphqlClient(shopName, token);
        const response = await client.query(options);
        body = response.body;
      } catch (err) {
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
        body = err.message;
      } finally {
        userRes.statusCode = status;
        userRes.end(JSON.stringify(body));
      }
      return resolve();
    });
  });
  return promise;
}
