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
}

export class PaymentGateway extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "payment_gateways/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "payment_gateways.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "payment_gateways/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "payment_gateways.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "payment_gateways/<id>.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "payment_gateway",
      "plural": "payment_gateways"
    }
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<PaymentGateway | null> {
    const result = await this.baseFind<PaymentGateway>({
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
    const response = await this.request<PaymentGateway>({
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
  ): Promise<FindAllResponse<PaymentGateway>> {
    const response = await this.baseFind<PaymentGateway>({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response;
  }

  public attachment: string | null;
  public created_at: string | null;
  public credential1: string | null;
  public credential2: string | null;
  public credential3: string | null;
  public credential4: string | null;
  public disabled: boolean | null;
  public enabled_card_brands: string[] | null;
  public id: number | null;
  public name: string | null;
  public processing_method: string | null;
  public provider_id: number | null;
  public sandbox: boolean | null;
  public service_name: string | null;
  public supports_network_tokenization: boolean | null;
  public type: string | null;
  public updated_at: string | null;
}
