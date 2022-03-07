import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {TenderTransaction} from '../../2021-07';

describe('TenderTransaction resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await TenderTransaction.all({
      session: test_session,
      processed_at_max: "2005-08-05 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/tender_transactions.json',
      query: 'processed_at_max=2005-08-05+10%3A22%3A51+-0400',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await TenderTransaction.all({
      session: test_session,
      order: "processed_at ASC",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/tender_transactions.json',
      query: 'order=processed_at+ASC',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await TenderTransaction.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/tender_transactions.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await TenderTransaction.all({
      session: test_session,
      since_id: "1011222896",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/tender_transactions.json',
      query: 'since_id=1011222896',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await TenderTransaction.all({
      session: test_session,
      processed_at_min: "2005-08-06 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/tender_transactions.json',
      query: 'processed_at_min=2005-08-06+10%3A22%3A51+-0400',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await TenderTransaction.all({
      session: test_session,
      processed_at_max: "2005-08-06 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/tender_transactions.json',
      query: 'processed_at_max=2005-08-06+10%3A22%3A51+-0400',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
