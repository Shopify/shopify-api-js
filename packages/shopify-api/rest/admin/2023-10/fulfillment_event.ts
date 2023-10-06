/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Country} from './country';
import {Province} from './province';

interface FindArgs {
  session: Session;
  id: number | string;
  order_id?: number | string | null;
  fulfillment_id?: number | string | null;
  event_id?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
  order_id?: number | string | null;
  fulfillment_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  order_id?: number | string | null;
  fulfillment_id?: number | string | null;
}

export class FulfillmentEvent extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "country": Country,
    "province": Province
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["order_id", "fulfillment_id", "id"], "path": "orders/<order_id>/fulfillments/<fulfillment_id>/events/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id", "fulfillment_id"], "path": "orders/<order_id>/fulfillments/<fulfillment_id>/events.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id", "fulfillment_id", "id"], "path": "orders/<order_id>/fulfillments/<fulfillment_id>/events/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["order_id", "fulfillment_id"], "path": "orders/<order_id>/fulfillments/<fulfillment_id>/events.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "fulfillment_event",
      "plural": "fulfillment_events"
    }
  ];

  protected static getJsonBodyName(): string
  {
    return "event";
  }

  public static async find(
    {
      session,
      id,
      order_id = null,
      fulfillment_id = null,
      event_id = null
    }: FindArgs
  ): Promise<FulfillmentEvent | null> {
    const result = await this.baseFind<FulfillmentEvent>({
      session: session,
      urlIds: {"id": id, "order_id": order_id, "fulfillment_id": fulfillment_id},
      params: {"event_id": event_id},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id,
      order_id = null,
      fulfillment_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentEvent>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "order_id": order_id, "fulfillment_id": fulfillment_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      order_id = null,
      fulfillment_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<FulfillmentEvent>> {
    const response = await this.baseFind<FulfillmentEvent>({
      session: session,
      urlIds: {"order_id": order_id, "fulfillment_id": fulfillment_id},
      params: {...otherArgs},
    });

    return response;
  }

  public address1: string | null;
  public city: string | null;
  public country: Country | null | {[key: string]: any};
  public created_at: string | null;
  public estimated_delivery_at: string | null;
  public fulfillment_id: number | null;
  public happened_at: string | null;
  public id: number | null;
  public latitude: number | null;
  public longitude: number | null;
  public message: string | null;
  public order_id: number | null;
  public province: Province | null | {[key: string]: any};
  public shop_id: number | null;
  public status: string | null;
  public updated_at: string | null;
  public zip: string | null;
}
