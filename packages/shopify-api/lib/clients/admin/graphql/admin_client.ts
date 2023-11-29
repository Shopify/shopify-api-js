import {createAdminApiClient} from '@shopify/admin-api-client';

import {logger} from '../../../logger';
import {ConfigInterface} from '../../../base-types';
import {AdminGraphqlClientFactory} from '../types';
import {abstractFetch} from '../../../../runtime';
import {clientLoggerFactory, getUserAgent} from '../../common';
import {GraphqlQueryError} from '../../../error';

export function adminGraphqlClientFactory(
  config: ConfigInterface,
): AdminGraphqlClientFactory {
  return ({session, apiVersion, retries}) => {
    if (apiVersion && apiVersion !== config.apiVersion) {
      logger(config).debug(
        `Admin client overriding default API version ${config.apiVersion} with ${apiVersion}`,
      );
    }

    const client = createAdminApiClient({
      storeDomain: session.shop,
      accessToken: config.adminApiAccessToken ?? session.accessToken!,
      apiVersion: apiVersion ?? config.apiVersion,
      customFetchApi: abstractFetch,
      logger: clientLoggerFactory(config),
      retries,
      userAgentPrefix: getUserAgent(config),
    });

    // Extend the underlying client so we can handle errors as we did before, by throwing a GraphqlQueryError
    const request: typeof client.request = async (...params) => {
      const response = await client.request(...params);

      if (response.errors) {
        const errors = response.errors.graphQLErrors;
        throw new GraphqlQueryError({
          message: errors?.[0]?.message ?? 'GraphQL query returned errors',
          response: response.data ?? {},
        });
      }

      return response;
    };
    return {...client, request};
  };
}
