/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

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
  limit?: unknown;
  ids?: unknown;
  since_id?: unknown;
  title?: unknown;
  product_id?: unknown;
  handle?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  title?: unknown;
  product_id?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
}

export class CustomCollection extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'custom_collection';
  protected static PLURAL_NAME = 'custom_collections';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "custom_collections/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "custom_collections/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "custom_collections.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "custom_collections/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "custom_collections.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "custom_collections/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<CustomCollection | null> {
    const result = await CustomCollection.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as CustomCollection : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await CustomCollection.request({
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
      limit = null,
      ids = null,
      since_id = null,
      title = null,
      product_id = null,
      handle = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      published_status = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<CustomCollection[]> {
    const response = await CustomCollection.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, "ids": ids, "since_id": since_id, "title": title, "product_id": product_id, "handle": handle, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, "fields": fields, ...otherArgs},
    });

    return response as CustomCollection[];
  }

  public static async count(
    {
      session,
      title = null,
      product_id = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      published_status = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await CustomCollection.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"title": title, "product_id": product_id, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public title: string | null;
  public body_html: string | null;
  public handle: string | null;
  public id: number | null;
  public image: string | {[key: string]: unknown} | null;
  public published: boolean | null;
  public published_at: string | null;
  public published_scope: string | null;
  public sort_order: string | null;
  public template_suffix: string | null;
  public updated_at: string | null;
}
