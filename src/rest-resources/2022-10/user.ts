/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  limit?: unknown;
  page_info?: unknown;
}
interface CurrentArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class User extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'user';
  protected static PLURAL_NAME = 'users';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "current", "ids": [], "path": "users/current.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "users.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "users/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<User | null> {
    const result = await User.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as User : null;
  }

  public static async all(
    {
      session,
      limit = null,
      page_info = null,
      ...otherArgs
    }: AllArgs
  ): Promise<User[]> {
    const response = await User.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, "page_info": page_info, ...otherArgs},
    });

    return response as User[];
  }

  public static async current(
    {
      session,
      ...otherArgs
    }: CurrentArgs
  ): Promise<unknown> {
    const response = await User.request({
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
