import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface DeleteArgs {
  session: SessionInterface;
  inventory_item_id?: unknown;
  location_id?: unknown;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  inventory_item_ids?: unknown;
  location_ids?: unknown;
  limit?: unknown;
  updated_at_min?: unknown;
}
interface AdjustArgs {
  [key: string]: unknown;
  inventory_item_id?: unknown;
  location_id?: unknown;
  available_adjustment?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface ConnectArgs {
  [key: string]: unknown;
  inventory_item_id?: unknown;
  location_id?: unknown;
  relocate_if_necessary?: unknown;
  body?: {[key: string]: unknown} | null;
}
interface SetArgs {
  [key: string]: unknown;
  inventory_item_id?: unknown;
  location_id?: unknown;
  available?: unknown;
  disconnect_if_necessary?: unknown;
  body?: {[key: string]: unknown} | null;
}

export class InventoryLevel extends Base {
  public static API_VERSION = ApiVersion.October21;

  protected static NAME = 'inventory_level';
  protected static PLURAL_NAME = 'inventory_levels';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": [], "path": "inventory_levels.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "inventory_levels.json"},
    {"http_method": "post", "operation": "adjust", "ids": [], "path": "inventory_levels/adjust.json"},
    {"http_method": "post", "operation": "connect", "ids": [], "path": "inventory_levels/connect.json"},
    {"http_method": "post", "operation": "set", "ids": [], "path": "inventory_levels/set.json"}
  ];

  public static async delete(
    {
      session,
      inventory_item_id = null,
      location_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await InventoryLevel.request({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {},
      params: {"inventory_item_id": inventory_item_id, "location_id": location_id},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      inventory_item_ids = null,
      location_ids = null,
      limit = null,
      updated_at_min = null,
      ...otherArgs
    }: AllArgs
  ): Promise<InventoryLevel[]> {
    const response = await InventoryLevel.baseFind({
      session: session,
      urlIds: {},
      params: {"inventory_item_ids": inventory_item_ids, "location_ids": location_ids, "limit": limit, "updated_at_min": updated_at_min, ...otherArgs},
    });

    return response as InventoryLevel[];
  }

  public async adjust(
    {
      inventory_item_id = null,
      location_id = null,
      available_adjustment = null,
      body = null,
      ...otherArgs
    }: AdjustArgs
  ): Promise<unknown> {
    const response = await InventoryLevel.request({
      http_method: "post",
      operation: "adjust",
      session: this.session,
      urlIds: {},
      params: {"inventory_item_id": inventory_item_id, "location_id": location_id, "available_adjustment": available_adjustment, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async connect(
    {
      inventory_item_id = null,
      location_id = null,
      relocate_if_necessary = null,
      body = null,
      ...otherArgs
    }: ConnectArgs
  ): Promise<unknown> {
    const response = await InventoryLevel.request({
      http_method: "post",
      operation: "connect",
      session: this.session,
      urlIds: {},
      params: {"inventory_item_id": inventory_item_id, "location_id": location_id, "relocate_if_necessary": relocate_if_necessary, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public async set(
    {
      inventory_item_id = null,
      location_id = null,
      available = null,
      disconnect_if_necessary = null,
      body = null,
      ...otherArgs
    }: SetArgs
  ): Promise<unknown> {
    const response = await InventoryLevel.request({
      http_method: "post",
      operation: "set",
      session: this.session,
      urlIds: {},
      params: {"inventory_item_id": inventory_item_id, "location_id": location_id, "available": available, "disconnect_if_necessary": disconnect_if_necessary, ...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public available: number | null;
  public inventory_item_id: number | null;
  public location_id: number | null;
  public updated_at: string | null;
}
