/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  limit?: unknown;
  since_id?: unknown;
  processed_at_min?: unknown;
  processed_at_max?: unknown;
  processed_at?: unknown;
  order?: unknown;
}

export class TenderTransaction extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'tender_transaction';
  protected static PLURAL_NAME = 'tender_transactions';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "tender_transactions.json"}
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
  ): Promise<TenderTransaction[]> {
    const response = await TenderTransaction.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "processed_at_min": processed_at_min, "processed_at_max": processed_at_max, "processed_at": processed_at, "order": order, ...otherArgs},
    });

    return response as TenderTransaction[];
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
