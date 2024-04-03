/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2024-04';

describe('CustomerAddress resource', () => {
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

    queueMockResponse(JSON.stringify({"addresses": [{"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}]}));

    await shopify.rest.CustomerAddress.all({
      session: session,
      customer_id: 207119551,
      limit: "1",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses.json',
      query: 'limit=1',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"addresses": [{"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}]}));

    await shopify.rest.CustomerAddress.all({
      session: session,
      customer_id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_address": {"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}));

    await shopify.rest.CustomerAddress.find({
      session: session,
      customer_id: 207119551,
      id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses/207119551.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_address": {"customer_id": 207119551, "zip": "90210", "country": "United States", "province": "Kentucky", "city": "Louisville", "address1": "Chestnut Street 92", "address2": "", "first_name": null, "last_name": null, "company": null, "phone": "555-625-1199", "id": 207119551, "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}));

    const customer_address = new shopify.rest.CustomerAddress({session: session});
    customer_address.customer_id = 207119551;
    customer_address.id = 207119551;
    customer_address.zip = "90210";
    await customer_address.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses/207119551.json',
      query: '',
      headers,
      data: { "address": {"zip": "90210"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_address": {"customer_id": 207119551, "address1": "Apartment 23", "address2": "Chestnut Street 92", "country": "United States", "province": "Kentucky", "zip": "40202", "city": "Louisville", "first_name": null, "last_name": null, "company": null, "phone": "555-625-1199", "id": 207119551, "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}));

    const customer_address = new shopify.rest.CustomerAddress({session: session});
    customer_address.customer_id = 207119551;
    customer_address.id = 207119551;
    customer_address.address1 = "Apartment 23";
    customer_address.address2 = "Chestnut Street 92";
    await customer_address.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses/207119551.json',
      query: '',
      headers,
      data: { "address": {"address1": "Apartment 23", "address2": "Chestnut Street 92"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.CustomerAddress.delete({
      session: session,
      customer_id: 207119551,
      id: 1053317322,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses/1053317322.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_address": {"id": 1053317323, "customer_id": 207119551, "first_name": "Samuel", "last_name": "de Champlain", "company": "Fancy Co.", "address1": "1 Rue des Carrieres", "address2": "Suite 1234", "city": "Montreal", "province": "Quebec", "country": "Canada", "zip": "G1R 4P5", "phone": "819-555-5555", "name": "Samuel de Champlain", "province_code": "QC", "country_code": "CA", "country_name": "Canada", "default": false}}));

    const customer_address = new shopify.rest.CustomerAddress({session: session});
    customer_address.customer_id = 207119551;
    customer_address.address1 = "1 Rue des Carrieres";
    customer_address.address2 = "Suite 1234";
    customer_address.city = "Montreal";
    customer_address.company = "Fancy Co.";
    customer_address.first_name = "Samuel";
    customer_address.last_name = "de Champlain";
    customer_address.phone = "819-555-5555";
    customer_address.province = "Quebec";
    customer_address.country = "Canada";
    customer_address.zip = "G1R 4P5";
    customer_address.name = "Samuel de Champlain";
    customer_address.province_code = "QC";
    customer_address.country_code = "CA";
    customer_address.country_name = "Canada";
    await customer_address.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses.json',
      query: '',
      headers,
      data: { "address": {"address1": "1 Rue des Carrieres", "address2": "Suite 1234", "city": "Montreal", "company": "Fancy Co.", "first_name": "Samuel", "last_name": "de Champlain", "phone": "819-555-5555", "province": "Quebec", "country": "Canada", "zip": "G1R 4P5", "name": "Samuel de Champlain", "province_code": "QC", "country_code": "CA", "country_name": "Canada"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    const customer_address = new shopify.rest.CustomerAddress({session: session});
    customer_address.customer_id = 207119551;
    await customer_address.set({
      address_ids: ["1053317321"],
      operation: "destroy",
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses/set.json',
      query: 'address_ids%5B%5D=1053317321&operation=destroy',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"customer_address": {"id": 1053317320, "customer_id": 207119551, "first_name": "Bob", "last_name": "Norman", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "Bob Norman", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}));

    const customer_address = new shopify.rest.CustomerAddress({session: session});
    customer_address.customer_id = 207119551;
    customer_address.id = 1053317320;
    await customer_address.default({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2024-04/customers/207119551/addresses/1053317320/default.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
