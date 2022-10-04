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
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
}
interface InventoryLevelsArgs {
  [key: string]: unknown;
  session: SessionInterface;
  id: number | string;
}

export class Location extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'location';
  protected static PLURAL_NAME = 'locations';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": [], "path": "locations/count.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "locations.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "locations/<id>.json"},
    {"http_method": "get", "operation": "inventory_levels", "ids": ["id"], "path": "locations/<id>/inventory_levels.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<Location | null> {
    const result = await Location.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as Location : null;
  }

  public static async all(
    {
      session,
      ...otherArgs
    }: AllArgs
  ): Promise<Location[]> {
    const response = await Location.baseFind({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response as Location[];
  }

  public static async count(
    {
      session,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Location.request({
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

  public static async inventory_levels(
    {
      session,
      id,
      ...otherArgs
    }: InventoryLevelsArgs
  ): Promise<unknown> {
    const response = await Location.request({
      http_method: "get",
      operation: "inventory_levels",
      session: session,
      urlIds: {"id": id},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public active: boolean | null;
  public address1: string | null;
  public address2: string | null;
  public city: string | null;
  public country: string | null;
  public country_code: string | null;
  public created_at: string | null;
  public id: number | null;
  public legacy: boolean | null;
  public localized_country_name: string | null;
  public localized_province_name: string | null;
  public name: string | null;
  public phone: string | null;
  public province: string | null;
  public province_code: string | null;
  public updated_at: string | null;
  public zip: string | null;
}
