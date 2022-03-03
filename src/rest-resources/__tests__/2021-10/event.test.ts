import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Event} from '../../2021-10';

describe('Event resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
      created_at_min: "2008-01-10 12:30:00+00:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events.json',
      query: 'created_at_min=2008-01-10+12%3A30%3A00%2B00%3A00',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/orders/450789469/events.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
      order_id: 450789469,
      limit: "1",
      since_id: "164748010",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/orders/450789469/events.json',
      query: 'limit=1&since_id=164748010',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
      product_id: 921728736,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/products/921728736/events.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
      since_id: "164748010",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events.json',
      query: 'since_id=164748010',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
      filter: "Product,Order",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events.json',
      query: 'filter=Product%2COrder',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.all({
      session: test_session,
      filter: "Product",
      verb: "destroy",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events.json',
      query: 'filter=Product&verb=destroy',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.find({
      session: test_session,
      id: 677313116,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events/677313116.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.count({
      session: test_session,
      created_at_min: "2008-01-10T13:00:00+00:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events/count.json',
      query: 'created_at_min=2008-01-10T13%3A00%3A00%2B00%3A00',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Event.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/events/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
