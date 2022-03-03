import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Dispute} from '../../2022-01';

describe('Dispute resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Dispute.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/shopify_payments/disputes.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Dispute.all({
      session: test_session,
      status: "won",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/shopify_payments/disputes.json',
      query: 'status=won',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Dispute.all({
      session: test_session,
      initiated_at: "2013-05-03",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/shopify_payments/disputes.json',
      query: 'initiated_at=2013-05-03',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Dispute.find({
      session: test_session,
      id: 598735659,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/shopify_payments/disputes/598735659.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
