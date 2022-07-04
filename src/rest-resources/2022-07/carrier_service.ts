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
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
}

export class CarrierService extends Base {
  public static API_VERSION = ApiVersion.July22;

  protected static NAME = 'carrier_service';
  protected static PLURAL_NAME = 'carrier_services';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "carrier_services/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "carrier_services.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "carrier_services/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "carrier_services.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "carrier_services/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<CarrierService | null> {
    const result = await CarrierService.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as CarrierService : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await CarrierService.request({
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
      ...otherArgs
    }: AllArgs
  ): Promise<CarrierService[]> {
    const response = await CarrierService.baseFind({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response as CarrierService[];
  }

  public active: boolean | null;
  public admin_graphql_api_id: string | null;
  public callback_url: string | null;
  public carrier_service_type: string | null;
  public id: number | null;
  public name: string | null;
  public service_discovery: boolean | null;
}
