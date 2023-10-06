/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Image} from './image';
import {Variant} from './variant';

interface FindArgs {
  session: Session;
  product_id: number | string;
}
interface DeleteArgs {
  session: Session;
  product_id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  product_ids?: unknown;
  limit?: unknown;
  collection_id?: unknown;
  updated_at_min?: unknown;
  handle?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
}
interface ProductIdsArgs {
  [key: string]: unknown;
  session: Session;
  limit?: unknown;
}

export class ProductListing extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {
    "images": Image,
    "variants": Variant
  };
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["product_id"], "path": "product_listings/<product_id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "product_listings/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "product_listings.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "product_listings/<product_id>.json"},
    {"http_method": "get", "operation": "product_ids", "ids": [], "path": "product_listings/product_ids.json"},
    {"http_method": "put", "operation": "put", "ids": ["product_id"], "path": "product_listings/<product_id>.json"}
  ];
  protected static primaryKey: string = "product_id";
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "product_listing",
      "plural": "product_listings"
    }
  ];

  public static async find(
    {
      session,
      product_id
    }: FindArgs
  ): Promise<ProductListing | null> {
    const result = await this.baseFind<ProductListing>({
      session: session,
      urlIds: {"product_id": product_id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      product_id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<ProductListing>({
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
  ): Promise<FindAllResponse<ProductListing>> {
    const response = await this.baseFind<ProductListing>({
      session: session,
      urlIds: {},
      params: {"product_ids": product_ids, "limit": limit, "collection_id": collection_id, "updated_at_min": updated_at_min, "handle": handle, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<ProductListing>({
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
    const response = await this.request<ProductListing>({
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
