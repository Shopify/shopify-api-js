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
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  ids?: unknown;
  limit?: unknown;
}

export class InventoryItem extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "inventory_items.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "inventory_items/<id>.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "inventory_items/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "inventory_item",
      "plural": "inventory_items"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<InventoryItem | null> {
    const result = await this.baseFind<InventoryItem>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      ids = null,
      limit = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<InventoryItem>> {
    const response = await this.baseFind<InventoryItem>({
      session: session,
      urlIds: {},
      params: {"ids": ids, "limit": limit, ...otherArgs},
    });

    return response;
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
