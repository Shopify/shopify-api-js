/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {ApiVersion} from '../../base-types';

interface AcceptArgs {
  [key: string]: unknown;
  message?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface RejectArgs {
  [key: string]: unknown;
  message?: unknown;
  reason?: unknown;
  line_items?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class FulfillmentRequest extends Base {
  public static API_VERSION = ApiVersion.April22;

  protected static NAME = 'fulfillment_request';
  protected static PLURAL_NAME = 'fulfillment_requests';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "post", "operation": "accept", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/fulfillment_request/accept.json"},
    {"http_method": "post", "operation": "post", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/fulfillment_request.json"},
    {"http_method": "post", "operation": "reject", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/fulfillment_request/reject.json"}
  ];

  public async accept(
    {
      message = null,
      body = null,
      ...otherArgs
    }: AcceptArgs
  ): Promise<unknown> {
    const response = await FulfillmentRequest.request({
      http_method: "post",
      operation: "accept",
      session: this.session,
      urlIds: {"fulfillment_order_id": this.fulfillment_order_id},
      params: {"message": message, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async reject(
    {
      message = null,
      reason = null,
      line_items = null,
      body = null,
      ...otherArgs
    }: RejectArgs
  ): Promise<unknown> {
    const response = await FulfillmentRequest.request({
      http_method: "post",
      operation: "reject",
      session: this.session,
      urlIds: {"fulfillment_order_id": this.fulfillment_order_id},
      params: {"message": message, "reason": reason, "line_items": line_items, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public fulfillment_order_id: number | null;
}
