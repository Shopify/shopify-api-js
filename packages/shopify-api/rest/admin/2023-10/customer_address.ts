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
  customer_id?: number | string | null;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
  customer_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  customer_id?: number | string | null;
}
interface DefaultArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}
interface SetArgs {
  [key: string]: unknown;
  address_ids?: unknown[] | number | string | null;
  operation?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class CustomerAddress extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["customer_id", "id"], "path": "customers/<customer_id>/addresses/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["customer_id"], "path": "customers/<customer_id>/addresses.json"},
    {"http_method": "get", "operation": "get", "ids": ["customer_id", "id"], "path": "customers/<customer_id>/addresses/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["customer_id"], "path": "customers/<customer_id>/addresses.json"},
    {"http_method": "put", "operation": "default", "ids": ["customer_id", "id"], "path": "customers/<customer_id>/addresses/<id>/default.json"},
    {"http_method": "put", "operation": "put", "ids": ["customer_id", "id"], "path": "customers/<customer_id>/addresses/<id>.json"},
    {"http_method": "put", "operation": "set", "ids": ["customer_id"], "path": "customers/<customer_id>/addresses/set.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "customer_address",
      "plural": "customer_addresses"
    },
    {
      "singular": "address",
      "plural": "addresses"
    }
  ];

  protected static getJsonBodyName(): string
  {
    return "address";
  }

  public static async find(
    {
      session,
      id,
      customer_id = null
    }: FindArgs
  ): Promise<CustomerAddress | null> {
    const result = await this.baseFind<CustomerAddress>({
      session: session,
      urlIds: {"id": id, "customer_id": customer_id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id,
      customer_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<CustomerAddress>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "customer_id": customer_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      customer_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<CustomerAddress>> {
    const response = await this.baseFind<CustomerAddress>({
      session: session,
      urlIds: {"customer_id": customer_id},
      params: {...otherArgs},
    });

    return response;
  }

  public async default(
    {
      body = null,
      ...otherArgs
    }: DefaultArgs
  ): Promise<unknown> {
    const response = await this.request<CustomerAddress>({
      http_method: "put",
      operation: "default",
      session: this.session,
      urlIds: {"id": this.id, "customer_id": this.customer_id},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async set(
    {
      address_ids = null,
      operation = null,
      body = null,
      ...otherArgs
    }: SetArgs
  ): Promise<unknown> {
    const response = await this.request<CustomerAddress>({
      http_method: "put",
      operation: "set",
      session: this.session,
      urlIds: {"customer_id": this.customer_id},
      params: {"address_ids": address_ids, "operation": operation, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public address1: string | null;
  public address2: string | null;
  public city: string | null;
  public company: string | null;
  public country: string | null;
  public country_code: string | null;
  public country_name: string | null;
  public customer_id: number | null;
  public first_name: string | null;
  public id: number | null;
  public last_name: string | null;
  public name: string | null;
  public phone: string | null;
  public province: string | null;
  public province_code: string | null;
  public zip: string | null;
}
