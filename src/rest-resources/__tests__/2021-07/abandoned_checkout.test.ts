import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {AbandonedCheckout} from '../../2021-07';

describe('AbandonedCheckout resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AbandonedCheckout.checkouts({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AbandonedCheckout.checkouts({
      session: test_session,
      status: "closed",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: 'status=closed',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AbandonedCheckout.checkouts({
      session: test_session,
      created_at_max: "2013-10-12T07:05:27-02:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: 'created_at_max=2013-10-12T07%3A05%3A27-02%3A00',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AbandonedCheckout.checkouts({
      session: test_session,
      limit: "1",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: 'limit=1',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AbandonedCheckout.checkouts({
      session: test_session,
      status: "closed",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: 'status=closed',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AbandonedCheckout.checkouts({
      session: test_session,
      created_at_max: "2013-10-12T07:05:27-02:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: 'created_at_max=2013-10-12T07%3A05%3A27-02%3A00',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AbandonedCheckout.checkouts({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
