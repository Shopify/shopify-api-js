/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

<<<<<<< HEAD:rest/admin/2022-07/payment.ts
import {Base, FindAllResponse} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';
=======
import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/2022-04/payment.ts

import {Transaction} from './transaction';
import {Checkout} from './checkout';

interface FindArgs {
  session: Session;
  id: number | string;
  checkout_id?: number | string | null;
}
interface AllArgs {
  [key: string]: unknown;
  session: Session;
  checkout_id?: number | string | null;
}
interface CountArgs {
  [key: string]: unknown;
  session: Session;
  checkout_id?: number | string | null;
}

export class Payment extends Base {
  public static apiVersion = ApiVersion.July22;

  protected static resourceName = 'payment';
  protected static pluralName = 'payments';
  protected static hasOne: {[key: string]: typeof Base} = {
    "transaction": Transaction,
    "checkout": Checkout
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
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
    const result = await this.baseFind<Payment>({
      session: session,
      urlIds: {"id": id, "checkout_id": checkout_id},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async all(
    {
      session,
      checkout_id = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Payment>> {
    const response = await this.baseFind<Payment>({
      session: session,
      urlIds: {"checkout_id": checkout_id},
      params: {...otherArgs},
    });

    return response;
  }

  public static async count(
    {
      session,
      checkout_id = null,
      ...otherArgs
    }: CountArgs
  ): Promise<unknown> {
    const response = await this.request<Payment>({
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
