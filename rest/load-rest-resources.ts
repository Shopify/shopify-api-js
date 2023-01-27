import {ConfigInterface} from '../lib/base-types';
import {RestClient} from '../lib/clients/rest/rest_client';
import {logger} from '../lib/logger';

import {Base} from './base';
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
      `Loading REST resources for API version ${resources[firstResource].API_VERSION}, which doesn't match the default ${config.apiVersion}`,
    );
  }

  return Object.fromEntries(
    Object.entries(resources).map(([name, resource]) => {
      class NewResource extends resource {}

      NewResource.setClassProperties({
        CLIENT: RestClient,
        CONFIG: config,
      });

      Object.entries(NewResource.HAS_ONE).map(([_attribute, klass]) => {
        (klass as typeof Base).setClassProperties({
          CLIENT: RestClient,
          CONFIG: config,
        });
      });

      Object.entries(NewResource.HAS_MANY).map(([_attribute, klass]) => {
        (klass as typeof Base).setClassProperties({
          CLIENT: RestClient,
          CONFIG: config,
        });
      });

      Reflect.defineProperty(NewResource, 'name', {
        value: name,
      });

      return [name, NewResource];
    }),
  );
}
