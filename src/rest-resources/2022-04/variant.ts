/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  fields?: unknown;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
  product_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  product_id?: number | string | null;
  limit?: unknown;
  presentment_currencies?: unknown;
  since_id?: unknown;
  fields?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  product_id?: number | string | null;
}

export class Variant extends Base {
  public static API_VERSION = ApiVersion.April22;

  protected static NAME = 'variant';
  protected static PLURAL_NAME = 'variants';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["product_id", "id"], "path": "products/<product_id>/variants/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": ["product_id"], "path": "products/<product_id>/variants/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["product_id"], "path": "products/<product_id>/variants.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "variants/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["product_id"], "path": "products/<product_id>/variants.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "variants/<id>.json"}
  ];
  protected static READ_ONLY_ATTRIBUTES: string[] = [
    "inventory_quantity",
    "inventory_quantity_adjustment"
  ];

  public static async find(
    {
      session,
      id,
      fields = null
    }: FindArgs
  ): Promise<Variant | null> {
    const result = await Variant.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {"fields": fields},
    });
    return result ? result[0] as Variant : null;
  }

  public static async delete(
    {
      session,
      id,
      product_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await Variant.request({
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
  ): Promise<Variant[]> {
    const response = await Variant.baseFind({
      session: session,
      urlIds: {"product_id": product_id},
      params: {"limit": limit, "presentment_currencies": presentment_currencies, "since_id": since_id, "fields": fields, ...otherArgs},
    });

    return response as Variant[];
  }

  public static async count(
    {
      session,
      product_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Variant.request({
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
  public inventory_quantity_adjustment: number | null;
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
