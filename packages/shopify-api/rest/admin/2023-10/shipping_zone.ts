/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Country} from './country';
import {Province} from './province';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
  fields?: unknown;
}

export class ShippingZone extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {
    "countries": Country,
    "provinces": Province
  };
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shipping_zones.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "shipping_zone",
      "plural": "shipping_zones"
    }
  ];

  public static async all(
    {
      session,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<ShippingZone>> {
    const response = await this.baseFind<ShippingZone>({
      session: session,
      urlIds: {},
      params: {"fields": fields, ...otherArgs},
    });

    return response;
  }

  public carrier_shipping_rate_providers: unknown | null;
  public countries: Country[] | null | {[key: string]: any};
  public id: number | null;
  public location_group_id: string | null;
  public name: string | null;
  public price_based_shipping_rates: {[key: string]: unknown}[] | null;
  public profile_id: string | null;
  public provinces: Province[] | null | {[key: string]: any};
  public weight_based_shipping_rates: {[key: string]: unknown}[] | null;
}
