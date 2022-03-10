import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  limit?: unknown;
  since_id?: unknown;
  created_at_min?: unknown;
  created_at_max?: unknown;
  updated_at_min?: unknown;
  updated_at_max?: unknown;
  starts_at_min?: unknown;
  starts_at_max?: unknown;
  ends_at_min?: unknown;
  ends_at_max?: unknown;
  times_used?: unknown;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class PriceRule extends Base {
  public static API_VERSION = ApiVersion.July21;

  protected static NAME = 'price_rule';
  protected static PLURAL_NAME = 'price_rules';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "post", "operation": "post", "ids": [], "path": "price_rules.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "price_rules.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "price_rules/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "price_rules/<id>.json"},
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "price_rules/<id>.json"},
    {"http_method": "get", "operation": "count", "ids": [], "path": "price_rules/count.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<PriceRule | null> {
    const result = await PriceRule.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as PriceRule : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await PriceRule.request({
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
      limit = null,
      since_id = null,
      created_at_min = null,
      created_at_max = null,
      updated_at_min = null,
      updated_at_max = null,
      starts_at_min = null,
      starts_at_max = null,
      ends_at_min = null,
      ends_at_max = null,
      times_used = null,
      ...otherArgs
    }: AllArgs
  ): Promise<PriceRule[]> {
    const response = await PriceRule.baseFind({
      session: session,
      urlIds: {},
      params: {"limit": limit, "since_id": since_id, "created_at_min": created_at_min, "created_at_max": created_at_max, "updated_at_min": updated_at_min, "updated_at_max": updated_at_max, "starts_at_min": starts_at_min, "starts_at_max": starts_at_max, "ends_at_min": ends_at_min, "ends_at_max": ends_at_max, "times_used": times_used, ...otherArgs},
    });

    return response as PriceRule[];
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await PriceRule.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public allocation_limit: number | null;
  public allocation_method: string | null;
  public created_at: string | null;
  public customer_selection: string | null;
  public ends_at: string | null;
  public entitled_collection_ids: number[] | null;
  public entitled_country_ids: number[] | null;
  public entitled_product_ids: number[] | null;
  public entitled_variant_ids: number[] | null;
  public id: number | null;
  public once_per_customer: boolean | null;
  public prerequisite_collection_ids: number[] | null;
  public prerequisite_customer_ids: number[] | null;
  public prerequisite_product_ids: number[] | null;
  public prerequisite_quantity_range: {[key: string]: unknown} | null;
  public prerequisite_saved_search_ids: number[] | null;
  public prerequisite_shipping_price_range: {[key: string]: unknown} | null;
  public prerequisite_subtotal_range: {[key: string]: unknown} | null;
  public prerequisite_to_entitlement_purchase: {[key: string]: unknown} | null;
  public prerequisite_to_entitlement_quantity_ratio: {[key: string]: unknown} | null;
  public prerequisite_variant_ids: number[] | null;
  public starts_at: string | null;
  public target_selection: string | null;
  public target_type: string | null;
  public title: string | null;
  public updated_at: string | null;
  public usage_limit: number | null;
  public value: string | null;
  public value_type: string | null;
}
