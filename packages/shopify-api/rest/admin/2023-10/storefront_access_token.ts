/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class StorefrontAccessToken extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "storefront_access_tokens/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "storefront_access_tokens.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "storefront_access_tokens.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "storefront_access_token",
      "plural": "storefront_access_tokens"
    }
  ];

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<StorefrontAccessToken>({
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
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<StorefrontAccessToken>> {
    const response = await this.baseFind<StorefrontAccessToken>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public title: string | null;
  public access_scope: string | null;
  public access_token: string | null;
  public created_at: string | null;
  public id: number | null;
}
