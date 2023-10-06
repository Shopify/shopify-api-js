/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Base, FindAllResponse} from '../../base';
import {ResourcePath, ResourceNames} from '../../types';
import {Session} from '../../../lib/session/session';
import {ApiVersion} from '../../../lib/types';

interface AllArgs {
  [key: string]: unknown;
  session: Session;
  fields?: unknown;
}

export class Shop extends Base {
  public static apiVersion = ApiVersion.October23;

  protected static hasOne: {[key: string]: typeof Base} = {};
  protected static hasMany: {[key: string]: typeof Base} = {};
  protected static paths: ResourcePath[] = [
    {"http_method": "get", "operation": "get", "ids": [], "path": "shop.json"}
  ];
  protected static resourceNames: ResourceNames[] = [
    {
      "singular": "shop",
      "plural": "shops"
    }
  ];

  public static async all(
    {
      session,
      fields = null,
      ...otherArgs
    }: AllArgs
  ): Promise<FindAllResponse<Shop>> {
    const response = await this.baseFind<Shop>({
      session: session,
      urlIds: {},
      params: {"fields": fields, ...otherArgs},
    });

    return response;
  }

  public address1: string | null;
  public address2: string | null;
  public checkout_api_supported: boolean | null;
  public city: string | null;
  public country: string | null;
  public country_code: string | null;
  public country_name: string | null;
  public county_taxes: boolean | null;
  public created_at: string | null;
  public currency: string | null;
  public customer_email: string | null;
  public domain: string | null;
  public eligible_for_card_reader_giveaway: boolean | null;
  public eligible_for_payments: boolean | null;
  public email: string | null;
  public enabled_presentment_currencies: string[] | null;
  public finances: boolean | null;
  public force_ssl: boolean | null;
  public google_apps_domain: string | null;
  public google_apps_login_enabled: string | null;
  public has_discounts: boolean | null;
  public has_gift_cards: boolean | null;
  public has_storefront: boolean | null;
  public iana_timezone: string | null;
  public id: number | null;
  public latitude: number | null;
  public longitude: number | null;
  public marketing_sms_consent_enabled_at_checkout: boolean | null;
  public money_format: string | null;
  public money_in_emails_format: string | null;
  public money_with_currency_format: string | null;
  public money_with_currency_in_emails_format: string | null;
  public multi_location_enabled: boolean | null;
  public myshopify_domain: string | null;
  public name: string | null;
  public password_enabled: boolean | null;
  public phone: string | null;
  public plan_display_name: string | null;
  public plan_name: string | null;
  public pre_launch_enabled: boolean | null;
  public primary_locale: string | null;
  public primary_location_id: number | null;
  public province: string | null;
  public province_code: string | null;
  public requires_extra_payments_agreement: boolean | null;
  public setup_required: boolean | null;
  public shop_owner: string | null;
  public source: string | null;
  public tax_shipping: string | null;
  public taxes_included: boolean | null;
  public timezone: string | null;
  public transactional_sms_disabled: boolean | null;
  public updated_at: string | null;
  public weight_unit: string | null;
  public zip: string | null;
}
