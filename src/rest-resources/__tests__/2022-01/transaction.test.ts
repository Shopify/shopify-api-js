import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Transaction} from '../../2022-01';

describe('Transaction resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Transaction.all({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Transaction.all({
      session: test_session,
      order_id: 450789469,
      since_id: "801038806",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions.json',
      query: 'since_id=801038806',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const transaction = new Transaction({session: test_session});
    transaction.order_id = 450789469;
    transaction.currency = "USD";
    transaction.amount = "10.00";
    transaction.kind = "capture";
    transaction.parent_id = 389404469;
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {currency: "USD", amount: "10.00", kind: "capture", parent_id: 389404469} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const transaction = new Transaction({session: test_session});
    transaction.order_id = 450789469;
    transaction.currency = "USD";
    transaction.amount = "10.00";
    transaction.kind = "void";
    transaction.parent_id = 389404469;
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {currency: "USD", amount: "10.00", kind: "void", parent_id: 389404469} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const transaction = new Transaction({session: test_session});
    transaction.order_id = 450789469;
    transaction.currency = "USD";
    transaction.amount = "10.00";
    transaction.kind = "capture";
    transaction.parent_id = 389404469;
    transaction.test = true;
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {currency: "USD", amount: "10.00", kind: "capture", parent_id: 389404469, test: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const transaction = new Transaction({session: test_session});
    transaction.order_id = 450789469;
    transaction.kind = "capture";
    transaction.authorization = "authorization-key";
    await transaction.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions.json',
      query: '',
      headers,
      data: { "transaction": {kind: "capture", authorization: "authorization-key"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Transaction.count({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Transaction.find({
      session: test_session,
      order_id: 450789469,
      id: 389404469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/transactions/389404469.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
