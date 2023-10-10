/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-10';

describe('Country resource', () => {
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
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"countries": [{"id": 879921427, "name": "Canada", "code": "CA", "tax_name": "GST", "tax": 0.05, "provinces": [{"id": 205434194, "country_id": 879921427, "name": "Alberta", "code": "AB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 170405627, "country_id": 879921427, "name": "British Columbia", "code": "BC", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 342345110, "country_id": 879921427, "name": "Manitoba", "code": "MB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 92264567, "country_id": 879921427, "name": "New Brunswick", "code": "NB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 243284171, "country_id": 879921427, "name": "Newfoundland", "code": "NL", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 439598329, "country_id": 879921427, "name": "Northwest Territories", "code": "NT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 448070559, "country_id": 879921427, "name": "Nova Scotia", "code": "NS", "tax_name": null, "tax_type": "harmonized", "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 670206421, "country_id": 879921427, "name": "Nunavut", "code": "NU", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 702530425, "country_id": 879921427, "name": "Ontario", "code": "ON", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 570891722, "country_id": 879921427, "name": "Prince Edward Island", "code": "PE", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.1, "tax_percentage": 10.0}, {"id": 224293623, "country_id": 879921427, "name": "Quebec", "code": "QC", "tax_name": "HST", "tax_type": "compounded", "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 473391800, "country_id": 879921427, "name": "Saskatchewan", "code": "SK", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 1005264686, "country_id": 879921427, "name": "Yukon", "code": "YT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}]}, {"id": 359115488, "name": "Colombia", "code": "CO", "tax_name": "VAT", "tax": 0.15, "provinces": []}, {"id": 817138619, "name": "United States", "code": "US", "tax_name": "Federal Tax", "tax": 0.0, "provinces": [{"id": 952629862, "country_id": 817138619, "name": "California", "code": "CA", "tax_name": null, "tax_type": null, "shipping_zone_id": 1039932365, "tax": 0.05, "tax_percentage": 5.0}, {"id": 222234158, "country_id": 817138619, "name": "Kentucky", "code": "KY", "tax_name": null, "tax_type": null, "shipping_zone_id": 1039932365, "tax": 0.06, "tax_percentage": 6.0}, {"id": 9350860, "country_id": 817138619, "name": "Massachusetts", "code": "MA", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.065, "tax_percentage": 6.5}, {"id": 696485510, "country_id": 817138619, "name": "Minnesota", "code": "MN", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.065, "tax_percentage": 6.5}, {"id": 753050225, "country_id": 817138619, "name": "New Jersey", "code": "NJ", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.06, "tax_percentage": 6.0}, {"id": 1013111685, "country_id": 817138619, "name": "New York", "code": "NY", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.04, "tax_percentage": 4.0}, {"id": 915134533, "country_id": 817138619, "name": "Pennsylvania", "code": "PA", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.05, "tax_percentage": 5.0}, {"id": 591478044, "country_id": 817138619, "name": "Rhode Island", "code": "RI", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}]}]}));

    await shopify.rest.Country.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/countries.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"countries": [{"id": 817138619, "name": "United States", "code": "US", "tax_name": "Federal Tax", "tax": 0.0, "provinces": [{"id": 952629862, "country_id": 817138619, "name": "California", "code": "CA", "tax_name": null, "tax_type": null, "shipping_zone_id": 1039932365, "tax": 0.05, "tax_percentage": 5.0}, {"id": 222234158, "country_id": 817138619, "name": "Kentucky", "code": "KY", "tax_name": null, "tax_type": null, "shipping_zone_id": 1039932365, "tax": 0.06, "tax_percentage": 6.0}, {"id": 9350860, "country_id": 817138619, "name": "Massachusetts", "code": "MA", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.065, "tax_percentage": 6.5}, {"id": 696485510, "country_id": 817138619, "name": "Minnesota", "code": "MN", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.065, "tax_percentage": 6.5}, {"id": 753050225, "country_id": 817138619, "name": "New Jersey", "code": "NJ", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.06, "tax_percentage": 6.0}, {"id": 1013111685, "country_id": 817138619, "name": "New York", "code": "NY", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.04, "tax_percentage": 4.0}, {"id": 915134533, "country_id": 817138619, "name": "Pennsylvania", "code": "PA", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.05, "tax_percentage": 5.0}, {"id": 591478044, "country_id": 817138619, "name": "Rhode Island", "code": "RI", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}]}, {"id": 879921427, "name": "Canada", "code": "CA", "tax_name": "GST", "tax": 0.05, "provinces": [{"id": 205434194, "country_id": 879921427, "name": "Alberta", "code": "AB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 170405627, "country_id": 879921427, "name": "British Columbia", "code": "BC", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 342345110, "country_id": 879921427, "name": "Manitoba", "code": "MB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 92264567, "country_id": 879921427, "name": "New Brunswick", "code": "NB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 243284171, "country_id": 879921427, "name": "Newfoundland", "code": "NL", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 439598329, "country_id": 879921427, "name": "Northwest Territories", "code": "NT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 448070559, "country_id": 879921427, "name": "Nova Scotia", "code": "NS", "tax_name": null, "tax_type": "harmonized", "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 670206421, "country_id": 879921427, "name": "Nunavut", "code": "NU", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 702530425, "country_id": 879921427, "name": "Ontario", "code": "ON", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 570891722, "country_id": 879921427, "name": "Prince Edward Island", "code": "PE", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.1, "tax_percentage": 10.0}, {"id": 224293623, "country_id": 879921427, "name": "Quebec", "code": "QC", "tax_name": "HST", "tax_type": "compounded", "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 473391800, "country_id": 879921427, "name": "Saskatchewan", "code": "SK", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 1005264686, "country_id": 879921427, "name": "Yukon", "code": "YT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}]}]}));

    await shopify.rest.Country.all({
      session: session,
      since_id: "359115488",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/countries.json',
      query: 'since_id=359115488',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"country": {"id": 1070231511, "name": "France", "code": "FR", "tax_name": "TVA", "tax": 0.2, "provinces": []}}));

    const country = new shopify.rest.Country({session: session});
    country.code = "FR";
    await country.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-10/countries.json',
      query: '',
      headers,
      data: { "country": {"code": "FR"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"country": {"id": 1070231512, "name": "France", "code": "FR", "tax_name": "TVA", "tax": 0.2, "provinces": []}}));

    const country = new shopify.rest.Country({session: session});
    country.code = "FR";
    country.tax = 0.2;
    await country.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-10/countries.json',
      query: '',
      headers,
      data: { "country": {"code": "FR", "tax": 0.2} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.Country.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/countries/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"country": {"id": 879921427, "name": "Canada", "code": "CA", "tax_name": "GST", "tax": 0.05, "provinces": [{"id": 205434194, "country_id": 879921427, "name": "Alberta", "code": "AB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 170405627, "country_id": 879921427, "name": "British Columbia", "code": "BC", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 342345110, "country_id": 879921427, "name": "Manitoba", "code": "MB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"id": 92264567, "country_id": 879921427, "name": "New Brunswick", "code": "NB", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 243284171, "country_id": 879921427, "name": "Newfoundland", "code": "NL", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 439598329, "country_id": 879921427, "name": "Northwest Territories", "code": "NT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 448070559, "country_id": 879921427, "name": "Nova Scotia", "code": "NS", "tax_name": null, "tax_type": "harmonized", "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"id": 670206421, "country_id": 879921427, "name": "Nunavut", "code": "NU", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"id": 702530425, "country_id": 879921427, "name": "Ontario", "code": "ON", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"id": 570891722, "country_id": 879921427, "name": "Prince Edward Island", "code": "PE", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.1, "tax_percentage": 10.0}, {"id": 224293623, "country_id": 879921427, "name": "Quebec", "code": "QC", "tax_name": "HST", "tax_type": "compounded", "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 473391800, "country_id": 879921427, "name": "Saskatchewan", "code": "SK", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"id": 1005264686, "country_id": 879921427, "name": "Yukon", "code": "YT", "tax_name": null, "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}]}}));

    await shopify.rest.Country.find({
      session: session,
      id: 879921427,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/countries/879921427.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"country": {"id": 879921427, "name": "Canada", "code": "CA", "tax_name": "GST", "tax": 0.05, "provinces": [{"country_id": 879921427, "tax_name": "Tax", "id": 205434194, "name": "Alberta", "code": "AB", "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 170405627, "name": "British Columbia", "code": "BC", "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 342345110, "name": "Manitoba", "code": "MB", "tax_type": null, "shipping_zone_id": null, "tax": 0.07, "tax_percentage": 7.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 92264567, "name": "New Brunswick", "code": "NB", "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 243284171, "name": "Newfoundland", "code": "NL", "tax_type": null, "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 439598329, "name": "Northwest Territories", "code": "NT", "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 448070559, "name": "Nova Scotia", "code": "NS", "tax_type": "harmonized", "shipping_zone_id": null, "tax": 0.15, "tax_percentage": 15.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 670206421, "name": "Nunavut", "code": "NU", "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 702530425, "name": "Ontario", "code": "ON", "tax_type": null, "shipping_zone_id": null, "tax": 0.08, "tax_percentage": 8.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 570891722, "name": "Prince Edward Island", "code": "PE", "tax_type": null, "shipping_zone_id": null, "tax": 0.1, "tax_percentage": 10.0}, {"id": 224293623, "country_id": 879921427, "name": "Quebec", "code": "QC", "tax_name": "HST", "tax_type": "compounded", "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 473391800, "name": "Saskatchewan", "code": "SK", "tax_type": null, "shipping_zone_id": null, "tax": 0.09, "tax_percentage": 9.0}, {"country_id": 879921427, "tax_name": "Tax", "id": 1005264686, "name": "Yukon", "code": "YT", "tax_type": null, "shipping_zone_id": null, "tax": 0.0, "tax_percentage": 0.0}]}}));

    const country = new shopify.rest.Country({session: session});
    country.id = 879921427;
    country.tax = 0.05;
    await country.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-10/countries/879921427.json',
      query: '',
      headers,
      data: { "country": {"tax": 0.05} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Country.delete({
      session: session,
      id: 879921427,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-10/countries/879921427.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
