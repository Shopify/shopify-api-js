/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April22,
    restResources,
  });
});

describe('Shop resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    queueMockResponse(JSON.stringify({"shop": {"id": 548380009, "name": "John Smith Test Store", "email": "j.smith@example.com", "domain": "shop.apple.com", "province": "California", "country": "US", "address1": "1 Infinite Loop", "zip": "95014", "city": "Cupertino", "source": null, "phone": "1231231234", "latitude": 45.45, "longitude": -75.43, "primary_locale": "en", "address2": "Suite 100", "created_at": "2007-12-31T19:00:00-05:00", "updated_at": "2023-06-14T14:21:51-04:00", "country_code": "US", "country_name": "United States", "currency": "USD", "customer_email": "customers@apple.com", "timezone": "(GMT-05:00) Eastern Time (US & Canada)", "iana_timezone": "America/New_York", "shop_owner": "John Smith", "money_format": "${{amount}}", "money_with_currency_format": "${{amount}} USD", "weight_unit": "lb", "province_code": "CA", "taxes_included": null, "auto_configure_tax_inclusivity": null, "tax_shipping": null, "county_taxes": true, "plan_display_name": "Shopify Plus", "plan_name": "enterprise", "has_discounts": true, "has_gift_cards": true, "myshopify_domain": "jsmith.myshopify.com", "google_apps_domain": null, "google_apps_login_enabled": null, "money_in_emails_format": "${{amount}}", "money_with_currency_in_emails_format": "${{amount}} USD", "eligible_for_payments": true, "requires_extra_payments_agreement": false, "password_enabled": false, "has_storefront": true, "finances": true, "primary_location_id": 655441491, "cookie_consent_level": "implicit", "visitor_tracking_consent_preference": "allow_all", "checkout_api_supported": true, "multi_location_enabled": true, "setup_required": false, "pre_launch_enabled": false, "enabled_presentment_currencies": ["USD"], "transactional_sms_disabled": false, "marketing_sms_consent_enabled_at_checkout": false}}));

    await shopify.rest.Shop.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/shop.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"shop": {"province": "California", "country": "US", "address1": "1 Infinite Loop", "city": "Cupertino", "address2": "Suite 100"}}));

    await shopify.rest.Shop.all({
      session: session,
      fields: "address1,address2,city,province,country",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/shop.json',
      query: 'fields=address1%2Caddress2%2Ccity%2Cprovince%2Ccountry',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
