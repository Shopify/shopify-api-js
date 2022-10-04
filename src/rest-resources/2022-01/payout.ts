/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  since_id?: unknown;
  last_id?: unknown;
  date_min?: unknown;
  date_max?: unknown;
  date?: unknown;
  status?: unknown;
}

export class Payout extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'payout';
  protected static PLURAL_NAME = 'payouts';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shopify_payments/payouts.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "shopify_payments/payouts/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<Payout | null> {
    const result = await Payout.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as Payout : null;
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
  ): Promise<Payout[]> {
    const response = await Payout.baseFind({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "last_id": last_id, "date_min": date_min, "date_max": date_max, "date": date, "status": status, ...otherArgs},
    });

    return response as Payout[];
  }

  public amount: string | null;
  public currency: string | null;
  public date: string | null;
  public id: number | null;
  public status: string | null;
}
