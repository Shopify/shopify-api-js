/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface DeleteArgs {
  session: Session;
  theme_id?: number | string | null;
  asset?: {[key: string]: unknown} | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  theme_id?: number | string | null;
  fields?: unknown;
  asset?: {[key: string]: unknown} | null;
}

export class Asset extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"},
    {"http_method": "get", "operation": "get", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"},
    {"http_method": "get", "operation": "get", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"},
    {"http_method": "put", "operation": "put", "ids": ["theme_id"], "path": "themes/<theme_id>/assets.json"}
  ];
  protected static primaryKey: string = "key";
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "asset",
      "plural": "assets"
    }
  ];

  public static async delete(
    {
      session,
      theme_id = null,
      asset = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<Asset>({
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
  ): Promise<FindAllResponse<Asset>> {
    const response = await this.baseFind<Asset>({
      session: session,
      urlIds: {"theme_id": theme_id},
      params: {"fields": fields, "asset": asset, ...otherArgs},
    });

    return response;
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
