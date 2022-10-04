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
  fields?: unknown;
}

export class Theme extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'theme';
  protected static PLURAL_NAME = 'themes';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "themes/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "themes.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "themes/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "themes.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "themes/<id>.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Theme | null> {
    const result = await Theme.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Theme : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Theme.request({
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
  ): Promise<Theme[]> {
    const response = await Theme.baseFind({
      session: session,
      urlIds: {},
      params: {"fields": fields, ...otherArgs},
    });

    return response as Theme[];
  }

  public created_at: string | null;
  public id: number | null;
  public name: string | null;
  public previewable: boolean | null;
  public processing: boolean | null;
  public role: string | null;
  public theme_store_id: number | null;
  public updated_at: string | null;
}
