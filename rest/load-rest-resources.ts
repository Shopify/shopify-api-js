import {RestResourceError} from '../lib/error';

import {LoadRestResourcesParams, ShopifyRestResources} from './types';

export function loadRestResources({
  resources,
  apiVersion,
  RestClient,
}: LoadRestResourcesParams): ShopifyRestResources {
  const firstResource = Object.keys(resources)[0];
  if (apiVersion !== resources[firstResource].API_VERSION) {
    throw new RestResourceError(
      `Current API version '${apiVersion}' does not match ` +
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
