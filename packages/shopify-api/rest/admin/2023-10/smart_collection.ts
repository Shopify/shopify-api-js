/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface FindArgs {
  session: Session;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
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
  session: Session;
  title?: unknown;
  product_id?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
}
interface OrderArgs {
  [key: string]: unknown;
  products?: unknown;
  sort_order?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class SmartCollection extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "smart_collections/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "smart_collections/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "smart_collections.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "smart_collections/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "smart_collections.json"},
    {"http_method": "put", "operation": "order", "ids": ["id"], "path": "smart_collections/<id>/order.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "smart_collections/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "smart_collection",
      "plural": "smart_collections"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<SmartCollection | null> {
    const result = await this.baseFind<SmartCollection>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<SmartCollection>({
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
  ): Promise<FindAllResponse<SmartCollection>> {
    const response = await this.baseFind<SmartCollection>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "ids": ids, "since_id": since_id, "title": title, "product_id": product_id, "handle": handle, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, "fields": fields, ...otherArgs},
    });

    return response;
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
    const response = await this.request<SmartCollection>({
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

  public async order(
    {
      products = null,
      sort_order = null,
      body = null,
      ...otherArgs
    }: OrderArgs
  ): Promise<unknown> {
    const response = await this.request<SmartCollection>({
      http_method: "put",
      operation: "order",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"products": products, "sort_order": sort_order, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public rules: {[key: string]: unknown} | {[key: string]: unknown}[] | null;
  public title: string | null;
  public body_html: string | null;
  public disjunctive: boolean | null;
  public handle: string | null;
  public id: number | null;
  public image: string | {[key: string]: unknown} | null;
  public published_at: string | null;
  public published_scope: string | null;
  public sort_order: string | null;
  public template_suffix: string | null;
  public updated_at: string | null;
}
