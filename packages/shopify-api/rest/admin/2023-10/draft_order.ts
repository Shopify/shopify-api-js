/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Customer} from './customer';

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
  fields?: unknown;
  limit?: unknown;
  since_id?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  ids?: unknown;
  status?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  since_id?: unknown;
  status?: unknown;
  updated_at_max?: unknown;
  updated_at_min?: unknown;
}
interface SendInvoiceArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface CompleteArgs {
  [key: string]: unknown;
  payment_gateway_id?: unknown;
  payment_pending?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class DraftOrder extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "customer": Customer
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "draft_orders/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "draft_orders/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "draft_orders.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "draft_orders/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "draft_orders.json"},
    {"http_method": "post", "operation": "send_invoice", "ids": ["id"], "path": "draft_orders/<id>/send_invoice.json"},
    {"http_method": "put", "operation": "complete", "ids": ["id"], "path": "draft_orders/<id>/complete.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "draft_orders/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "draft_order",
      "plural": "draft_orders"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<DraftOrder | null> {
    const result = await this.baseFind<DraftOrder>({
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
    const response = await this.request<DraftOrder>({
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
      fields = null,
      limit = null,
      since_id = null,
      updated_at_min = null,
      updated_at_max = null,
      ids = null,
      status = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<DraftOrder>> {
    const response = await this.baseFind<DraftOrder>({
      session: session,
      urlIds: {},
      params: {"fields": fields, "limit": limit, "since_id": since_id, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "ids": ids, "status": status, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      since_id = null,
      status = null,
      updated_at_max = null,
      updated_at_min = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<DraftOrder>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "status": status, "updated_at_max": updated_at_max, "updated_at_min": updated_at_min, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public async send_invoice(
    {
      body = null,
      ...otherArgs
    }: SendInvoiceArgs
  ): Promise<unknown> {
    const response = await this.request<DraftOrder>({
      http_method: "post",
      operation: "send_invoice",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async complete(
    {
      payment_gateway_id = null,
      payment_pending = null,
      body = null,
      ...otherArgs
    }: CompleteArgs
  ): Promise<unknown> {
    const response = await this.request<DraftOrder>({
      http_method: "put",
      operation: "complete",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"payment_gateway_id": payment_gateway_id, "payment_pending": payment_pending, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public applied_discount: {[key: string]: unknown} | null;
  public billing_address: {[key: string]: unknown} | null;
  public completed_at: string | null;
  public created_at: string | null;
  public currency: string | null;
  public customer: Customer | null | {[key: string]: any};
  public email: string | null;
  public id: number | null;
  public invoice_sent_at: string | null;
  public invoice_url: string | null;
  public line_items: {[key: string]: unknown}[] | null;
  public name: string | null;
  public note: string | null;
  public note_attributes: {[key: string]: unknown}[] | null;
  public order_id: number | null;
  public payment_terms: {[key: string]: unknown} | null;
  public shipping_address: {[key: string]: unknown} | null;
  public shipping_line: {[key: string]: unknown} | null;
  public source_name: string | null;
  public status: string | null;
  public subtotal_price: string | null;
  public tags: string | null;
  public tax_exempt: boolean | null;
  public tax_exemptions: string[] | null;
  public tax_lines: {[key: string]: unknown}[] | null;
  public taxes_included: boolean | null;
  public total_price: string | null;
  public total_tax: string | null;
  public updated_at: string | null;
}
