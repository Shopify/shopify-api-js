/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-01';

describe('FulfillmentService resource', () => {
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
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_services": [{"id": 611870435, "name": "Venus Fulfillment", "email": null, "service_name": "Venus Fulfillment", "handle": "venus-fulfillment", "fulfillment_orders_opt_in": false, "include_pending_stock": false, "provider_id": null, "location_id": 611870435, "callback_url": null, "tracking_support": true, "inventory_management": true, "admin_graphql_api_id": "gid://shopify/ApiFulfillmentService/611870435"}, {"id": 755357713, "name": "Mars Fulfillment", "email": null, "service_name": "Mars Fulfillment", "handle": "mars-fulfillment", "fulfillment_orders_opt_in": true, "include_pending_stock": false, "provider_id": null, "location_id": 24826418, "callback_url": "http://google.com/", "tracking_support": true, "inventory_management": true, "admin_graphql_api_id": "gid://shopify/ApiFulfillmentService/755357713"}]}));

    await shopify.rest.FulfillmentService.all({
      session: session,
      scope: "all",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/fulfillment_services.json',
      query: 'scope=all',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_services": [{"id": 755357713, "name": "Mars Fulfillment", "email": null, "service_name": "Mars Fulfillment", "handle": "mars-fulfillment", "fulfillment_orders_opt_in": true, "include_pending_stock": false, "provider_id": null, "location_id": 24826418, "callback_url": "http://google.com/", "tracking_support": true, "inventory_management": true, "admin_graphql_api_id": "gid://shopify/ApiFulfillmentService/755357713"}]}));

    await shopify.rest.FulfillmentService.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/fulfillment_services.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_service": {"id": 1061774488, "name": "Jupiter Fulfillment", "email": null, "service_name": "Jupiter Fulfillment", "handle": "jupiter-fulfillment", "fulfillment_orders_opt_in": true, "include_pending_stock": false, "provider_id": null, "location_id": 1072404545, "callback_url": "http://google.com/", "tracking_support": true, "inventory_management": true, "admin_graphql_api_id": "gid://shopify/ApiFulfillmentService/1061774488", "permits_sku_sharing": true}}));

    const fulfillment_service = new shopify.rest.FulfillmentService({session: session});
    fulfillment_service.name = "Jupiter Fulfillment";
    fulfillment_service.callback_url = "http://google.com";
    fulfillment_service.inventory_management = true;
    fulfillment_service.tracking_support = true;
    fulfillment_service.requires_shipping_method = true;
    fulfillment_service.format = "json";
    fulfillment_service.permits_sku_sharing = true;
    fulfillment_service.fulfillment_orders_opt_in = true;
    await fulfillment_service.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/fulfillment_services.json',
      query: '',
      headers,
      data: { "fulfillment_service": {"name": "Jupiter Fulfillment", "callback_url": "http://google.com", "inventory_management": true, "tracking_support": true, "requires_shipping_method": true, "format": "json", "permits_sku_sharing": true, "fulfillment_orders_opt_in": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_service": {"id": 755357713, "name": "Mars Fulfillment", "email": null, "service_name": "Mars Fulfillment", "handle": "mars-fulfillment", "fulfillment_orders_opt_in": true, "include_pending_stock": false, "provider_id": null, "location_id": 24826418, "callback_url": "http://google.com/", "tracking_support": true, "inventory_management": true, "admin_graphql_api_id": "gid://shopify/ApiFulfillmentService/755357713"}}));

    await shopify.rest.FulfillmentService.find({
      session: session,
      id: 755357713,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/fulfillment_services/755357713.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_service": {"id": 755357713, "name": "New Fulfillment Service Name", "email": null, "service_name": "New Fulfillment Service Name", "handle": "mars-fulfillment", "fulfillment_orders_opt_in": true, "include_pending_stock": false, "provider_id": null, "location_id": 24826418, "callback_url": "http://google.com/", "tracking_support": true, "inventory_management": true, "admin_graphql_api_id": "gid://shopify/ApiFulfillmentService/755357713"}}));

    const fulfillment_service = new shopify.rest.FulfillmentService({session: session});
    fulfillment_service.id = 755357713;
    fulfillment_service.name = "New Fulfillment Service Name";
    await fulfillment_service.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-01/fulfillment_services/755357713.json',
      query: '',
      headers,
      data: { "fulfillment_service": {"name": "New Fulfillment Service Name"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.FulfillmentService.delete({
      session: session,
      id: 755357713,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-01/fulfillment_services/755357713.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
