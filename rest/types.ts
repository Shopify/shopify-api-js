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
  [resource: string]: any;
}
