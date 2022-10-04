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
  address?: unknown;
  created_at_max?: unknown;
  created_at_min?: unknown;
  fields?: unknown;
  limit?: unknown;
  since_id?: unknown;
  topic?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  address?: unknown;
  topic?: unknown;
}

export class Webhook extends Base {
  public static API_VERSION = ApiVersion.April22;

  protected static NAME = 'webhook';
  protected static PLURAL_NAME = 'webhooks';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "webhooks/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "webhooks/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "webhooks.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "webhooks/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "webhooks.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "webhooks/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Webhook | null> {
    const result = await Webhook.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Webhook : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Webhook.request({
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
      address = null,
      created_at_max = null,
      created_at_min = null,
      fields = null,
      limit = null,
      since_id = null,
      topic = null,
      updated_at_min = null,
      updated_at_max = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Webhook[]> {
    const response = await Webhook.baseFind({
      session: session,
      urlIds: {},
      params: {"address": address, "created_at_max": created_at_max, "created_at_min": created_at_min, "fields": fields, "limit": limit, "since_id": since_id, "topic": topic, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, ...otherArgs},
    });

    return response as Webhook[];
  }

  public static async count(
    {
      session,
      address = null,
      topic = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Webhook.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"address": address, "topic": topic, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public address: string | null;
  public topic: string | null;
  public api_version: string | null;
  public created_at: string | null;
  public fields: string[] | null;
  public format: string | null;
  public id: number | null;
  public metafield_namespaces: string[] | null;
  public private_metafield_namespaces: string[] | null;
  public updated_at: string | null;
}
