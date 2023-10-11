/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-07';

describe('Province resource', () => {
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
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"provinces": [{"id": 205434194, "country_id": 879921427, "name": "Alberta", "code": "AB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 170405627, "country_id": 879921427, "name": "British Columbia", "code": "BC", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 342345110, "country_id": 879921427, "name": "Manitoba", "code": "MB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 92264567, "country_id": 879921427, "name": "New Brunswick", "code": "NB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 243284171, "country_id": 879921427, "name": "Newfoundland", "code": "NL", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 439598329, "country_id": 879921427, "name": "Northwest Territories", "code": "NT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 448070559, "country_id": 879921427, "name": "Nova Scotia", "code": "NS", "tax_name": null, "tax_type": "harmonized", "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 670206421, "country_id": 879921427, "name": "Nunavut", "code": "NU", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 702530425, "country_id": 879921427, "name": "Ontario", "code": "ON", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 570891722, "country_id": 879921427, "name": "Prince Edward Island", "code": "PE", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.1, "tax_percentage": 10.0}, {"id": 224293623, "country_id": 879921427, "name": "Quebec", "code": "QC", "tax_name": "HST", "tax_type": "compounded", "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 473391800, "country_id": 879921427, "name": "Saskatchewan", "code": "SK", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 1005264686, "country_id": 879921427, "name": "Yukon", "code": "YT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}]}));

    await shopify.rest.Province.all({
      session: session,
      country_id: 879921427,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/countries/879921427/provinces.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"provinces": [{"id": 570891722, "country_id": 879921427, "name": "Prince Edward Island", "code": "PE", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.1, "tax_percentage": 10.0}, {"id": 670206421, "country_id": 879921427, "name": "Nunavut", "code": "NU", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 702530425, "country_id": 879921427, "name": "Ontario", "code": "ON", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 1005264686, "country_id": 879921427, "name": "Yukon", "code": "YT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}]}));

    await shopify.rest.Province.all({
      session: session,
      country_id: 879921427,
      since_id: "536137098",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/countries/879921427/provinces.json',
      query: 'since_id=536137098',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 13}));

    await shopify.rest.Province.count({
      session: session,
      country_id: 879921427,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/countries/879921427/provinces/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"province": {"id": 224293623, "country_id": 879921427, "name": "Quebec", "code": "QC", "tax_name": "HST", "tax_type": "compounded", "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}}));

    await shopify.rest.Province.find({
      session: session,
      country_id: 879921427,
      id: 224293623,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/countries/879921427/provinces/224293623.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"province": {"country_id": 879921427, "id": 224293623, "name": "Quebec", "code": "QC", "tax_name": "HST", "tax_type": "compounded", "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}}));

    const province = new shopify.rest.Province({session: session});
    province.country_id = 879921427;
    province.id = 224293623;
    province.tax = 0.09;
    await province.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-07/countries/879921427/provinces/224293623.json',
      query: '',
      headers,
      data: { "province": {"tax": 0.09} }
    }).toMatchMadeHttpRequest();
  });

});
