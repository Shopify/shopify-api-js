import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CustomerAddress} from '../../2021-10';

describe('CustomerAddress resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerAddress.all({
      session: test_session,
      customer_id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers/207119551/addresses.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerAddress.all({
      session: test_session,
      customer_id: 207119551,
      limit: "1",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers/207119551/addresses.json',
      query: 'limit=1',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

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
      path: '/admin/api/2021-10/customers/207119551/addresses.json',
      query: '',
      headers,
      data: { "address": {address1: "1 Rue des Carrieres", address2: "Suite 1234", city: "Montreal", company: "Fancy Co.", first_name: "Samuel", last_name: "de Champlain", phone: "819-555-5555", province: "Quebec", country: "Canada", zip: "G1R 4P5", name: "Samuel de Champlain", province_code: "QC", country_code: "CA", country_name: "Canada"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerAddress.find({
      session: test_session,
      customer_id: 207119551,
      id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers/207119551/addresses/207119551.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer_address = new CustomerAddress({session: test_session});
    customer_address.customer_id = 207119551;
    customer_address.id = 207119551;
    customer_address.zip = "90210";
    await customer_address.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/customers/207119551/addresses/207119551.json',
      query: '',
      headers,
      data: { "address": {id: 207119551, zip: "90210"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerAddress.delete({
      session: test_session,
      customer_id: 207119551,
      id: 1053317335,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-10/customers/207119551/addresses/1053317335.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer_address = new CustomerAddress({session: test_session});
    customer_address.customer_id = 207119551;
    await customer_address.set({
      address_ids: ["1053317336"],
      operation: "destroy",
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/customers/207119551/addresses/set.json',
      query: 'address_ids%5B%5D=1053317336&operation=destroy',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer_address = new CustomerAddress({session: test_session});
    customer_address.customer_id = 207119551;
    customer_address.id = 1053317337;
    await customer_address.default({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/customers/207119551/addresses/1053317337/default.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
