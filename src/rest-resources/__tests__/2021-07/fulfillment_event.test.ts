import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentEvent} from '../../2021-07';

describe('FulfillmentEvent resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await FulfillmentEvent.all({
      session: test_session,
      order_id: 450789469,
      fulfillment_id: 255858046,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders/450789469/fulfillments/255858046/events.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment_event = new FulfillmentEvent({session: test_session});
    fulfillment_event.order_id = 450789469;
    fulfillment_event.fulfillment_id = 255858046;
    fulfillment_event.status = "in_transit";
    await fulfillment_event.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders/450789469/fulfillments/255858046/events.json',
      query: '',
      headers,
      data: { "event": {status: "in_transit"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await FulfillmentEvent.find({
      session: test_session,
      order_id: 450789469,
      fulfillment_id: 255858046,
      id: 944956395,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders/450789469/fulfillments/255858046/events/944956395.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await FulfillmentEvent.delete({
      session: test_session,
      order_id: 450789469,
      fulfillment_id: 255858046,
      id: 944956397,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/orders/450789469/fulfillments/255858046/events/944956397.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
