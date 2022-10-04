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
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class Collect extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'collect';
  protected static PLURAL_NAME = 'collects';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "collects/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "collects/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "collects.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "collects/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "collects.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Collect | null> {
    const result = await Collect.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Collect : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Collect.request({
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
  ): Promise<Collect[]> {
    const response = await Collect.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as Collect[];
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Collect.request({
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
