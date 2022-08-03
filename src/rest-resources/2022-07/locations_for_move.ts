/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  fulfillment_order_id?: number | string | null;
}

export class LocationsForMove extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'locations_for_move';
  protected static PLURAL_NAME = 'locations_for_moves';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/locations_for_move.json"}
  ];

  public static async all(
    {
      session,
      fulfillment_order_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<LocationsForMove[]> {
    const response = await LocationsForMove.baseFind({
      session: session,
      urlIds: {"fulfillment_order_id": fulfillment_order_id},
      params: {...otherArgs},
    });

    return response as LocationsForMove[];
  }

  public locations_for_move: {[key: string]: unknown}[] | null;
}
