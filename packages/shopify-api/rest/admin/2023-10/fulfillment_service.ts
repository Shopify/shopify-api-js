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
interface DeleteArgs {
  session: Session;
  id: number | string;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  scope?: unknown;
}

export class FulfillmentService extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "fulfillment_services/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "fulfillment_services.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "fulfillment_services/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "fulfillment_services.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "fulfillment_services/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "fulfillment_service",
      "plural": "fulfillment_services"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<FulfillmentService | null> {
    const result = await this.baseFind<FulfillmentService>({
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
    const response = await this.request<FulfillmentService>({
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
      scope = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<FulfillmentService>> {
    const response = await this.baseFind<FulfillmentService>({
      session: session,
      urlIds: {},
      params: {"scope": scope, ...otherArgs},
    });

    return response;
  }

  public admin_graphql_api_id: string | null;
  public callback_url: string | null;
  public fulfillment_orders_opt_in: boolean | null;
  public handle: string | null;
  public id: number | null;
  public inventory_management: boolean | null;
  public location_id: number | null;
  public name: string | null;
  public permits_sku_sharing: boolean | null;
  public provider_id: string | null;
  public requires_shipping_method: boolean | null;
  public tracking_support: boolean | null;
}
