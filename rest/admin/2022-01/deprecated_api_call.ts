/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/base-types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class DeprecatedApiCall extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'deprecated_api_call';
  protected static PLURAL_NAME = 'deprecated_api_calls';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "deprecated_api_calls.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<DeprecatedApiCall[]> {
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
