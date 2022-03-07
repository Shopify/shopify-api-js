import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Checkout} from '../../2021-10';

describe('Checkout resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const checkout = new Checkout({session: test_session});
    checkout.line_items = [
      {
        variant_id: 39072856,
        quantity: 5
      }
    ];
    await checkout.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/checkouts.json',
      query: '',
      headers,
      data: { "checkout": {line_items: [{variant_id: 39072856, quantity: 5}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const checkout = new Checkout({session: test_session});
    checkout.email = "me@example.com";
    await checkout.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/checkouts.json',
      query: '',
      headers,
      data: { "checkout": {email: "me@example.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const checkout = new Checkout({session: test_session});
    checkout.token = "b490a9220cd14d7344024f4874f640a6";
    await checkout.complete({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/checkouts/b490a9220cd14d7344024f4874f640a6/complete.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Checkout.find({
      session: test_session,
      token: "bd5a8aa1ecd019dd3520ff791ee3a24c",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/checkouts/bd5a8aa1ecd019dd3520ff791ee3a24c.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Checkout.find({
      session: test_session,
      token: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Checkout.find({
      session: test_session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const checkout = new Checkout({session: test_session});
    checkout.token = "exuw7apwoycchjuwtiqg8nytfhphr62a";
    checkout.email = "john.smith@example.com";
    checkout.shipping_address = {
      first_name: "John",
      last_name: "Smith",
      address1: "126 York St.",
      city: "Los Angeles",
      province_code: "CA",
      country_code: "US",
      phone: "(123)456-7890",
      zip: "90002"
    };
    await checkout.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: { "checkout": {token: "exuw7apwoycchjuwtiqg8nytfhphr62a", email: "john.smith@example.com", shipping_address: {first_name: "John", last_name: "Smith", address1: "126 York St.", city: "Los Angeles", province_code: "CA", country_code: "US", phone: "(123)456-7890", zip: "90002"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const checkout = new Checkout({session: test_session});
    checkout.token = "exuw7apwoycchjuwtiqg8nytfhphr62a";
    checkout.shipping_line = {
      handle: "shopify-Free Shipping-0.00"
    };
    await checkout.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a.json',
      query: '',
      headers,
      data: { "checkout": {token: "exuw7apwoycchjuwtiqg8nytfhphr62a", shipping_line: {handle: "shopify-Free Shipping-0.00"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Checkout.shipping_rates({
      session: test_session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a/shipping_rates.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Checkout.shipping_rates({
      session: test_session,
      token: "exuw7apwoycchjuwtiqg8nytfhphr62a",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/checkouts/exuw7apwoycchjuwtiqg8nytfhphr62a/shipping_rates.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Checkout.shipping_rates({
      session: test_session,
      token: "zs9ru89kuqcdagk8bz4r9hnxt22wwd42",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/checkouts/zs9ru89kuqcdagk8bz4r9hnxt22wwd42/shipping_rates.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
