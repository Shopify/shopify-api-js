/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class Currency extends Base {
  public static apiVersion = ApiVersion.July23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "currencies.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "currency",
      "plural": "currencies"
    }
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Currency>> {
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
