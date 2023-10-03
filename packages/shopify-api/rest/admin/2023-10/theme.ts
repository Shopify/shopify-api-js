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
  fields?: unknown;
}

export class Theme extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "themes/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "themes.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "themes/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "themes.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "themes/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "theme",
      "plural": "themes"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Theme | null> {
    const result = await this.baseFind<Theme>({
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
    const response = await this.request<Theme>({
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
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Theme>> {
    const response = await this.baseFind<Theme>({
      session: session,
      urlIds: {},
      params: {"fields": fields, ...otherArgs},
    });

    return response;
  }

  public created_at: string | null;
  public id: number | null;
  public name: string | null;
  public previewable: boolean | null;
  public processing: boolean | null;
  public role: string | null;
  public src: string | null;
  public theme_store_id: number | null;
  public updated_at: string | null;
}
