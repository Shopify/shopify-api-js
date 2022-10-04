/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

<<<<<<< HEAD:rest/admin/2022-04/payment_transaction.ts
import {Base} from '../../base';
import {ResourcePath} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';
=======
import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';
>>>>>>> 1a149a83 (Add 2022-10 REST resources):src/rest-resources/2022-04/payment_transaction.ts

import {Currency} from './currency';

interface TransactionsArgs {
  [key: string]: unknown;
  session: Session;
  since_id?: unknown;
  last_id?: unknown;
  test?: unknown;
  payout_id?: unknown;
  payout_status?: unknown;
}

export class PaymentTransaction extends Base {
  public static apiVersion = ApiVersion.April22;

  protected static resourceName = 'payment_transaction';
  protected static pluralName = 'payment_transactions';
  protected static hasOne: {[key: string]: typeof Base} = {
    "currency": Currency
  };
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "transactions", "ids": [], "path": "shopify_payments/balance/transactions.json"}
  ];

  public static async transactions(
    {
      session,
      since_id = null,
      last_id = null,
      test = null,
      payout_id = null,
      payout_status = null,
      ...otherArgs
    }: TransactionsArgs
  ): Promise<unknown> {
    const response = await this.request<PaymentTransaction>({
      http_method: "get",
      operation: "transactions",
      session: session,
      urlIds: {},
      params: {"since_id": since_id, "last_id": last_id, "test": test, "payout_id": payout_id, "payout_status": payout_status, ...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public amount: string | null;
  public currency: Currency | null | {[key: string]: any};
  public fee: string | null;
  public id: number | null;
  public net: string | null;
  public payout_id: number | null;
  public payout_status: string | null;
  public processed_at: string | null;
  public source_id: number | null;
  public source_order_id: number | null;
  public source_order_transaction_id: number | null;
  public source_type: string | null;
  public test: boolean | null;
  public type: string | null;
}
