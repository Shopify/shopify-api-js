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

export class DeprecatedApiCall extends Base {
  public static apiVersion = ApiVersion.October22;

  protected static resourceName = 'deprecated_api_call';
  protected static pluralName = 'deprecated_api_calls';
  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "deprecated_api_calls.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<DeprecatedApiCall>> {
    const response = await this.baseFind<DeprecatedApiCall>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public data_updated_at: string | null;
  public deprecated_api_calls: {[key: string]: unknown}[] | null;
}
