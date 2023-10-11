/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('FulfillmentEvent resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_events": [{"id": 944956393, "fulfillment_id": 255858046, "status": "in_transit", "message": null, "happened_at": "2023-10-03T13:33:36-04:00", "city": null, "province": null, "country": null, "zip": null, "address1": null, "latitude": null, "longitude": null, "shop_id": 548380009, "created_at": "2023-10-03T13:33:36-04:00", "updated_at": "2023-10-03T13:33:36-04:00", "estimated_delivery_at": null, "order_id": 450789469, "admin_graphql_api_id": "gid://shopify/FulfillmentEvent/944956393"}]}));

    await shopify.rest.FulfillmentEvent.all({
      session: session,
      order_id: 450789469,
      fulfillment_id: 255858046,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/fulfillments/255858046/events.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_event": {"id": 944956392, "fulfillment_id": 255858046, "status": "in_transit", "message": null, "happened_at": "2023-10-03T13:33:36-04:00", "city": null, "province": null, "country": null, "zip": null, "address1": null, "latitude": null, "longitude": null, "shop_id": 548380009, "created_at": "2023-10-03T13:33:36-04:00", "updated_at": "2023-10-03T13:33:36-04:00", "estimated_delivery_at": null, "order_id": 450789469, "admin_graphql_api_id": "gid://shopify/FulfillmentEvent/944956392"}}));

    const fulfillment_event = new shopify.rest.FulfillmentEvent({session: session});
    fulfillment_event.order_id = 450789469;
    fulfillment_event.fulfillment_id = 255858046;
    fulfillment_event.status = "in_transit";
    await fulfillment_event.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/fulfillments/255858046/events.json',
      query: '',
      headers,
      data: { "event": {"status": "in_transit"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_event": {"id": 944956394, "fulfillment_id": 255858046, "status": "in_transit", "message": null, "happened_at": "2023-10-03T13:33:36-04:00", "city": null, "province": null, "country": null, "zip": null, "address1": null, "latitude": null, "longitude": null, "shop_id": 548380009, "created_at": "2023-10-03T13:33:36-04:00", "updated_at": "2023-10-03T13:33:36-04:00", "estimated_delivery_at": null, "order_id": 450789469, "admin_graphql_api_id": "gid://shopify/FulfillmentEvent/944956394"}}));

    await shopify.rest.FulfillmentEvent.find({
      session: session,
      order_id: 450789469,
      fulfillment_id: 255858046,
      id: 944956394,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/fulfillments/255858046/events/944956394.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.FulfillmentEvent.delete({
      session: session,
      order_id: 450789469,
      fulfillment_id: 255858046,
      id: 944956391,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/orders/450789469/fulfillments/255858046/events/944956391.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
