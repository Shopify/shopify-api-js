/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class AccessScope extends Base {
  public static apiVersion = ApiVersion.April22;

  protected static resourceName = 'access_scope';
  protected static pluralName = 'access_scopes';
  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static customPrefix: string | null = "/admin/oauth";
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "access_scopes.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<AccessScope>> {
    const response = await this.baseFind<AccessScope>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public handle: string | null;
  public access_scopes: {[key: string]: unknown}[] | null;
}
