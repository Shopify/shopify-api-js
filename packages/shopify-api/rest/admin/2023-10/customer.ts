/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {Metafield} from './metafield';

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
  since_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  limit?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
}
interface OrdersArgs {
  [key: string]: unknown;
  session: Session;
  id: number | string;
  status?: unknown;
}
interface SearchArgs {
  [key: string]: unknown;
  session: Session;
  order?: unknown;
  query?: unknown;
  limit?: unknown;
  fields?: unknown;
}
interface AccountActivationUrlArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface SendInviteArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class Customer extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "metafield": Metafield
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "customers/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "customers/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "customers.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "customers/<id>.json"},
    {"http_method": "get", "operation": "orders", "ids": ["id"], "path": "customers/<id>/orders.json"},
    {"http_method": "get", "operation": "search", "ids": [], "path": "customers/search.json"},
    {"http_method": "post", "operation": "account_activation_url", "ids": ["id"], "path": "customers/<id>/account_activation_url.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "customers.json"},
    {"http_method": "post", "operation": "send_invite", "ids": ["id"], "path": "customers/<id>/send_invite.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "customers/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "customer",
      "plural": "customers"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Customer | null> {
    const result = await this.baseFind<Customer>({
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
    const response = await this.request<Customer>({
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
      since_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      limit = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Customer>> {
    const response = await this.baseFind<Customer>({
      session: session,
      urlIds: {},
      params: {"ids": ids, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "limit": limit, "fields": fields, ...otherArgs},
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
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Customer>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {"created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public static async orders(
    {
      session,
      id,
      status = null,
      ...otherArgs
    }: OrdersArgs
  ): Promise<unknown> {
    const response = await this.request<Customer>({
      http_method: "get",
      operation: "orders",
      session: session,
      urlIds: {"id": id},
      params: {"status": status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public static async search(
    {
      session,
      order = null,
      query = null,
      limit = null,
      fields = null,
      ...otherArgs
    }: SearchArgs
  ): Promise<unknown> {
    const response = await this.request<Customer>({
      http_method: "get",
      operation: "search",
      session: session,
      urlIds: {},
      params: {"order": order, "query": query, "limit": limit, "fields": fields, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public async account_activation_url(
    {
      body = null,
      ...otherArgs
    }: AccountActivationUrlArgs
  ): Promise<unknown> {
    const response = await this.request<Customer>({
      http_method: "post",
      operation: "account_activation_url",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async send_invite(
    {
      body = null,
      ...otherArgs
    }: SendInviteArgs
  ): Promise<unknown> {
    const response = await this.request<Customer>({
      http_method: "post",
      operation: "send_invite",
      session: this.session,
      urlIds: {"id": this.id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public accepts_marketing: boolean | null;
  public accepts_marketing_updated_at: string | null;
  public addresses: {[key: string]: unknown}[] | null;
  public created_at: string | null;
  public currency: string | null;
  public default_address: {[key: string]: unknown} | null;
  public email: string | null;
  public email_marketing_consent: {[key: string]: unknown} | null;
  public first_name: string | null;
  public id: number | null;
  public last_name: string | null;
  public last_order_id: number | null;
  public last_order_name: string | null;
  public marketing_opt_in_level: string | null;
  public metafield: Metafield | null | {[key: string]: any};
  public multipass_identifier: string | null;
  public note: string | null;
  public orders_count: number | null;
  public password: string | null;
  public password_confirmation: string | null;
  public phone: string | null;
  public sms_marketing_consent: {[key: string]: unknown} | null;
  public state: string | null;
  public tags: string | null;
  public tax_exempt: boolean | null;
  public tax_exemptions: string[] | null;
  public total_spent: string | null;
  public updated_at: string | null;
  public verified_email: boolean | null;
}
