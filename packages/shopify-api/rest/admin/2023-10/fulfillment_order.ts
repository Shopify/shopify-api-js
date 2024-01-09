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
  order_id?: number | string | null;
}
interface CancelArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface CloseArgs {
  [key: string]: unknown;
  message?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface HoldArgs {
  [key: string]: unknown;
  fulfillment_hold?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface MoveArgs {
  [key: string]: unknown;
  fulfillment_order?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface OpenArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface ReleaseHoldArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface RescheduleArgs {
  [key: string]: unknown;
  new_fulfill_at?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface SetFulfillmentOrdersDeadlineArgs {
  [key: string]: unknown;
  fulfillment_order_ids?: unknown;
  fulfillment_deadline?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class FulfillmentOrder extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "fulfillment_orders/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id"], "path": "orders/<order_id>/fulfillment_orders.json"},
    {"http_method": "post", "operation": "cancel", "ids": ["id"], "path": "fulfillment_orders/<id>/cancel.json"},
    {"http_method": "post", "operation": "close", "ids": ["id"], "path": "fulfillment_orders/<id>/close.json"},
    {"http_method": "post", "operation": "hold", "ids": ["id"], "path": "fulfillment_orders/<id>/hold.json"},
    {"http_method": "post", "operation": "move", "ids": ["id"], "path": "fulfillment_orders/<id>/move.json"},
    {"http_method": "post", "operation": "open", "ids": ["id"], "path": "fulfillment_orders/<id>/open.json"},
    {"http_method": "post", "operation": "release_hold", "ids": ["id"], "path": "fulfillment_orders/<id>/release_hold.json"},
    {"http_method": "post", "operation": "reschedule", "ids": ["id"], "path": "fulfillment_orders/<id>/reschedule.json"},
    {"http_method": "post", "operation": "set_fulfillment_orders_deadline", "ids": [], "path": "fulfillment_orders/set_fulfillment_orders_deadline.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "fulfillment_order",
      "plural": "fulfillment_orders"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<FulfillmentOrder | null> {
    const result = await this.baseFind<FulfillmentOrder>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      order_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<FulfillmentOrder>> {
    const response = await this.baseFind<FulfillmentOrder>({
      session: session,
      urlIds: {"order_id": order_id},
      params: {...otherArgs},
    });

    return response;
  }

  public async cancel(
    {
      body = null,
      ...otherArgs
    }: CancelArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "cancel",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async close(
    {
      message = null,
      body = null,
      ...otherArgs
    }: CloseArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "close",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"message": message, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async hold(
    {
      fulfillment_hold = null,
      body = null,
      ...otherArgs
    }: HoldArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "hold",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"fulfillment_hold": fulfillment_hold, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async move(
    {
      fulfillment_order = null,
      body = null,
      ...otherArgs
    }: MoveArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "move",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"fulfillment_order": fulfillment_order, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async open(
    {
      body = null,
      ...otherArgs
    }: OpenArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "open",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async release_hold(
    {
      body = null,
      ...otherArgs
    }: ReleaseHoldArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "release_hold",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async reschedule(
    {
      new_fulfill_at = null,
      body = null,
      ...otherArgs
    }: RescheduleArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "reschedule",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"new_fulfill_at": new_fulfill_at, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async set_fulfillment_orders_deadline(
    {
      fulfillment_order_ids = null,
      fulfillment_deadline = null,
      body = null,
      ...otherArgs
    }: SetFulfillmentOrdersDeadlineArgs
  ): Promise<unknown> {
    const response = await this.request<FulfillmentOrder>({
      http_method: "post",
      operation: "set_fulfillment_orders_deadline",
      session: this.session,
      urlIds: {},
      params: {"fulfillment_order_ids": fulfillment_order_ids, "fulfillment_deadline": fulfillment_deadline, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public assigned_location: {[key: string]: unknown} | null;
  public assigned_location_id: number | null;
  public created_at: string | null;
  public delivery_method: {[key: string]: unknown} | null;
  public destination: {[key: string]: unknown} | null;
  public fulfill_at: string | null;
  public fulfill_by: string | null;
  public fulfillment_holds: {[key: string]: unknown}[] | null;
  public id: number | null;
  public international_duties: {[key: string]: unknown} | null;
  public line_items: {[key: string]: unknown}[] | null;
  public merchant_requests: {[key: string]: unknown}[] | null;
  public order_id: number | null;
  public request_status: string | null;
  public shop_id: number | null;
  public status: string | null;
  public supported_actions: string[] | null;
  public updated_at: string | null;
}
