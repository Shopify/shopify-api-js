/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

import {DiscountCode} from './discount_code';
import {Order} from './order';
import {GiftCard} from './gift_card';

interface FindArgs {
  session: Session;
  token: number | string;
}
interface ShippingRatesArgs {
  [key: string]: unknown;
  session: Session;
  token: number | string;
}
interface CompleteArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class Checkout extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {
    "discount_code": DiscountCode,
    "order": Order
  };
  protected static hasMany: {[key: string]: typeof Base} = {
    "gift_cards": GiftCard
  };
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": ["token"], "path": "checkouts/<token>.json"},
    {"http_method": "get", "operation": "shipping_rates", "ids": ["token"], "path": "checkouts/<token>/shipping_rates.json"},
    {"http_method": "post", "operation": "complete", "ids": ["token"], "path": "checkouts/<token>/complete.json"},
    {"http_method": "post", "operation": "post", "ids": [], "path": "checkouts.json"},
    {"http_method": "put", "operation": "put", "ids": ["token"], "path": "checkouts/<token>.json"}
  ];
  protected static primaryKey: string = "token";
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "checkout",
      "plural": "checkouts"
    }
  ];

  public static async find(
    {
      session,
      token
    }: FindArgs
  ): Promise<Checkout | null> {
    const result = await this.baseFind<Checkout>({
      session: session,
      urlIds: {"token": token},
      params: {},
    });
    return result.data ? result.data[0] : null;
  }

  public static async shipping_rates(
    {
      session,
      token,
      ...otherArgs
    }: ShippingRatesArgs
  ): Promise<unknown> {
    const response = await this.request<Checkout>({
      http_method: "get",
      operation: "shipping_rates",
      session: session,
      urlIds: {"token": token},
      params: {...otherArgs},
      body: {},
      entity: null,
    });

    return response ? response.body : null;
  }

  public async complete(
    {
      body = null,
      ...otherArgs
    }: CompleteArgs
  ): Promise<unknown> {
    const response = await this.request<Checkout>({
      http_method: "post",
      operation: "complete",
      session: this.session,
      urlIds: {"token": this.token},
      params: {...otherArgs},
      body: body,
      entity: this,
    });

    return response ? response.body : null;
  }

  public billing_address: {[key: string]: unknown} | null;
  public line_items: {[key: string]: unknown}[] | null;
  public applied_discount: {[key: string]: unknown} | null;
  public buyer_accepts_marketing: boolean | null;
  public created_at: string | null;
  public currency: string | null;
  public customer_id: number | null;
  public discount_code: DiscountCode | null | {[key: string]: any};
  public email: string | null;
  public gift_cards: GiftCard[] | null | {[key: string]: any};
  public order: Order | null | {[key: string]: any};
  public payment_due: string | null;
  public payment_url: string | null;
  public phone: string | null;
  public presentment_currency: string | null;
  public requires_shipping: boolean | null;
  public reservation_time: string | null;
  public reservation_time_left: number | null;
  public shipping_address: {[key: string]: unknown} | null;
  public shipping_line: {[key: string]: unknown} | null;
  public shipping_rate: {[key: string]: unknown} | null;
  public source_identifier: string | null;
  public source_name: string | null;
  public source_url: string | null;
  public subtotal_price: string | null;
  public tax_lines: {[key: string]: unknown}[] | null;
  public taxes_included: boolean | null;
  public token: string | null;
  public total_price: string | null;
  public total_tax: string | null;
  public updated_at: string | null;
  public user_id: number | null;
  public web_url: string | null;
}
