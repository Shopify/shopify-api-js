import Base, {ResourcePath} from '../../base-rest-resource';
import {SessionInterface} from '../../auth/session/types';
import {ApiVersion} from '../../base-types';

import {DiscountCode} from './discount_code';
import {Order} from './order';
import {GiftCard} from './gift_card';

interface FindArgs {
  session: SessionInterface;
  token: number | string;
}
interface ShippingRatesArgs {
  [key: string]: unknown;
  session: SessionInterface;
  token: number | string;
}
interface CompleteArgs {
  [key: string]: unknown;
  body?: {[key: string]: unknown} | null;
}

export class Checkout extends Base {
  public static API_VERSION = ApiVersion.January22;

  protected static NAME = 'checkout';
  protected static PLURAL_NAME = 'checkouts';
  protected static HAS_ONE: {[key: string]: typeof Base} = {
    "discount_code": DiscountCode,
    "order": Order
  };
  protected static HAS_MANY: {[key: string]: typeof Base} = {
    "gift_cards": GiftCard
  };
  protected static PATHS: ResourcePath[] = [
    {"http_method": "post", "operation": "post", "ids": [], "path": "checkouts.json"},
    {"http_method": "post", "operation": "complete", "ids": ["token"], "path": "checkouts/<token>/complete.json"},
    {"http_method": "get", "operation": "get", "ids": ["token"], "path": "checkouts/<token>.json"},
    {"http_method": "put", "operation": "put", "ids": ["token"], "path": "checkouts/<token>.json"},
    {"http_method": "get", "operation": "shipping_rates", "ids": ["token"], "path": "checkouts/<token>/shipping_rates.json"}
  ];
  protected static PRIMARY_KEY: string = "token";

  public static async find(
    {
      session,
      token
    }: FindArgs
  ): Promise<Checkout | null> {
    const result = await Checkout.baseFind({
      session: session,
      urlIds: {"token": token},
      params: {},
    });
    return result ? result[0] as Checkout : null;
  }

  public static async shipping_rates(
    {
      session,
      token,
      ...otherArgs
    }: ShippingRatesArgs
  ): Promise<unknown> {
    const response = await Checkout.request({
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
    const response = await Checkout.request({
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
  public source_name: string | null;
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
