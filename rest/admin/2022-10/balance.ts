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

export class Balance extends Base {
  public static apiVersion = ApiVersion.October22;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shopify_payments/balance.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "balance",
      "plural": "balances"
    }
  ];

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Balance>> {
    const response = await this.baseFind<Balance>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public balance: {[key: string]: unknown}[] | null;
}
