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
  scope?: unknown;
}

export class FulfillmentService extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'fulfillment_service';
  protected static PLURAL_NAME = 'fulfillment_services';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "fulfillment_services/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "fulfillment_services.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "fulfillment_services/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "fulfillment_services.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "fulfillment_services/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<FulfillmentService | null> {
    const result = await FulfillmentService.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as FulfillmentService : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await FulfillmentService.request({
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
  ): Promise<FulfillmentService[]> {
    const response = await FulfillmentService.baseFind({
      session: session,
      urlIds: {},
      params: {"scope": scope, ...otherArgs},
    });

    return response as FulfillmentService[];
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
