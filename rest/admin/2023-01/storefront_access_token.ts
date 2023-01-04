/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
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
  public static API_VERSION = ApiVersion.January23;

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
  ): Promise<StorefrontAccessToken[]> {
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
