/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface DeleteArgs {
  session: SessionInterface;
  theme_id?: number | string | null;
  asset?: {[key: string]: unknown} | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  theme_id?: number | string | null;
  fields?: unknown;
  asset?: {[key: string]: unknown} | null;
}

export class Asset extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'asset';
  protected static PLURAL_NAME = 'assets';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"},
    {"http_method": "get", "operation": "get", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"},
    {"http_method": "get", "operation": "get", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"},
    {"http_method": "put", "operation": "put", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"}
  ];
  protected static PRIMARY_KEY: string = "key";

  public static async delete(
    {
      session,
      theme_id = null,
      asset = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Asset.request({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"theme_id": theme_id},
      params: {"asset": asset},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      theme_id = null,
      fields = null,
      asset = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Asset[]> {
    const response = await Asset.baseFind({
      session: session,
      urlIds: {"theme_id": theme_id},
      params: {"fields": fields, "asset": asset, ...otherArgs},
    });

    return response as Asset[];
  }

  public attachment: string | null;
  public checksum: string | null;
  public content_type: string | null;
  public created_at: string | null;
  public key: string | null;
  public public_url: string | null;
  public size: number | null;
  public theme_id: number | null;
  public updated_at: string | null;
  public value: string | null;
}
