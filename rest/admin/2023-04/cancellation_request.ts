/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

<<<<<<< HEAD:rest/admin/2023-04/cancellation_request.ts
import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {ApiVersion} from '../../../lib/types';
=======
import Base, {ResourcePath} from '../../base-rest-resource';
import {ApiVersion} from '../../base-types';
>>>>>>> upstream/v5:src/rest-resources/2022-04/cancellation_request.ts

interface AcceptArgs {
  [key: string]: unknown;
  message?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface RejectArgs {
  [key: string]: unknown;
  message?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class CancellationRequest extends Base {
  public static apiVersion = ApiVersion.April23;

  protected static resourceName = 'cancellation_request';
  protected static pluralName = 'cancellation_requests';
  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "post", "operation": "accept", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/cancellation_request/accept.json"},
    {"http_method": "post", "operation": "post", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/cancellation_request.json"},
    {"http_method": "post", "operation": "reject", "ids": ["fulfillment_order_id"], "path": "fulfillment_orders/<fulfillment_order_id>/cancellation_request/reject.json"}
  ];

  public async accept(
    {
      message = null,
      body = null,
      ...otherArgs
    }: AcceptArgs
  ): Promise<unknown> {
    const response = await this.request<CancellationRequest>({
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
      body = null,
      ...otherArgs
    }: RejectArgs
  ): Promise<unknown> {
    const response = await this.request<CancellationRequest>({
      http_method: "post",
      operation: "reject",
      session: this.session,
      urlIds: {"fulfillment_order_id": this.fulfillment_order_id},
      params: {"message": message, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public fulfillment_order_id: number | null;
}
