import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Image} from './image';

interface FindArgs {
  session: SessionInterface;
  collection_id: number | string;
}
interface DeleteArgs {
  session: SessionInterface;
  collection_id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  limit?: unknown;
}
interface ProductIdsArgs {
  [key: string]: unknown;
  session: SessionInterface;
  collection_id: number | string;
  limit?: unknown;
}

export class CollectionListing extends Base {
  public static API_VERSION = ApiVersion.July21;

  protected static NAME = 'collection_listing';
  protected static PLURAL_NAME = 'collection_listings';
  protected static HAS_ONE: {[key: string]: typeof Base} = {
    "image": Image
  };
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "collection_listings.json"},
    {"http_method": "get", "operation": "product_ids", "ids": ["collection_id"], "path": "collection_listings/<collection_id>/product_ids.json"},
    {"http_method": "get", "operation": "get", "ids": ["collection_id"], "path": "collection_listings/<collection_id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["collection_id"], "path": "collection_listings/<collection_id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["collection_id"], "path": "collection_listings/<collection_id>.json"}
  ];
  protected static PRIMARY_KEY: string = "collection_id";

  public static async find(
    {
      session,
      collection_id
    }: FindArgs
  ): Promise<CollectionListing | null> {
    const result = await CollectionListing.baseFind({
      session: session,
      urlIds: {"collection_id": collection_id},
      params: {},
    });
    return result ? result[0] as CollectionListing : null;
  }

  public static async delete(
    {
      session,
      collection_id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await CollectionListing.request({
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
  ): Promise<CollectionListing[]> {
    const response = await CollectionListing.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, ...otherArgs},
    });

    return response as CollectionListing[];
  }

  public static async product_ids(
    {
      session,
      collection_id,
      limit = null,
      ...otherArgs
    }: ProductIdsArgs
  ): Promise<unknown> {
    const response = await CollectionListing.request({
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
