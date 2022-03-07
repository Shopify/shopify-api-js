import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Customer} from '../../2021-10';

describe('Customer resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.all({
      session: test_session,
      since_id: "207119551",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: 'since_id=207119551',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.all({
      session: test_session,
      updated_at_min: "2022-02-02 21:51:21",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: 'updated_at_min=2022-02-02+21%3A51%3A21',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.all({
      session: test_session,
      ids: "207119551,1073339489",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: 'ids=207119551%2C1073339489',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.first_name = "Steve";
    customer.last_name = "Lastnameson";
    customer.email = "steve.lastnameson@example.com";
    customer.phone = " 15142546011";
    customer.verified_email = true;
    customer.addresses = [
      {
        address1: "123 Oak St",
        city: "Ottawa",
        province: "ON",
        phone: "555-1212",
        zip: "123 ABC",
        last_name: "Lastnameson",
        first_name: "Mother",
        country: "CA"
      }
    ];
    customer.password = "newpass";
    customer.password_confirmation = "newpass";
    customer.send_email_welcome = false;
    await customer.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: '',
      headers,
      data: { "customer": {first_name: "Steve", last_name: "Lastnameson", email: "steve.lastnameson@example.com", phone: " 15142546011", verified_email: true, addresses: [{address1: "123 Oak St", city: "Ottawa", province: "ON", phone: "555-1212", zip: "123 ABC", last_name: "Lastnameson", first_name: "Mother", country: "CA"}], password: "newpass", password_confirmation: "newpass", send_email_welcome: false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.first_name = "Steve";
    customer.last_name = "Lastnameson";
    customer.email = "steve.lastnameson@example.com";
    customer.phone = " 15142546011";
    customer.verified_email = true;
    customer.addresses = [
      {
        address1: "123 Oak St",
        city: "Ottawa",
        province: "ON",
        phone: "555-1212",
        zip: "123 ABC",
        last_name: "Lastnameson",
        first_name: "Mother",
        country: "CA"
      }
    ];
    await customer.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: '',
      headers,
      data: { "customer": {first_name: "Steve", last_name: "Lastnameson", email: "steve.lastnameson@example.com", phone: " 15142546011", verified_email: true, addresses: [{address1: "123 Oak St", city: "Ottawa", province: "ON", phone: "555-1212", zip: "123 ABC", last_name: "Lastnameson", first_name: "Mother", country: "CA"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.first_name = "Steve";
    customer.last_name = "Lastnameson";
    customer.email = "steve.lastnameson@example.com";
    customer.phone = " 15142546011";
    customer.verified_email = true;
    customer.addresses = [
      {
        address1: "123 Oak St",
        city: "Ottawa",
        province: "ON",
        phone: "555-1212",
        zip: "123 ABC",
        last_name: "Lastnameson",
        first_name: "Mother",
        country: "CA"
      }
    ];
    customer.metafields = [
      {
        key: "new",
        value: "newvalue",
        value_type: "string",
        namespace: "global"
      }
    ];
    await customer.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: '',
      headers,
      data: { "customer": {first_name: "Steve", last_name: "Lastnameson", email: "steve.lastnameson@example.com", phone: " 15142546011", verified_email: true, addresses: [{address1: "123 Oak St", city: "Ottawa", province: "ON", phone: "555-1212", zip: "123 ABC", last_name: "Lastnameson", first_name: "Mother", country: "CA"}], metafields: [{key: "new", value: "newvalue", value_type: "string", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.first_name = "Steve";
    customer.last_name = "Lastnameson";
    customer.email = "steve.lastnameson@example.com";
    customer.phone = " 15142546011";
    customer.verified_email = true;
    customer.addresses = [
      {
        address1: "123 Oak St",
        city: "Ottawa",
        province: "ON",
        phone: "555-1212",
        zip: "123 ABC",
        last_name: "Lastnameson",
        first_name: "Mother",
        country: "CA"
      }
    ];
    customer.send_email_invite = true;
    await customer.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/customers.json',
      query: '',
      headers,
      data: { "customer": {first_name: "Steve", last_name: "Lastnameson", email: "steve.lastnameson@example.com", phone: " 15142546011", verified_email: true, addresses: [{address1: "123 Oak St", city: "Ottawa", province: "ON", phone: "555-1212", zip: "123 ABC", last_name: "Lastnameson", first_name: "Mother", country: "CA"}], send_email_invite: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.search({
      session: test_session,
      query: "Bob country:United States",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers/search.json',
      query: 'query=Bob+country%3AUnited+States',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.find({
      session: test_session,
      id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers/207119551.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.id = 207119551;
    customer.email = "changed@email.address.com";
    customer.note = "Customer is a great guy";
    await customer.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/customers/207119551.json',
      query: '',
      headers,
      data: { "customer": {id: 207119551, email: "changed@email.address.com", note: "Customer is a great guy"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.id = 207119551;
    customer.metafields = [
      {
        key: "new",
        value: "newvalue",
        value_type: "string",
        namespace: "global"
      }
    ];
    await customer.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/customers/207119551.json',
      query: '',
      headers,
      data: { "customer": {id: 207119551, metafields: [{key: "new", value: "newvalue", value_type: "string", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.id = 207119551;
    customer.tags = "New Customer, Repeat Customer";
    await customer.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/customers/207119551.json',
      query: '',
      headers,
      data: { "customer": {id: 207119551, tags: "New Customer, Repeat Customer"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.id = 207119551;
    customer.accepts_marketing = true;
    customer.accepts_marketing_updated_at = "2022-01-31T16:45:55-05:00";
    customer.marketing_opt_in_level = "confirmed_opt_in";
    await customer.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/customers/207119551.json',
      query: '',
      headers,
      data: { "customer": {id: 207119551, accepts_marketing: true, accepts_marketing_updated_at: "2022-01-31T16:45:55-05:00", marketing_opt_in_level: "confirmed_opt_in"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.id = 207119551;
    await customer.account_activation_url({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/customers/207119551/account_activation_url.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_16', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.id = 207119551;
    await customer.send_invite({
      body: {customer_invite: {}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/customers/207119551/send_invite.json',
      query: '',
      headers,
      data: {customer_invite: {}}
    }).toMatchMadeHttpRequest();
  });

  it('test_17', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer = new Customer({session: test_session});
    customer.id = 207119551;
    await customer.send_invite({
      body: {customer_invite: {to: "new_test_email@shopify.com", from: "j.limited@example.com", bcc: ["j.limited@example.com"], subject: "Welcome to my new shop", custom_message: "My awesome new store"}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/customers/207119551/send_invite.json',
      query: '',
      headers,
      data: {customer_invite: {to: "new_test_email@shopify.com", from: "j.limited@example.com", bcc: ["j.limited@example.com"], subject: "Welcome to my new shop", custom_message: "My awesome new store"}}
    }).toMatchMadeHttpRequest();
  });

  it('test_18', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Customer.orders({
      session: test_session,
      id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/customers/207119551/orders.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
