import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentRequest} from '../../2021-10';

describe('FulfillmentRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000840;
    fulfillment_request.message = "Fulfill this ASAP please.";
    fulfillment_request.fulfillment_order_line_items = [
      {
        id: 1058737578,
        quantity: 1
      },
      {
        id: 1058737579,
        quantity: 1
      }
    ];
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000840/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {message: "Fulfill this ASAP please.", fulfillment_order_line_items: [{id: 1058737578, quantity: 1}, {id: 1058737579, quantity: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000843;
    fulfillment_request.message = "Fulfill this ASAP please.";
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000843/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {message: "Fulfill this ASAP please."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000844;
    await fulfillment_request.accept({
      body: {fulfillment_request: {message: "We will start processing your fulfillment on the next business day."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000844/fulfillment_request/accept.json',
      query: '',
      headers,
      data: { "fulfillment_request": {message: "We will start processing your fulfillment on the next business day."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000845;
    await fulfillment_request.reject({
      body: {fulfillment_request: {message: "Not enough inventory on hand to complete the work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000845/fulfillment_request/reject.json',
      query: '',
      headers,
      data: { "fulfillment_request": {message: "Not enough inventory on hand to complete the work."} }
    }).toMatchMadeHttpRequest();
  });

});
