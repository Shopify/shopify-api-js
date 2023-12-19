export type IdSet = Record<string, string | number | null>;

export type ParamSet = Record<string, any>;

export type Body = Record<string, any>;

export interface ResourcePath {
  http_method: string;
  operation: string;
  ids: string[];
  path: string;
}

export type ShopifyRestResources = Record<string, any>;

export interface ResourceNames {
  singular: string;
  plural: string;
}
