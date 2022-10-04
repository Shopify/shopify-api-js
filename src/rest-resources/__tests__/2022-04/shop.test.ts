/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Shop} from '../../2022-04';

describe('Shop resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"shop": {"id": 548380009, "name": "John Smith Test Store", "email": "j.smith@example.com", "domain": "shop.apple.com", "province": "California", "country": "US", "address1": "1 Infinite Loop", "zip": "95014", "city": "Cupertino", "source": null, "phone": "1231231234", "latitude": 45.45, "longitude": -75.43, "primary_locale": "en", "address2": "Suite 100", "created_at": "2007-12-31T19:00:00-05:00", "updated_at": "2022-10-03T13:22:14-04:00", "country_code": "US", "country_name": "United States", "currency": "USD", "customer_email": "customers@apple.com", "timezone": "(GMT-05:00) Eastern Time (US & Canada)", "iana_timezone": "America/New_York", "shop_owner": "John Smith", "money_format": "${{amount}}", "money_with_currency_format": "${{amount}} USD", "weight_unit": "lb", "province_code": "CA", "taxes_included": null, "auto_configure_tax_inclusivity": null, "tax_shipping": null, "county_taxes": true, "plan_display_name": "Shopify Plus", "plan_name": "enterprise", "has_discounts": true, "has_gift_cards": true, "myshopify_domain": "jsmith.myshopify.com", "google_apps_domain": null, "google_apps_login_enabled": null, "money_in_emails_format": "${{amount}}", "money_with_currency_in_emails_format": "${{amount}} USD", "eligible_for_payments": true, "requires_extra_payments_agreement": false, "password_enabled": false, "has_storefront": true, "eligible_for_card_reader_giveaway": false, "finances": true, "primary_location_id": 655441491, "cookie_consent_level": "implicit", "visitor_tracking_consent_preference": "allow_all", "checkout_api_supported": true, "multi_location_enabled": true, "setup_required": false, "pre_launch_enabled": false, "enabled_presentment_currencies": ["USD"], "transactional_sms_disabled": false, "marketing_sms_consent_enabled_at_checkout": false}}));

    await Shop.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/shop.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"shop": {"province": "California", "country": "US", "address1": "1 Infinite Loop", "city": "Cupertino", "address2": "Suite 100"}}));

    await Shop.all({
      session: test_session,
      fields: "address1,address2,city,province,country",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/shop.json',
      query: 'fields=address1%2Caddress2%2Ccity%2Cprovince%2Ccountry',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
