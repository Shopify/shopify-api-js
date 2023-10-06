/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Metafield} from './metafield';

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
  since_id?: unknown;
  title?: unknown;
  handle?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  fields?: unknown;
  published_status?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  title?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  published_at_min?: unknown;
  published_at_max?: unknown;
  published_status?: unknown;
}

export class Page extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "metafield": Metafield
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "pages/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "pages/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "pages.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "pages/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "pages.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "pages/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "page",
      "plural": "pages"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Page | null> {
    const result = await this.baseFind<Page>({
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
    const response = await this.request<Page>({
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
      since_id = null,
      title = null,
      handle = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      published_at_min = null,
      published_at_max = null,
      fields = null,
      published_status = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Page>> {
    const response = await this.baseFind<Page>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "title": title, "handle": handle, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "fields": fields, "published_status": published_status, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      title = null,
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
    const response = await this.request<Page>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"title": title, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "published_at_min": published_at_min, "published_at_max": published_at_max, "published_status": published_status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public admin_graphql_api_id: string | null;
  public author: string | null;
  public body_html: string | null;
  public created_at: string | null;
  public handle: string | null;
  public id: number | null;
  public metafield: Metafield | null | {[key: string]: any};
  public published_at: string | null;
  public shop_id: number | null;
  public template_suffix: string | null;
  public title: string | null;
  public updated_at: string | null;
}
