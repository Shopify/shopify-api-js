import type {
  ConfigInterface,
  AdminRestClientFactory,
  ShopifyClients,
} from '../lib';
import {logger} from '../lib/logger';
import {RestClient as RestClientClass} from '../lib/clients/admin/rest/rest_client';

import {Base} from './base';
import {ShopifyRestResources} from './types';

export function loadRestResources<
  Config extends ConfigInterface,
  Clients extends ShopifyClients<Config['future']>,
  Resources extends ShopifyRestResources,
>(config: Config, clients: Clients, resources: Resources): Resources {
  const firstResource = Object.keys(resources)[0];
  if (config.apiVersion !== resources[firstResource].apiVersion) {
    logger(config).warning(
      `Loading REST resources for API version ${resources[firstResource].apiVersion}, which doesn't match the default ${config.apiVersion}`,
    );
  }

  function usingNewClients(
    _clients: any,
    config: ConfigInterface,
  ): _clients is ShopifyClients<{unstable_newApiClients: true}> {
    return config.future?.unstable_newApiClients ?? false;
  }

  const classProps: {
    config: ConfigInterface;
    Client?: typeof RestClientClass;
    client?: AdminRestClientFactory;
  } = {config};
  if (usingNewClients(clients, config)) {
    classProps.client = clients.admin.rest;
  } else {
    classProps.Client = clients.Rest;
  }

  return Object.fromEntries(
    Object.entries(resources).map(([name, resource]) => {
      class NewResource extends resource {}

      NewResource.setClassProperties(classProps);

      Object.entries(NewResource.hasOne).map(([_attribute, klass]) => {
        (klass as typeof Base).setClassProperties(classProps);
      });

      Object.entries(NewResource.hasMany).map(([_attribute, klass]) => {
        (klass as typeof Base).setClassProperties(classProps);
      });

      Reflect.defineProperty(NewResource, 'name', {
        value: name,
      });

      return [name, NewResource];
    }),
  ) as Resources;
}
