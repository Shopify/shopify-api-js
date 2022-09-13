import {ApiVersion} from '../base-types';
import {createRestClientClass} from '../clients/rest/rest_client';

import {Base} from './base';

export interface IdSet {
  [id: string]: string | number | null;
}

export interface ParamSet {
  [key: string]: any;
}

export interface Body {
  [key: string]: any;
}

export interface ResourcePath {
  http_method: string;
  operation: string;
  ids: string[];
  path: string;
}

export interface ShopifyRestResources {
  [resource: string]: typeof Base;
}

export interface LoadRestResourcesParams {
  resources: ShopifyRestResources;
  apiVersion: ApiVersion;
  RestClient: ReturnType<typeof createRestClientClass>;
}
