/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CustomerAddress} from '../../2022-07';

describe('CustomerAddress resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"addresses": [{"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}]}));

    await CustomerAddress.all({
      session: test_session,
      customer_id: 207119551,
      limit: "1",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/customers/207119551/addresses.json',
      query: 'limit=1',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"addresses": [{"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}]}));

    await CustomerAddress.all({
      session: test_session,
      customer_id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/customers/207119551/addresses.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"customer_address": {"id": 207119551, "customer_id": 207119551, "first_name": null, "last_name": null, "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}));

    await CustomerAddress.find({
      session: test_session,
      customer_id: 207119551,
      id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/customers/207119551/addresses/207119551.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"customer_address": {"customer_id": 207119551, "zip": "90210", "country": "United States", "province": "Kentucky", "city": "Louisville", "address1": "Chestnut Street 92", "address2": "", "first_name": null, "last_name": null, "company": null, "phone": "555-625-1199", "id": 207119551, "name": "", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}));

    const customer_address = new CustomerAddress({session: test_session});
    customer_address.customer_id = 207119551;
    customer_address.id = 207119551;
    customer_address.zip = "90210";
    await customer_address.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-07/customers/207119551/addresses/207119551.json',
      query: '',
      headers,
      data: { "address": {"zip": "90210"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerAddress.delete({
      session: test_session,
      customer_id: 207119551,
      id: 1053317293,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-07/customers/207119551/addresses/1053317293.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"customer_address": {"id": 1053317291, "customer_id": 207119551, "first_name": "Samuel", "last_name": "de Champlain", "company": "Fancy Co.", "address1": "1 Rue des Carrieres", "address2": "Suite 1234", "city": "Montreal", "province": "Quebec", "country": "Canada", "zip": "G1R 4P5", "phone": "819-555-5555", "name": "Samuel de Champlain", "province_code": "QC", "country_code": "CA", "country_name": "Canada", "default": false}}));

    const customer_address = new CustomerAddress({session: test_session});
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
      path: '/admin/api/2022-07/customers/207119551/addresses.json',
      query: '',
      headers,
      data: { "address": {"address1": "1 Rue des Carrieres", "address2": "Suite 1234", "city": "Montreal", "company": "Fancy Co.", "first_name": "Samuel", "last_name": "de Champlain", "phone": "819-555-5555", "province": "Quebec", "country": "Canada", "zip": "G1R 4P5", "name": "Samuel de Champlain", "province_code": "QC", "country_code": "CA", "country_name": "Canada"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer_address = new CustomerAddress({session: test_session});
    customer_address.customer_id = 207119551;
    await customer_address.set({
      address_ids: ["1053317292"],
      operation: "destroy",
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-07/customers/207119551/addresses/set.json',
      query: 'address_ids%5B%5D=1053317292&operation=destroy',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"customer_address": {"id": 1053317290, "customer_id": 207119551, "first_name": "Bob", "last_name": "Norman", "company": null, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "province": "Kentucky", "country": "United States", "zip": "40202", "phone": "555-625-1199", "name": "Bob Norman", "province_code": "KY", "country_code": "US", "country_name": "United States", "default": true}}));

    const customer_address = new CustomerAddress({session: test_session});
    customer_address.customer_id = 207119551;
    customer_address.id = 1053317290;
    await customer_address.default({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-07/customers/207119551/addresses/1053317290/default.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
