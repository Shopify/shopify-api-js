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
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
}

export class Collect extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "collects/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "collects/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "collects.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "collects/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "collects.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "collect",
      "plural": "collects"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Collect | null> {
    const result = await this.baseFind<Collect>({
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
    const response = await this.request<Collect>({
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
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Collect>> {
    const response = await this.baseFind<Collect>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Collect>({
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

  public collection_id: number | null;
  public created_at: string | null;
  public id: number | null;
  public position: number | null;
  public product_id: number | null;
  public sort_value: string | null;
  public updated_at: string | null;
}
