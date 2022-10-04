/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class StorefrontAccessToken extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'storefront_access_token';
  protected static PLURAL_NAME = 'storefront_access_tokens';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "storefront_access_tokens/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "storefront_access_tokens.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "storefront_access_tokens.json"}
  ];

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await StorefrontAccessToken.request({
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
  ): Promise<StorefrontAccessToken[]> {
    const response = await StorefrontAccessToken.baseFind({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response as StorefrontAccessToken[];
  }

  public title: string | null;
  public access_scope: string | null;
  public access_token: string | null;
  public created_at: string | null;
  public id: number | null;
}
