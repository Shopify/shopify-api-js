/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Image} from './image';
import {Variant} from './variant';

interface FindArgs {
  session: SessionInterface;
  product_id: number | string;
}
interface DeleteArgs {
  session: SessionInterface;
  product_id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  product_ids?: unknown;
  limit?: unknown;
  collection_id?: unknown;
  updated_at_min?: unknown;
  handle?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
}
interface ProductIdsArgs {
  [key: string]: unknown;
  session: SessionInterface;
  limit?: unknown;
}

export class ProductListing extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'product_listing';
  protected static PLURAL_NAME = 'product_listings';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {
    "images": Image,
    "variants": Variant
  };
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["product_id"], "path": "product_listings/<product_id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "product_listings/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "product_listings.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "product_listings/<product_id>.json"},
    {"http_method": "get", "operation": "product_ids", "ids": [], "path": "product_listings/product_ids.json"},
    {"http_method": "put", "operation": "put", "ids": ["product_id"], "path": "product_listings/<product_id>.json"}
  ];
  protected static PRIMARY_KEY: string = "product_id";

  public static async find(
    {
      session,
      product_id
    }: FindArgs
  ): Promise<ProductListing | null> {
    const result = await ProductListing.baseFind({
      session: session,
      urlIds: {"product_id": product_id},
      params: {},
    });
    return result ? result[0] as ProductListing : null;
  }

  public static async delete(
    {
      session,
      product_id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await ProductListing.request({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"product_id": product_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      product_ids = null,
      limit = null,
      collection_id = null,
      updated_at_min = null,
      handle = null,
      ...otherArgs
    }: AllArgs
  ): Promise<ProductListing[]> {
    const response = await ProductListing.baseFind({
      session: session,
      urlIds: {},
      params: {"product_ids": product_ids, "limit": limit, "collection_id": collection_id, "updated_at_min": updated_at_min, "handle": handle, ...otherArgs},
    });

    return response as ProductListing[];
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await ProductListing.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public static async product_ids(
    {
      session,
      limit = null,
      ...otherArgs
    }: ProductIdsArgs
  ): Promise<unknown> {
    const response = await ProductListing.request({
      http_method: "get",
      operation: "product_ids",
      session: session,
      urlIds: {},
      params: {"limit": limit, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public body_html: string | null;
  public created_at: string | null;
  public handle: string | null;
  public images: Image[] | null | {[key: string]: any};
  public options: {[key: string]: unknown}[] | null;
  public product_id: number | null;
  public product_type: string | null;
  public published_at: string | null;
  public tags: string | null;
  public title: string | null;
  public updated_at: string | null;
  public variants: Variant[] | null | {[key: string]: any};
  public vendor: string | null;
}
