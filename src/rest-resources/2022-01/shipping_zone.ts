/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Country} from './country';
import {Province} from './province';

interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  fields?: unknown;
}

export class ShippingZone extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'shipping_zone';
  protected static PLURAL_NAME = 'shipping_zones';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {
    "countries": Country,
    "provinces": Province
  };
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shipping_zones.json"}
  ];

  public static async all(
    {
      session,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<ShippingZone[]> {
    const response = await ShippingZone.baseFind({
      session: session,
      urlIds: {},
      params: {"fields": fields, ...otherArgs},
    });

    return response as ShippingZone[];
  }

  public carrier_shipping_rate_providers: unknown | null;
  public countries: Country[] | null | {[key: string]: any};
  public id: number | null;
  public location_group_id: number | null;
  public name: string | null;
  public price_based_shipping_rates: {[key: string]: unknown} | null;
  public profile_id: number | null;
  public provinces: Province[] | null | {[key: string]: any};
  public weight_based_shipping_rates: {[key: string]: unknown} | null;
}
