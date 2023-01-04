/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class AccessScope extends Base {
  public static API_VERSION = ApiVersion.January23;

  protected static NAME = 'access_scope';
  protected static PLURAL_NAME = 'access_scopes';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static CUSTOM_PREFIX: string | null = "/admin/oauth";
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "access_scopes.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<AccessScope[]> {
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
