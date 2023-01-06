import {ConfigInterface} from '../lib/base-types';
import {RestClient} from '../lib/clients/rest/rest_client';
import {logger} from '../lib/logger';

import {ShopifyRestResources} from './types';

export interface LoadRestResourcesParams {
  resources: ShopifyRestResources;
  config: ConfigInterface;
  RestClient: typeof RestClient;
}

export function loadRestResources({
  resources,
  config,
  RestClient,
}: LoadRestResourcesParams): ShopifyRestResources {
  const firstResource = Object.keys(resources)[0];
  if (config.apiVersion !== resources[firstResource].API_VERSION) {
    logger(config).warning(
      `Current API version '${config.apiVersion}' does not match ` +
        `resource API version '${resources[firstResource].API_VERSION}'`,
    );
  }

  return Object.fromEntries(
    Object.entries(resources).map(([name, resource]) => {
      class NewResource extends resource {
        public static CLIENT = RestClient;
      }

      Reflect.defineProperty(NewResource, 'name', {
        value: name,
      });

      return [name, NewResource];
    }),
  );
}
