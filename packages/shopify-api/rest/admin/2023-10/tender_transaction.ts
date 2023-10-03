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
  limit?: unknown;
  since_id?: unknown;
  processed_at_min?: unknown;
  processed_at_max?: unknown;
  processed_at?: unknown;
  order?: unknown;
}

export class TenderTransaction extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "tender_transactions.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "tender_transaction",
      "plural": "tender_transactions"
    }
  ];

  public static async all(
    {
      session,
      limit = null,
      since_id = null,
      processed_at_min = null,
      processed_at_max = null,
      processed_at = null,
      order = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<TenderTransaction>> {
    const response = await this.baseFind<TenderTransaction>({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "processed_at_min": processed_at_min, "processed_at_max": processed_at_max, "processed_at": processed_at, "order": order, ...otherArgs},
    });

    return response;
  }

  public amount: string | null;
  public currency: string | null;
  public id: number | null;
  public order_id: number | null;
  public payment_details: {[key: string]: unknown} | null;
  public payment_method: string | null;
  public processed_at: string | null;
  public remote_reference: string | null;
  public test: boolean | null;
  public user_id: number | null;
}
