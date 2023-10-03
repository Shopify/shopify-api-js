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
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  limit?: unknown;
  page_info?: unknown;
}
interface CurrentArgs {
  [key: string]: unknown;
  session: Session;
}

export class User extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "current", "ids": [], "path": "users/current.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "users.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "users/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "user",
      "plural": "users"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<User | null> {
    const result = await this.baseFind<User>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      limit = null,
      page_info = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<User>> {
    const response = await this.baseFind<User>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "page_info": page_info, ...otherArgs},
    });

    return response;
  }

  public static async current(
    {
      session,
      ...otherArgs
    }: CurrentArgs
  ): Promise<unknown> {
    const response = await this.request<User>({
      http_method: "get",
      operation: "current",
      session: session,
      urlIds: {},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public account_owner: boolean | null;
  public bio: string | null;
  public email: string | null;
  public first_name: string | null;
  public id: number | null;
  public im: string | null;
  public last_name: string | null;
  public locale: string | null;
  public permissions: string[] | null;
  public phone: string | null;
  public receive_announcements: number | null;
  public screen_name: string | null;
  public url: string | null;
  public user_type: string | null;
}
