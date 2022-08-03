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
  reason?: unknown;
  reason_notes?: unknown;
  notify_merchant?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface MoveArgs {
  [key: string]: unknown;
  new_location_id?: unknown;
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
  body?: {[key: string]: unknown} | null;
}
interface SetFulfillmentOrdersDeadlineArgs {
  [key: string]: unknown;
  fulfillment_order_ids?: unknown;
  fulfillment_deadline?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class FulfillmentOrder extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'fulfillment_order';
  protected static PLURAL_NAME = 'fulfillment_orders';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
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

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<FulfillmentOrder | null> {
    const result = await FulfillmentOrder.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as FulfillmentOrder : null;
  }

  public static async all(
    {
      session,
      order_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FulfillmentOrder[]> {
    const response = await FulfillmentOrder.baseFind({
      session: session,
      urlIds: {"order_id": order_id},
      params: {...otherArgs},
    });

    return response as FulfillmentOrder[];
  }

  public async cancel(
    {
      body = null,
      ...otherArgs
    }: CancelArgs
  ): Promise<unknown> {
    const response = await FulfillmentOrder.request({
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
    const response = await FulfillmentOrder.request({
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
      reason = null,
      reason_notes = null,
      notify_merchant = null,
      body = null,
      ...otherArgs
    }: HoldArgs
  ): Promise<unknown> {
    const response = await FulfillmentOrder.request({
      http_method: "post",
      operation: "hold",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"reason": reason, "reason_notes": reason_notes, "notify_merchant": notify_merchant, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async move(
    {
      new_location_id = null,
      body = null,
      ...otherArgs
    }: MoveArgs
  ): Promise<unknown> {
    const response = await FulfillmentOrder.request({
      http_method: "post",
      operation: "move",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"new_location_id": new_location_id, ...otherArgs},
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
    const response = await FulfillmentOrder.request({
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
    const response = await FulfillmentOrder.request({
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
      body = null,
      ...otherArgs
    }: RescheduleArgs
  ): Promise<unknown> {
    const response = await FulfillmentOrder.request({
      http_method: "post",
      operation: "reschedule",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
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
    const response = await FulfillmentOrder.request({
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
}
