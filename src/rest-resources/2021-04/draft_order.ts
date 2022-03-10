import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Customer} from './customer';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
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
  session: SessionInterface;
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
  payment_pending?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class DraftOrder extends Base {
  public static API_VERSION = ApiVersion.April21;

  protected static NAME = 'draft_order';
  protected static PLURAL_NAME = 'draft_orders';
  protected static HAS_ONE: {[key: string]: typeof Base} = {
    "customer": Customer
  };
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "post", "operation": "post", "ids": [], "path": "draft_orders.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "draft_orders.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "draft_orders/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "draft_orders/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "draft_orders/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "draft_orders/count.json"},
    {"http_method": "post", "operation": "send_invoice", "ids": ["id"], "path": "draft_orders/<id>/send_invoice.json"},
    {"http_method": "put", "operation": "complete", "ids": ["id"], "path": "draft_orders/<id>/complete.json"}
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<DraftOrder | null> {
    const result = await DraftOrder.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as DraftOrder : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await DraftOrder.request({
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
  ): Promise<DraftOrder[]> {
    const response = await DraftOrder.baseFind({
      session: session,
      urlIds: {},
      params: {"fields": fields, "limit": limit, "since_id": since_id, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "ids": ids, "status": status, ...otherArgs},
    });

    return response as DraftOrder[];
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
    const response = await DraftOrder.request({
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
    const response = await DraftOrder.request({
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
      payment_pending = null,
      body = null,
      ...otherArgs
    }: CompleteArgs
  ): Promise<unknown> {
    const response = await DraftOrder.request({
      http_method: "put",
      operation: "complete",
      session: this.session,
      urlIds: {"id": this.id},
      params: {"payment_pending": payment_pending, ...otherArgs},
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
  public shipping_address: {[key: string]: unknown} | null;
  public shipping_line: {[key: string]: unknown} | null;
  public status: string | null;
  public subtotal_price: number | null;
  public tags: string | null;
  public tax_exempt: boolean | null;
  public tax_exemptions: string[] | null;
  public tax_lines: {[key: string]: unknown}[] | null;
  public taxes_included: boolean | null;
  public total_price: string | null;
  public total_tax: string | null;
  public updated_at: string | null;
}
