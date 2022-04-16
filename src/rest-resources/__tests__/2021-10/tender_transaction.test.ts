import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {TenderTransaction} from '../../2021-10';

describe('TenderTransaction resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"tender_transactions": [{"id": 1011222856, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}, {"id": 1011222855, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await TenderTransaction.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/tender_transactions.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"tender_transactions": [{"id": 1011222858, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await TenderTransaction.all({
      session: test_session,
      since_id: "1011222857",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/tender_transactions.json',
      query: 'since_id=1011222857',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"tender_transactions": [{"id": 1011222860, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await TenderTransaction.all({
      session: test_session,
      processed_at_min: "2005-08-06 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/tender_transactions.json',
      query: 'processed_at_min=2005-08-06+10%3A22%3A51+-0400',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"tender_transactions": [{"id": 1011222861, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await TenderTransaction.all({
      session: test_session,
      processed_at_max: "2005-08-06 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/tender_transactions.json',
      query: 'processed_at_max=2005-08-06+10%3A22%3A51+-0400',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"tender_transactions": [{"id": 1011222863, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await TenderTransaction.all({
      session: test_session,
      processed_at_max: "2005-08-05 10:22:51 -0400",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/tender_transactions.json',
      query: 'processed_at_max=2005-08-05+10%3A22%3A51+-0400',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"tender_transactions": [{"id": 1011222865, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-05T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}, {"id": 1011222866, "order_id": 450789469, "amount": "250.94", "currency": "USD", "user_id": null, "test": false, "processed_at": "2005-08-07T10:22:51-04:00", "remote_reference": "authorization-key", "payment_details": null, "payment_method": "unknown"}]}));

    await TenderTransaction.all({
      session: test_session,
      order: "processed_at ASC",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/tender_transactions.json',
      query: 'order=processed_at+ASC',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
