import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Payment} from '../../2021-07';

describe('Payment resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const payment = new Payment({session: test_session});
    payment.checkout_id = "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x";
    payment.request_details = {
      ip_address: "123.1.1.1",
      accept_language: "en-US,en;q=0.8,fr;q=0.6",
      user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"
    };
    payment.amount = "398.00";
    payment.session_id = "global-4f10a3a42a3b4d41";
    payment.unique_token = "client-side-idempotency-token";
    await payment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments.json',
      query: '',
      headers,
      data: { "payment": {request_details: {ip_address: "123.1.1.1", accept_language: "en-US,en;q=0.8,fr;q=0.6", user_agent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36"}, amount: "398.00", session_id: "global-4f10a3a42a3b4d41", unique_token: "client-side-idempotency-token"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Payment.all({
      session: test_session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Payment.find({
      session: test_session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
      id: 25428999,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments/25428999.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Payment.find({
      session: test_session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
      id: 25428999,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments/25428999.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Payment.count({
      session: test_session,
      checkout_id: "7yjf4v2we7gamku6a6h7tvm8h3mmvs4x",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/checkouts/7yjf4v2we7gamku6a6h7tvm8h3mmvs4x/payments/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
