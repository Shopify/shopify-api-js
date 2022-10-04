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
  ids?: unknown;
  limit?: unknown;
  since_id?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  fields?: unknown;
}

export class Report extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'report';
  protected static PLURAL_NAME = 'reports';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "reports/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "reports.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "reports/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "reports.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "reports/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Report | null> {
    const result = await Report.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Report : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Report.request({
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
  ): Promise<Report[]> {
    const response = await Report.baseFind({
      session: session,
      urlIds: {},
      params: {"ids": ids, "limit": limit, "since_id": since_id, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "fields": fields, ...otherArgs},
    });

    return response as Report[];
  }

  public category: string | null;
  public id: number | null;
  public name: string | null;
  public shopify_ql: string | null;
  public updated_at: string | null;
}
