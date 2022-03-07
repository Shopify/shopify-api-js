import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Refund} from '../../2021-10';

describe('Refund resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Refund.all({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/orders/450789469/refunds.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    refund.currency = "USD";
    refund.notify = true;
    refund.note = "wrong size";
    refund.shipping = {
      full_refund: true
    };
    refund.refund_line_items = [
      {
        line_item_id: 518995019,
        quantity: 1,
        restock_type: "return",
        location_id: 487838322
      }
    ];
    refund.transactions = [
      {
        parent_id: 801038806,
        amount: 41.94,
        kind: "refund",
        gateway: "bogus"
      }
    ];
    await refund.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/orders/450789469/refunds.json',
      query: '',
      headers,
      data: { "refund": {currency: "USD", notify: true, note: "wrong size", shipping: {full_refund: true}, refund_line_items: [{line_item_id: 518995019, quantity: 1, restock_type: "return", location_id: 487838322}], transactions: [{parent_id: 801038806, amount: 41.94, kind: "refund", gateway: "bogus"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    refund.currency = "USD";
    refund.shipping = {
      amount: 5.0
    };
    refund.transactions = [
      {
        parent_id: 801038806,
        amount: 5.0,
        kind: "refund",
        gateway: "bogus"
      }
    ];
    await refund.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/orders/450789469/refunds.json',
      query: '',
      headers,
      data: { "refund": {currency: "USD", shipping: {amount: 5.0}, transactions: [{parent_id: 801038806, amount: 5.0, kind: "refund", gateway: "bogus"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Refund.find({
      session: test_session,
      order_id: 450789469,
      id: 509562969,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/orders/450789469/refunds/509562969.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    await refund.calculate({
      body: {refund: {shipping: {full_refund: true}, refund_line_items: [{line_item_id: 518995019, quantity: 1, restock_type: "no_restock"}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/orders/450789469/refunds/calculate.json',
      query: '',
      headers,
      data: { "refund": {shipping: {full_refund: true}, refund_line_items: [{line_item_id: 518995019, quantity: 1, restock_type: "no_restock"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    await refund.calculate({
      body: {refund: {currency: "USD", shipping: {full_refund: true}, refund_line_items: [{line_item_id: 518995019, quantity: 1, restock_type: "no_restock"}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/orders/450789469/refunds/calculate.json',
      query: '',
      headers,
      data: { "refund": {currency: "USD", shipping: {full_refund: true}, refund_line_items: [{line_item_id: 518995019, quantity: 1, restock_type: "no_restock"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const refund = new Refund({session: test_session});
    refund.order_id = 450789469;
    await refund.calculate({
      body: {refund: {currency: "USD", shipping: {amount: 2.0}}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/orders/450789469/refunds/calculate.json',
      query: '',
      headers,
      data: { "refund": {currency: "USD", shipping: {amount: 2.0}} }
    }).toMatchMadeHttpRequest();
  });

});
