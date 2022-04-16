import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Image} from './image';
import {Variant} from './variant';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  ids?: unknown;
  limit?: unknown;
  since_id?: unknown;
  title?: unknown;
  vendor?: unknown;
  handle?: unknown;
  product_type?: unknown;
  status?: unknown;
  collection_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
  fields?: unknown;
  presentment_currencies?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  vendor?: unknown;
  product_type?: unknown;
  collection_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
}

export class Product extends Base {
  public static API_VERSION = ApiVersion.July21;

  protected static NAME = 'product';
  protected static PLURAL_NAME = 'products';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {
    "images": Image,
    "variants": Variant
  };
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "products/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "products/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "products.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "products/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "products.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "products/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Product | null> {
    const result = await Product.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Product : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Product.request({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      ids = null,
      limit = null,
      since_id = null,
      title = null,
      vendor = null,
      handle = null,
      product_type = null,
      status = null,
      collection_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      published_status = null,
      fields = null,
      presentment_currencies = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Product[]> {
    const response = await Product.baseFind({
      session: session,
      urlIds: {},
      params: {"ids": ids, "limit": limit, "since_id": since_id, "title": title, "vendor": vendor, "handle": handle, "product_type": product_type, "status": status, "collection_id": collection_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, "fields": fields, "presentment_currencies": presentment_currencies, ...otherArgs},
    });

    return response as Product[];
  }

  public static async count(
    {
      session,
      vendor = null,
      product_type = null,
      collection_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      published_status = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Product.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"vendor": vendor, "product_type": product_type, "collection_id": collection_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public title: string | null;
  public body_html: string | null;
  public created_at: string | null;
  public handle: string | null;
  public id: number | null;
  public images: Image[] | null | {[key: string]: any};
  public options: {[key: string]: unknown} | {[key: string]: unknown}[] | null;
  public product_type: string | null;
  public published_at: string | null;
  public published_scope: string | null;
  public status: string | null;
  public tags: string | string[] | null;
  public template_suffix: string | null;
  public updated_at: string | null;
  public variants: Variant[] | null | {[key: string]: any};
  public vendor: string | null;
}
