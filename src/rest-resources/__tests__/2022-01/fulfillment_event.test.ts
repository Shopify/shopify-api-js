/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentEvent} from '../../2022-01';

describe('FulfillmentEvent resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_events": [{"id": 944956394, "fulfillment_id": 255858046, "status": "in_transit", "message": null, "happened_at": "2022-10-03T13:13:46-04:00", "city": null, "province": null, "country": null, "zip": null, "address1": null, "latitude": null, "longitude": null, "shop_id": 548380009, "created_at": "2022-10-03T13:13:46-04:00", "updated_at": "2022-10-03T13:13:46-04:00", "estimated_delivery_at": null, "order_id": 450789469, "admin_graphql_api_id": "gid://shopify/FulfillmentEvent/944956394"}]}));

    await FulfillmentEvent.all({
      session: test_session,
      order_id: 450789469,
      fulfillment_id: 255858046,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046/events.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_event": {"id": 944956392, "fulfillment_id": 255858046, "status": "in_transit", "message": null, "happened_at": "2022-10-03T13:13:41-04:00", "city": null, "province": null, "country": null, "zip": null, "address1": null, "latitude": null, "longitude": null, "shop_id": 548380009, "created_at": "2022-10-03T13:13:41-04:00", "updated_at": "2022-10-03T13:13:41-04:00", "estimated_delivery_at": null, "order_id": 450789469, "admin_graphql_api_id": "gid://shopify/FulfillmentEvent/944956392"}}));

    const fulfillment_event = new FulfillmentEvent({session: test_session});
    fulfillment_event.order_id = 450789469;
    fulfillment_event.fulfillment_id = 255858046;
    fulfillment_event.status = "in_transit";
    await fulfillment_event.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046/events.json',
      query: '',
      headers,
      data: { "event": {"status": "in_transit"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_event": {"id": 944956393, "fulfillment_id": 255858046, "status": "in_transit", "message": null, "happened_at": "2022-10-03T13:13:43-04:00", "city": null, "province": null, "country": null, "zip": null, "address1": null, "latitude": null, "longitude": null, "shop_id": 548380009, "created_at": "2022-10-03T13:13:43-04:00", "updated_at": "2022-10-03T13:13:43-04:00", "estimated_delivery_at": null, "order_id": 450789469, "admin_graphql_api_id": "gid://shopify/FulfillmentEvent/944956393"}}));

    await FulfillmentEvent.find({
      session: test_session,
      order_id: 450789469,
      fulfillment_id: 255858046,
      id: 944956393,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046/events/944956393.json',
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
      id: 944956391,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046/events/944956391.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
