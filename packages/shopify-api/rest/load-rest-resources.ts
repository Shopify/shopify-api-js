import type {ShopifyClients} from '../lib';
import {ConfigInterface} from '../lib/base-types';
import {logger} from '../lib/logger';

import {Base} from './base';
import {ShopifyRestResources} from './types';

export interface LoadRestResourcesParams<
  Resources extends ShopifyRestResources,
> {
  resources: Resources;
  config: ConfigInterface;
  RestClient: ShopifyClients['Rest'];
}

export function loadRestResources<Resources extends ShopifyRestResources>({
  resources,
  config,
  RestClient,
}: LoadRestResourcesParams<Resources>): Resources {
  const firstResource = Object.keys(resources)[0];
  if (config.apiVersion !== resources[firstResource].apiVersion) {
    logger(config).warning(
      `Loading REST resources for API version ${resources[firstResource].apiVersion}, which doesn't match the default ${config.apiVersion}`,
    );
  }

  return Object.fromEntries(
    Object.entries(resources).map(([name, resource]) => {
      class NewResource extends resource {}

      NewResource.setClassProperties({
        Client: RestClient,
        config,
      });

      Object.entries(NewResource.hasOne).map(([_attribute, klass]) => {
        (klass as typeof Base).setClassProperties({
          Client: RestClient,
          config,
        });
      });

      Object.entries(NewResource.hasMany).map(([_attribute, klass]) => {
        (klass as typeof Base).setClassProperties({
          Client: RestClient,
          config,
        });
      });

      Reflect.defineProperty(NewResource, 'name', {
        value: name,
      });

      return [name, NewResource];
    }),
  ) as Resources;
}
