/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  ids?: unknown;
  limit?: unknown;
}

export class InventoryItem extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'inventory_item';
  protected static PLURAL_NAME = 'inventory_items';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "inventory_items.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "inventory_items/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "inventory_items/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<InventoryItem | null> {
    const result = await InventoryItem.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as InventoryItem : null;
  }

  public static async all(
    {
      session,
      ids = null,
      limit = null,
      ...otherArgs
    }: AllArgs
  ): Promise<InventoryItem[]> {
    const response = await InventoryItem.baseFind({
      session: session,
      urlIds: {},
      params: {"ids": ids, "limit": limit, ...otherArgs},
    });

    return response as InventoryItem[];
  }

  public cost: string | null;
  public country_code_of_origin: string | null;
  public country_harmonized_system_codes: {[key: string]: unknown}[] | null;
  public created_at: string | null;
  public harmonized_system_code: number | null;
  public id: number | null;
  public province_code_of_origin: string | null;
  public requires_shipping: boolean | null;
  public sku: string | null;
  public tracked: boolean | null;
  public updated_at: string | null;
}
