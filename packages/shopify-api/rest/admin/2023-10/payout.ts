/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface FindArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  since_id?: unknown;
  last_id?: unknown;
  date_min?: unknown;
  date_max?: unknown;
  date?: unknown;
  status?: unknown;
}

export class Payout extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shopify_payments/payouts.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "shopify_payments/payouts/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "payout",
      "plural": "payouts"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<Payout | null> {
    const result = await this.baseFind<Payout>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      since_id = null,
      last_id = null,
      date_min = null,
      date_max = null,
      date = null,
      status = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Payout>> {
    const response = await this.baseFind<Payout>({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "last_id": last_id, "date_min": date_min, "date_max": date_max, "date": date, "status": status, ...otherArgs},
    });

    return response;
  }

  public amount: string | null;
  public currency: string | null;
  public date: string | null;
  public id: number | null;
  public status: string | null;
}
