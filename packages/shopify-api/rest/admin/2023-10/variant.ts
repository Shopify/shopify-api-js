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
  fields?: unknown;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
  product_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  product_id?: number | string | null;
  limit?: unknown;
  presentment_currencies?: unknown;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  product_id?: number | string | null;
}

export class Variant extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["product_id", "id"], "path": "products/<product_id>/variants/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": ["product_id"], "path": "products/<product_id>/variants/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "products/<product_id>/variants.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "variants/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["product_id"], "path": "products/<product_id>/variants.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "variants/<id>.json"}
  ];
  protected static readOnlyAttributes: string[] = [
    "inventory_quantity"
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "variant",
      "plural": "variants"
    }
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Variant | null> {
    const result = await this.baseFind<Variant>({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id,
      product_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<Variant>({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "product_id": product_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      product_id = null,
      limit = null,
      presentment_currencies = null,
      since_id = null,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Variant>> {
    const response = await this.baseFind<Variant>({
      session: session,
      urlIds: {"product_id": product_id},
      params: {"limit": limit, "presentment_currencies": presentment_currencies, "since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      product_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Variant>({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {"product_id": product_id},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public barcode: string | null;
  public compare_at_price: string | null;
  public created_at: string | null;
  public fulfillment_service: string | null;
  public grams: number | null;
  public id: number | null;
  public image_id: number | null;
  public inventory_item_id: number | null;
  public inventory_management: string | null;
  public inventory_policy: string | null;
  public inventory_quantity: number | null;
  public old_inventory_quantity: number | null;
  public option: {[key: string]: unknown} | null;
  public position: number | null;
  public presentment_prices: {[key: string]: unknown}[] | null;
  public price: string | null;
  public product_id: number | null;
  public requires_shipping: boolean | null;
  public sku: string | null;
  public tax_code: string | null;
  public taxable: boolean | null;
  public title: string | null;
  public updated_at: string | null;
  public weight: number | null;
  public weight_unit: string | null;
}
