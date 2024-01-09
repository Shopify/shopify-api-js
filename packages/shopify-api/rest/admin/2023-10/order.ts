/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Customer} from './customer';
import {DiscountCode} from './discount_code';
import {Fulfillment} from './fulfillment';
import {Refund} from './refund';

interface FindArgs {
  session: Session;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  ids?: unknown;
  limit?: unknown;
  since_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  processed_at_min?: unknown;
  processed_at_max?: unknown;
  attribution_app_id?: unknown;
  status?: unknown;
  financial_status?: unknown;
  fulfillment_status?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  status?: unknown;
  financial_status?: unknown;
  fulfillment_status?: unknown;
}
interface CancelArgs {
  [key: string]: unknown;
  amount?: unknown;
  currency?: unknown;
  restock?: unknown;
  reason?: unknown;
  email?: unknown;
  refund?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface CloseArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface OpenArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class Order extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "customer": Customer
  };
  protected static hasMany: {[key: string]: typeof Base} = {
    "discount_codes": DiscountCode,
    "fulfillments": Fulfillment,
    "refunds": Refund
  };
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "orders/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "orders/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "orders.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "orders/<id>.json"},
    {"http_method": "post", "operation": "cancel", "ids": ["id"], "path": "orders/<id>/cancel.json"},
    {"http_method": "post", "operation": "close", "ids": ["id"], "path": "orders/<id>/close.json"},
    {"http_method": "post", "operation": "open", "ids": ["id"], "path": "orders/<id>/open.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "orders.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "orders/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "order",
      "plural": "orders"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Order | null> {
    const result = await this.baseFind<Order>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<Order>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      ids = null,
      limit = null,
      since_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      processed_at_min = null,
      processed_at_max = null,
      attribution_app_id = null,
      status = null,
      financial_status = null,
      fulfillment_status = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Order>> {
    const response = await this.baseFind<Order>({
      session: session,
      urlIds: {},
      params: {"ids": ids, "limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "processed_at_min": processed_at_min, "processed_at_max": processed_at_max, "attribution_app_id": attribution_app_id, "status": status, "financial_status": financial_status, "fulfillment_status": fulfillment_status, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      status = null,
      financial_status = null,
      fulfillment_status = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Order>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "status": status, "financial_status": financial_status, "fulfillment_status": fulfillment_status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public async cancel(
    {
      amount = null,
      currency = null,
      restock = null,
      reason = null,
      email = null,
      refund = null,
      body = null,
      ...otherArgs
    }: CancelArgs
  ): Promise<unknown> {
    const response = await this.request<Order>({
      http_method: "post",
      operation: "cancel",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"amount": amount, "currency": currency, "restock": restock, "reason": reason, "email": email, "refund": refund, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async close(
    {
      body = null,
      ...otherArgs
    }: CloseArgs
  ): Promise<unknown> {
    const response = await this.request<Order>({
      http_method: "post",
      operation: "close",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
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
    const response = await this.request<Order>({
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

  public line_items: {[key: string]: unknown}[] | null;
  public app_id: number | null;
  public billing_address: {[key: string]: unknown} | null;
  public browser_ip: string | null;
  public buyer_accepts_marketing: boolean | null;
  public cancel_reason: string | null;
  public cancelled_at: string | null;
  public cart_token: string | null;
  public checkout_token: string | null;
  public client_details: {[key: string]: unknown} | null;
  public closed_at: string | null;
  public company: {[key: string]: unknown} | null;
  public confirmation_number: string | null;
  public created_at: string | null;
  public currency: string | null;
  public current_subtotal_price: string | null;
  public current_subtotal_price_set: {[key: string]: unknown} | null;
  public current_total_additional_fees_set: {[key: string]: unknown} | null;
  public current_total_discounts: string | null;
  public current_total_discounts_set: {[key: string]: unknown} | null;
  public current_total_duties_set: {[key: string]: unknown} | null;
  public current_total_price: string | null;
  public current_total_price_set: {[key: string]: unknown} | null;
  public current_total_tax: string | null;
  public current_total_tax_set: {[key: string]: unknown} | null;
  public customer: Customer | null | {[key: string]: any};
  public customer_locale: string | null;
  public discount_applications: {[key: string]: unknown}[] | null;
  public discount_codes: DiscountCode[] | null | {[key: string]: any};
  public email: string | null;
  public estimated_taxes: boolean | null;
  public financial_status: string | null;
  public fulfillment_status: string | null;
  public fulfillments: Fulfillment[] | null | {[key: string]: any};
  public gateway: string | null;
  public id: number | null;
  public landing_site: string | null;
  public location_id: number | null;
  public merchant_of_record_app_id: number | null;
  public name: string | null;
  public note: string | null;
  public note_attributes: {[key: string]: unknown}[] | null;
  public number: number | null;
  public order_number: number | null;
  public order_status_url: string | null;
  public original_total_additional_fees_set: {[key: string]: unknown} | null;
  public original_total_duties_set: {[key: string]: unknown} | null;
  public payment_gateway_names: string[] | null;
  public payment_terms: {[key: string]: unknown} | null;
  public phone: string | null;
  public po_number: string | null;
  public presentment_currency: string | null;
  public processed_at: string | null;
  public referring_site: string | null;
  public refunds: Refund[] | null | {[key: string]: any};
  public shipping_address: {[key: string]: unknown} | null;
  public shipping_lines: {[key: string]: unknown}[] | null;
  public source_identifier: string | null;
  public source_name: string | null;
  public source_url: string | null;
  public subtotal_price: string | null;
  public subtotal_price_set: {[key: string]: unknown} | null;
  public tags: string | null;
  public tax_lines: {[key: string]: unknown}[] | null;
  public taxes_included: boolean | null;
  public test: boolean | null;
  public token: string | null;
  public total_discounts: string | null;
  public total_discounts_set: {[key: string]: unknown} | null;
  public total_line_items_price: string | null;
  public total_line_items_price_set: {[key: string]: unknown} | null;
  public total_outstanding: string | null;
  public total_price: string | null;
  public total_price_set: {[key: string]: unknown} | null;
  public total_shipping_price_set: {[key: string]: unknown} | null;
  public total_tax: string | number | null;
  public total_tax_set: {[key: string]: unknown} | null;
  public total_tip_received: string | null;
  public total_weight: number | null;
  public updated_at: string | null;
  public user_id: number | null;
}
