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
  handle?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
}

export class Blog extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {
    "metafields": Metafield
  };
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "blogs/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "blogs/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "blogs.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "blogs/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "blogs.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "blogs/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "blog",
      "plural": "blogs"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Blog | null> {
    const result = await this.baseFind<Blog>({
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
    const response = await this.request<Blog>({
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
      handle = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Blog>> {
    const response = await this.baseFind<Blog>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "handle": handle, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Blog>({
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

  public admin_graphql_api_id: string | null;
  public commentable: string | null;
  public created_at: string | null;
  public feedburner: string | null;
  public feedburner_location: string | null;
  public handle: string | null;
  public id: number | null;
  public metafields: Metafield[] | null | {[key: string]: any};
  public tags: string | null;
  public template_suffix: string | null;
  public title: string | null;
  public updated_at: string | null;
}
