/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {SessionInterface} from '../../../lib/session/types';
import {ApiVersion} from '../../../lib/base-types';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class Currency extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'currency';
  protected static PLURAL_NAME = 'currencies';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "currencies.json"}
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<Currency[]> {
    const response = await this.baseFind<Currency>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public currency: string | null;
  public rate_updated_at: string | null;
}
