/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  order_id?: number | string | null;
}
interface DeleteArgs {
  session: SessionInterface;
  id: number | string;
  order_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  order_id?: number | string | null;
}

export class OrderRisk extends Base {
  public static API_VERSION = ApiVersion.October22;

  protected static NAME = 'order_risk';
  protected static PLURAL_NAME = 'order_risks';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["order_id", "id"], "path": "orders/<order_id>/risks/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id"], "path": "orders/<order_id>/risks.json"},
    {"http_method": "get", "operation": "get", "ids": ["order_id", "id"], "path": "orders/<order_id>/risks/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["order_id"], "path": "orders/<order_id>/risks.json"},
    {"http_method": "put", "operation": "put", "ids": ["order_id", "id"], "path": "orders/<order_id>/risks/<id>.json"}
  ];

  protected static getJsonBodyName(): string
  {
    return "risk";
  }

  public static async find(
    {
      session,
      id,
      order_id = null
    }: FindArgs
  ): Promise<OrderRisk | null> {
    const result = await OrderRisk.baseFind({
      session: session,
      urlIds: {"id": id, "order_id": order_id},
      params: {},
    });
    return result ? result[0] as OrderRisk : null;
  }

  public static async delete(
    {
      session,
      id,
      order_id = null
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await OrderRisk.request({
      http_method: "delete",
      operation: "delete",
      session: session,
      urlIds: {"id": id, "order_id": order_id},
      params: {},
    });

    return response ? response.body : null;
  }

  public static async all(
    {
      session,
      order_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<OrderRisk[]> {
    const response = await OrderRisk.baseFind({
      session: session,
      urlIds: {"order_id": order_id},
      params: {...otherArgs},
    });

    return response as OrderRisk[];
  }

  public cause_cancel: boolean | null;
  public checkout_id: number | null;
  public display: boolean | null;
  public id: number | null;
  public merchant_message: string | null;
  public message: string | null;
  public order_id: number | null;
  public recommendation: string | null;
  public score: number | null;
  public source: string | null;
}
