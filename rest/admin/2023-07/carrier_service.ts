/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface FindArgs {
  session: Session;
  id: number | string;
}
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
}

export class CarrierService extends Base {
  public static apiVersion = ApiVersion.July23;

  protected static resourceName = 'carrier_service';
  protected static pluralName = 'carrier_services';
  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
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
    const result = await this.baseFind<CarrierService>({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await this.request<CarrierService>({
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
  ): Promise<FindAllResponse<CarrierService>> {
    const response = await this.baseFind<CarrierService>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public active: boolean | null;
  public admin_graphql_api_id: string | null;
  public callback_url: string | null;
  public carrier_service_type: string | null;
  public format: string | null;
  public id: number | null;
  public name: string | null;
  public service_discovery: boolean | null;
}
