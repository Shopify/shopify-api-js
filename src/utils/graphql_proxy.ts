import http from 'http';

import {ConfigInterface} from '../base-types';
import {GraphqlClient} from '../clients/graphql';
import {RequestReturn} from '../clients/http_client/types';
import * as ShopifyErrors from '../error';

import {createLoadCurrentSession} from './load-current-session';

export function createGraphqlProxy(config: ConfigInterface) {
  return async (
    userReq: http.IncomingMessage,
    userRes: http.ServerResponse,
  ): Promise<RequestReturn> => {
    const session = await createLoadCurrentSession(config)(userReq, userRes);
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
  };
}
