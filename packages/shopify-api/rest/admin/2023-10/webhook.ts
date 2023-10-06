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
  session: Session;
  address?: unknown;
  topic?: unknown;
}

export class Webhook extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "webhooks/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "webhooks/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "webhooks.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "webhooks/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "webhooks.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "webhooks/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "webhook",
      "plural": "webhooks"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Webhook | null> {
    const result = await this.baseFind<Webhook>({
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
    const response = await this.request<Webhook>({
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
  ): Promise<FindAllResponse<Webhook>> {
    const response = await this.baseFind<Webhook>({
      session: session,
      urlIds: {},
      params: {"address": address, "created_at_max": created_at_max, "created_at_min": created_at_min, "fields": fields, "limit": limit, "since_id": since_id, "topic": topic, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      address = null,
      topic = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Webhook>({
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
