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
  fulfillment_order_id?: number | string | null;
}

export class LocationsForMove extends Base {
  public static apiVersion = ApiVersion.April23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/locations_for_move.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "locations_for_move",
      "plural": "locations_for_moves"
    }
  ];

  public static async all(
    {
      session,
      fulfillment_order_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<LocationsForMove>> {
    const response = await this.baseFind<LocationsForMove>({
      session: session,
      urlIds: {"fulfillment_order_id": fulfillment_order_id},
      params: {...otherArgs},
    });

    return response;
  }

  public locations_for_move: {[key: string]: unknown}[] | null;
}
