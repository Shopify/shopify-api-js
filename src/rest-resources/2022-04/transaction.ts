/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  order_id?: number | string | null;
  fields?: unknown;
  in_shop_currency?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  order_id?: number | string | null;
  since_id?: unknown;
  fields?: unknown;
  in_shop_currency?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  order_id?: number | string | null;
}

export class Transaction extends Base {
  public static API_VERSION = ApiVersion.April22;

  protected static NAME = 'transaction';
  protected static PLURAL_NAME = 'transactions';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": ["order_id"], "path": "orders/<order_id>/transactions/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id"], "path": "orders/<order_id>/transactions.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id", "id"], "path": "orders/<order_id>/transactions/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["order_id"], "path": "orders/<order_id>/transactions.json"}
  ];

  public static async find(
    {
      session,
      id,
      order_id = null,
      fields = null,
      in_shop_currency = null
    }: FindArgs
  ): Promise<Transaction | null> {
    const result = await Transaction.baseFind({
      session: session,
      urlIds: {"id": id, "order_id": order_id},
      params: {"fields": fields, "in_shop_currency": in_shop_currency},
    });
    return result ? result[0] as Transaction : null;
  }

  public static async all(
    {
      session,
      order_id = null,
      since_id = null,
      fields = null,
      in_shop_currency = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Transaction[]> {
    const response = await Transaction.baseFind({
      session: session,
      urlIds: {"order_id": order_id},
      params: {"since_id": since_id, "fields": fields, "in_shop_currency": in_shop_currency, ...otherArgs},
    });

    return response as Transaction[];
  }

  public static async count(
    {
      session,
      order_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Transaction.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {"order_id": order_id},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public kind: string | null;
  public amount: string | null;
  public authorization: string | null;
  public authorization_expires_at: string | null;
  public created_at: string | null;
  public currency: string | null;
  public currency_exchange_adjustment: {[key: string]: unknown} | null;
  public device_id: number | null;
  public error_code: string | null;
  public extended_authorization_attributes: {[key: string]: unknown} | null;
  public gateway: string | null;
  public id: number | null;
  public location_id: number | null;
  public message: string | null;
  public order_id: number | null;
  public parent_id: number | null;
  public payment_details: {[key: string]: unknown} | null;
  public payments_refund_attributes: {[key: string]: unknown} | null;
  public processed_at: string | null;
  public receipt: {[key: string]: unknown} | null;
  public source_name: string | null;
  public status: string | null;
  public test: boolean | null;
  public user_id: number | null;
}
