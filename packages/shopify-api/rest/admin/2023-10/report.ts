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
  ids?: unknown;
  limit?: unknown;
  since_id?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  fields?: unknown;
}

export class Report extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "reports/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "reports.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "reports/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "reports.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "reports/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "report",
      "plural": "reports"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Report | null> {
    const result = await this.baseFind<Report>({
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
    const response = await this.request<Report>({
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
      ids = null,
      limit = null,
      since_id = null,
      updated_at_min = null,
      updated_at_max = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Report>> {
    const response = await this.baseFind<Report>({
      session: session,
      urlIds: {},
      params: {"ids": ids, "limit": limit, "since_id": since_id, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public category: string | null;
  public id: number | null;
  public name: string | null;
  public shopify_ql: string | null;
  public updated_at: string | null;
}
