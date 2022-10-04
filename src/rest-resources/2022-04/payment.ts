/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {Transaction} from './transaction';
import {Checkout} from './checkout';

interface FindArgs {
  session: SessionInterface;
  id: number | string;
  checkout_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: SessionInterface;
  checkout_id?: number | string | null;
}
interface CountArgs {
  [key: string]: unknown;
  session: SessionInterface;
  checkout_id?: number | string | null;
}

export class Payment extends Base {
  public static API_VERSION = ApiVersion.April22;

  protected static NAME = 'payment';
  protected static PLURAL_NAME = 'payments';
  protected static HAS_ONE: {[key: string]: typeof Base} = {
    "transaction": Transaction,
    "checkout": Checkout
  };
  protected static HAS_MANY: {[key: string]: typeof Base} = {};
  protected static PATHS: ResourcePath[] = [
    {"http_method": "get", "operation": "count", "ids": ["checkout_id"], "path": "checkouts/<checkout_id>/payments/count.json"},
    {"http_method": "get", "operation": "get", "ids": ["checkout_id"], "path": "checkouts/<checkout_id>/payments.json"},
    {"http_method": "get", "operation": "get", "ids": ["checkout_id", "id"], "path": "checkouts/<checkout_id>/payments/<id>.json"},
    {"http_method": "post", "operation": "post", "ids": ["checkout_id"], "path": "checkouts/<checkout_id>/payments.json"}
  ];

  public static async find(
    {
      session,
      id,
      checkout_id = null
    }: FindArgs
  ): Promise<Payment | null> {
    const result = await Payment.baseFind({
      session: session,
      urlIds: {"id": id, "checkout_id": checkout_id},
      params: {},
    });
    return result ? result[0] as Payment : null;
  }

  public static async all(
    {
      session,
      checkout_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<Payment[]> {
    const response = await Payment.baseFind({
      session: session,
      urlIds: {"checkout_id": checkout_id},
      params: {...otherArgs},
    });

    return response as Payment[];
  }

  public static async count(
    {
      session,
      checkout_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await Payment.request({
      http_method: "get",
      operation: "count",
      session: session,
      urlIds: {"checkout_id": checkout_id},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public checkout: Checkout | null | {[key: string]: any};
  public credit_card: {[key: string]: unknown} | null;
  public id: number | null;
  public next_action: {[key: string]: unknown} | null;
  public payment_processing_error_message: string | null;
  public transaction: Transaction | null | {[key: string]: any};
  public unique_token: string | null;
}
