/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Transaction} from './transaction';

interface FindArgs {
  session: Session;
  id: number | string;
  order_id?: number | string | null;
  fields?: unknown;
  in_shop_currency?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  order_id?: number | string | null;
  limit?: unknown;
  fields?: unknown;
  in_shop_currency?: unknown;
}
interface CalculateArgs {
  [key: string]: unknown;
  shipping?: unknown;
  refund_line_items?: unknown;
  currency?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class Refund extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {
    "transactions": Transaction
  };
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["order_id"], "path": "orders/<order_id>/refunds.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id", "id"], "path": "orders/<order_id>/refunds/<id>.json"},
    {"http_method": "post", "operation": "calculate", "ids": ["order_id"], "path": "orders/<order_id>/refunds/calculate.json"},
    {"http_method": "post", "operation": "post", "ids": ["order_id"], "path": "orders/<order_id>/refunds.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "refund",
      "plural": "refunds"
    }
  ];

  public static async find(
    {
      session,
      id,
      order_id = null,
      fields = null,
      in_shop_currency = null
    }: FindArgs
  ): Promise<Refund | null> {
    const result = await this.baseFind<Refund>({
      session: session,
      urlIds: {"id": id, "order_id": order_id},
      params: {"fields": fields, "in_shop_currency": in_shop_currency},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      order_id = null,
      limit = null,
      fields = null,
      in_shop_currency = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Refund>> {
    const response = await this.baseFind<Refund>({
      session: session,
      urlIds: {"order_id": order_id},
      params: {"limit": limit, "fields": fields, "in_shop_currency": in_shop_currency, ...otherArgs},
    });

    return response;
  }

  public async calculate(
    {
      shipping = null,
      refund_line_items = null,
      currency = null,
      body = null,
      ...otherArgs
    }: CalculateArgs
  ): Promise<unknown> {
    const response = await this.request<Refund>({
      http_method: "post",
      operation: "calculate",
      session: this.session,
      urlIds: {"order_id": this.order_id},
      params: {"shipping": shipping, "refund_line_items": refund_line_items, "currency": currency, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public created_at: string | null;
  public duties: {[key: string]: unknown}[] | null;
  public id: number | null;
  public note: string | null;
  public order_adjustments: {[key: string]: unknown}[] | null;
  public order_id: number | null;
  public processed_at: string | null;
  public refund_duties: {[key: string]: unknown}[] | null;
  public refund_line_items: {[key: string]: unknown}[] | null;
  public restock: boolean | null;
  public transactions: Transaction[] | null | {[key: string]: any};
  public user_id: number | null;
}
