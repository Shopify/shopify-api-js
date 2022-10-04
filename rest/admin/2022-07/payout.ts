/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

<<<<<<< HEAD:rest/admin/2022-07/payout.ts
import {Base, FindAllResponse} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';
=======
import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/2022-01/payout.ts

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
  public static apiVersion = ApiVersion.July22;

  protected static resourceName = 'payout';
  protected static pluralName = 'payouts';
  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shopify_payments/payouts.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "shopify_payments/payouts/<id>.json"}
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
