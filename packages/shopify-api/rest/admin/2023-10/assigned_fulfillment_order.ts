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
  assignment_status?: unknown;
  location_ids?: unknown[] | number | string | null;
}

export class AssignedFulfillmentOrder extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "assigned_fulfillment_orders.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "fulfillment_order",
      "plural": "fulfillment_orders"
    }
  ];

  public static async all(
    {
      session,
      assignment_status = null,
      location_ids = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<AssignedFulfillmentOrder>> {
    const response = await this.baseFind<AssignedFulfillmentOrder>({
      session: session,
      urlIds: {},
      params: {"assignment_status": assignment_status, "location_ids": location_ids, ...otherArgs},
    });

    return response;
  }

  public assigned_location_id: number | null;
  public destination: {[key: string]: unknown} | null;
  public id: number | null;
  public line_items: {[key: string]: unknown}[] | null;
  public order_id: number | null;
  public request_status: string | null;
  public shop_id: number | null;
  public status: string | null;
}
