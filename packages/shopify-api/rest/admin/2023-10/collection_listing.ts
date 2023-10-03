/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Image} from './image';

interface FindArgs {
  session: Session;
  collection_id: number | string;
}
interface DeleteArgs {
  session: Session;
  collection_id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  limit?: unknown;
}
interface ProductIdsArgs {
  [key: string]: unknown;
  session: Session;
  collection_id: number | string;
  limit?: unknown;
}

export class CollectionListing extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "image": Image
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["collection_id"], "path": "collection_listings/<collection_id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "collection_listings.json"},
    {"http_method": "get", "operation": "get", "ids": ["collection_id"], "path": "collection_listings/<collection_id>.json"},
    {"http_method": "get", "operation": "product_ids", "ids": ["collection_id"], "path": "collection_listings/<collection_id>/product_ids.json"},
    {"http_method": "put", "operation": "put", "ids": ["collection_id"], "path": "collection_listings/<collection_id>.json"}
  ];
  protected static primaryKey: string = "collection_id";
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "collection_listing",
      "plural": "collection_listings"
    }
  ];

  public static async find(
    {
      session,
      collection_id
    }: FindArgs
  ): Promise<CollectionListing | null> {
    const result = await this.baseFind<CollectionListing>({
      session: session,
      urlIds: {"collection_id": collection_id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      collection_id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<CollectionListing>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"collection_id": collection_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      limit = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<CollectionListing>> {
    const response = await this.baseFind<CollectionListing>({
      session: session,
      urlIds: {},
      params: {"limit": limit, ...otherArgs},
    });

    return response;
  }

  public static async product_ids(
    {
      session,
      collection_id,
      limit = null,
      ...otherArgs
    }: ProductIdsArgs
  ): Promise<unknown> {
    const response = await this.request<CollectionListing>({
      http_method: "get",
      operation: "product_ids",
      session: session,
      urlIds: {"collection_id": collection_id},
      params: {"limit": limit, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public body_html: string | null;
  public collection_id: number | null;
  public default_product_image: {[key: string]: unknown}[] | null;
  public handle: string | null;
  public image: Image | null | {[key: string]: any};
  public published_at: string | null;
  public sort_order: string | null;
  public title: string | null;
  public updated_at: string | null;
}
