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
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  order_id?: number | string | null;
  product_id?: number | string | null;
  limit?: unknown;
  since_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  filter?: unknown;
  verb?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  created_at_min?: unknown;
  created_at_max?: unknown;
}

export class Event extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": [], "path": "events/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "events.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "events/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id"], "path": "orders/<order_id>/events.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "products/<product_id>/events.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "event",
      "plural": "events"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Event | null> {
    const result = await this.baseFind<Event>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      order_id = null,
      product_id = null,
      limit = null,
      since_id = null,
      created_at_min = null,
      created_at_max = null,
      filter = null,
      verb = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Event>> {
    const response = await this.baseFind<Event>({
      session: session,
      urlIds: {"order_id": order_id, "product_id": product_id},
      params: {"limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "filter": filter, "verb": verb, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      created_at_min = null,
      created_at_max = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Event>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"created_at_min": created_at_min, "created_at_max": created_at_max, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public arguments: string[] | null;
  public body: string | null;
  public created_at: string | null;
  public description: string | null;
  public id: number | null;
  public message: string | null;
  public path: string | null;
  public subject_id: number | null;
  public subject_type: string | null;
  public verb: string | null;
}
