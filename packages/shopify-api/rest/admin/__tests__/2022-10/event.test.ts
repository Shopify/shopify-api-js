/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('Event resource', () => {
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

    queueMockResponse(JSON.stringify({"events": [{"id": 164748010, "subject_id": 450789469, "created_at": "2008-01-10T06:00:00-05:00", "subject_type": "Order", "verb": "confirmed", "arguments": ["#1001", "Bob Norman"], "body": null, "message": "Received new order <a href=\"https://jsmith.myshopify.com/admin/orders/450789469\">#1001</a> by Bob Norman.", "author": "Shopify", "description": "Received new order #1001 by Bob Norman.", "path": "/admin/orders/450789469"}, {"id": 365755215, "subject_id": 632910392, "created_at": "2008-01-10T07:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Nano - 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/632910392\">IPod Nano - 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Nano - 8GB.", "path": "/admin/products/632910392"}, {"id": 677313116, "subject_id": 921728736, "created_at": "2008-01-10T08:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Touch 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/921728736\">IPod Touch 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Touch 8GB.", "path": "/admin/products/921728736"}]}));

    await shopify.rest.Event.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"events": [{"id": 103105390, "subject_id": 450789469, "created_at": "2008-01-10T05:00:00-05:00", "subject_type": "Order", "verb": "authorization_success", "arguments": ["389404469", "210.94", "USD"], "body": null, "message": "A transaction was authorized.", "author": "Shopify", "description": "A transaction was authorized.", "path": "/admin/orders/450789469"}, {"id": 164748010, "subject_id": 450789469, "created_at": "2008-01-10T06:00:00-05:00", "subject_type": "Order", "verb": "confirmed", "arguments": ["#1001", "Bob Norman"], "body": null, "message": "Received new order <a href=\"https://jsmith.myshopify.com/admin/orders/450789469\">#1001</a> by Bob Norman.", "author": "Shopify", "description": "Received new order #1001 by Bob Norman.", "path": "/admin/orders/450789469"}, {"id": 852065041, "subject_id": 450789469, "created_at": "2008-01-10T09:00:00-05:00", "subject_type": "Order", "verb": "placed", "arguments": [], "body": null, "message": "This order was created for Bob Norman from draft order <a href=\"https://jsmith.myshopify.com/admin/draft_orders/72885271\">#D1</a>.", "author": "Shopify", "description": "This order was created for Bob Norman from draft order #D1.", "path": "/admin/orders/450789469"}]}));

    await shopify.rest.Event.all({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/events.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"events": [{"id": 164748010, "subject_id": 450789469, "created_at": "2008-01-10T06:00:00-05:00", "subject_type": "Order", "verb": "confirmed", "arguments": ["#1001", "Bob Norman"], "body": null, "message": "Received new order <a href=\"https://jsmith.myshopify.com/admin/orders/450789469\">#1001</a> by Bob Norman.", "author": "Shopify", "description": "Received new order #1001 by Bob Norman.", "path": "/admin/orders/450789469"}, {"id": 365755215, "subject_id": 632910392, "created_at": "2008-01-10T07:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Nano - 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/632910392\">IPod Nano - 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Nano - 8GB.", "path": "/admin/products/632910392"}, {"id": 677313116, "subject_id": 921728736, "created_at": "2008-01-10T08:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Touch 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/921728736\">IPod Touch 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Touch 8GB.", "path": "/admin/products/921728736"}]}));

    await shopify.rest.Event.all({
      session: session,
      filter: "Product,Order",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events.json',
      query: 'filter=Product%2COrder',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"events": []}));

    await shopify.rest.Event.all({
      session: session,
      filter: "Product",
      verb: "destroy",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events.json',
      query: 'filter=Product&verb=destroy',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"events": [{"id": 677313116, "subject_id": 921728736, "created_at": "2008-01-10T08:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Touch 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/921728736\">IPod Touch 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Touch 8GB.", "path": "/admin/products/921728736"}]}));

    await shopify.rest.Event.all({
      session: session,
      created_at_min: "2008-01-10 12:30:00+00:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events.json',
      query: 'created_at_min=2008-01-10+12%3A30%3A00%2B00%3A00',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"events": [{"id": 365755215, "subject_id": 632910392, "created_at": "2008-01-10T07:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Nano - 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/632910392\">IPod Nano - 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Nano - 8GB.", "path": "/admin/products/632910392"}, {"id": 677313116, "subject_id": 921728736, "created_at": "2008-01-10T08:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Touch 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/921728736\">IPod Touch 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Touch 8GB.", "path": "/admin/products/921728736"}]}));

    await shopify.rest.Event.all({
      session: session,
      since_id: "164748010",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events.json',
      query: 'since_id=164748010',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"events": [{"id": 677313116, "subject_id": 921728736, "created_at": "2008-01-10T08:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Touch 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/921728736\">IPod Touch 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Touch 8GB.", "path": "/admin/products/921728736"}]}));

    await shopify.rest.Event.all({
      session: session,
      product_id: 921728736,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/products/921728736/events.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"events": [{"id": 852065041, "subject_id": 450789469, "created_at": "2008-01-10T09:00:00-05:00", "subject_type": "Order", "verb": "placed", "arguments": [], "body": null, "message": "This order was created for Bob Norman from draft order <a href=\"https://jsmith.myshopify.com/admin/draft_orders/72885271\">#D1</a>.", "author": "Shopify", "description": "This order was created for Bob Norman from draft order #D1.", "path": "/admin/orders/450789469"}]}));

    await shopify.rest.Event.all({
      session: session,
      order_id: 450789469,
      limit: "1",
      since_id: "164748010",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/events.json',
      query: 'limit=1&since_id=164748010',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"event": {"id": 677313116, "subject_id": 921728736, "created_at": "2008-01-10T08:00:00-05:00", "subject_type": "Product", "verb": "create", "arguments": ["IPod Touch 8GB"], "body": null, "message": "Product was created: <a href=\"https://jsmith.myshopify.com/admin/products/921728736\">IPod Touch 8GB</a>.", "author": "Shopify", "description": "Product was created: IPod Touch 8GB.", "path": "/admin/products/921728736"}}));

    await shopify.rest.Event.find({
      session: session,
      id: 677313116,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events/677313116.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.Event.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Event.count({
      session: session,
      created_at_min: "2008-01-10T13:00:00+00:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/events/count.json',
      query: 'created_at_min=2008-01-10T13%3A00%3A00%2B00%3A00',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
