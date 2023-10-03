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
  status?: unknown;
  initiated_at?: unknown;
}

export class Dispute extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shopify_payments/disputes.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "shopify_payments/disputes/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "dispute",
      "plural": "disputes"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<Dispute | null> {
    const result = await this.baseFind<Dispute>({
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
      status = null,
      initiated_at = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Dispute>> {
    const response = await this.baseFind<Dispute>({
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "last_id": last_id, "status": status, "initiated_at": initiated_at, ...otherArgs},
    });

    return response;
  }

  public amount: string | null;
  public currency: string | null;
  public evidence_due_by: string | null;
  public evidence_sent_on: string | null;
  public finalized_on: string | null;
  public id: number | null;
  public network_reason_code: string | null;
  public order_id: number | null;
  public reason: string | null;
  public status: string | null;
  public type: string | null;
}
