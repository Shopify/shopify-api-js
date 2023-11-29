import {createStorefrontApiClient} from '@shopify/storefront-api-client';

import {ConfigInterface} from '../../base-types';
import {logger} from '../../logger';
import {abstractFetch} from '../../../runtime';
import {clientLoggerFactory, getUserAgent} from '../common';

import {StorefrontClientFactory} from './types';

export function storefrontGraphqlClientFactory(
  config: ConfigInterface,
): StorefrontClientFactory {
  return ({session, apiVersion, retries}) => {
    if (apiVersion && apiVersion !== config.apiVersion) {
      logger(config).debug(
        `Storefront client overriding default API version ${config.apiVersion} with ${apiVersion}`,
      );
    }
    return createStorefrontApiClient({
      storeDomain: session.shop,
      privateAccessToken: config.isCustomStoreApp
        ? config.privateAppStorefrontAccessToken
        : session.accessToken!,
      apiVersion: apiVersion ?? config.apiVersion,
      customFetchApi: abstractFetch,
      logger: clientLoggerFactory(config),
      retries,
      clientName: getUserAgent(config),
    });
  };
}
