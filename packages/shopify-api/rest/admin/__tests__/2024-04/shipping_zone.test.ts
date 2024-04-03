/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2024-04';

describe('ShippingZone resource', () => {
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
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"shipping_zones": [{"id": 44570466, "name": "Downtown Ottawa", "profile_id": "gid://shopify/DeliveryProfile/690933842", "location_group_id": "gid://shopify/DeliveryLocationGroup/694323328", "admin_graphql_api_id": "gid://shopify/DeliveryZone/44570466", "countries": [{"id": 359115488, "name": "Colombia", "tax": 0.15, "code": "CO", "tax_name": "VAT", "shipping_zone_id": 44570466, "provinces": []}, {"id": 879921427, "name": "Canada", "tax": 0.05, "code": "CA", "tax_name": "GST", "shipping_zone_id": 44570466, "provinces": [{"id": 224293623, "country_id": 879921427, "name": "Quebec", "code": "QC", "tax": 0.09, "tax_name": "HST", "tax_type": "compounded", "tax_percentage": 9.0, "shipping_zone_id": 44570466}, {"id": 702530425, "country_id": 879921427, "name": "Ontario", "code": "ON", "tax": 0.08, "tax_name": null, "tax_type": null, "tax_percentage": 8.0, "shipping_zone_id": 44570466}]}, {"id": 817138619, "name": "United States", "tax": 0.0, "code": "US", "tax_name": "Federal Tax", "shipping_zone_id": 44570466, "provinces": [{"id": 9350860, "country_id": 817138619, "name": "Massachusetts", "code": "MA", "tax": 0.065, "tax_name": null, "tax_type": null, "tax_percentage": 6.5, "shipping_zone_id": 44570466}, {"id": 1013111685, "country_id": 817138619, "name": "New York", "code": "NY", "tax": 0.04, "tax_name": null, "tax_type": null, "tax_percentage": 4.0, "shipping_zone_id": 44570466}]}], "weight_based_shipping_rates": [{"id": 522512552, "name": "Free Under 5kg", "price": "0.00", "shipping_zone_id": 44570466, "weight_low": 0.0, "weight_high": 5.0}], "price_based_shipping_rates": [{"id": 64051, "name": "Free Shipping", "price": "0.00", "shipping_zone_id": 44570466, "min_order_subtotal": null, "max_order_subtotal": "450"}], "carrier_shipping_rate_providers": [{"id": 615128020, "carrier_service_id": 260046840, "flat_modifier": "", "percent_modifier": null, "service_filter": {"*": "+"}, "shipping_zone_id": 44570466}]}]}));

    await shopify.rest.ShippingZone.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/shipping_zones.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
