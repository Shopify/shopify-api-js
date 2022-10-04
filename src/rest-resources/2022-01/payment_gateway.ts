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

export class PaymentGateway extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'payment_gateway';
  protected static PLURAL_NAME = 'payment_gateways';
  protected static HAS_ONE: {[key: string]: typeof Base} = {};
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "delete", "operation": "delete", "ids": ["id"], "path": "payment_gateways/<id>.json"},
    {"http_method": "get", "operation": "get", "ids": [], "path": "payment_gateways.json"},
    {"http_method": "get", "operation": "get", "ids": ["id"], "path": "payment_gateways/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "payment_gateways.json"},
    {"http_method": "put", "operation": "put", "ids": ["id"], "path": "payment_gateways/<id>.json"}
  ];

  public static async find(
    {
      session,
      id
    }: FindArgs
  ): Promise<PaymentGateway | null> {
    const result = await PaymentGateway.baseFind({
      session: session,
      urlIds: {"id": id},
      params: {},
    });
    return result ? result[0] as PaymentGateway : null;
  }

  public static async delete(
    {
      session,
      id
    }: DeleteArgs
  ): Promise<unknown> {
    const response = await PaymentGateway.request({
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
  ): Promise<PaymentGateway[]> {
    const response = await PaymentGateway.baseFind({
      session: session,
      urlIds: {},
      params: {...otherArgs},
    });

    return response as PaymentGateway[];
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
