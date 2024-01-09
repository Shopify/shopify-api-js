/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-01';

describe('Collect resource', () => {
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

    queueMockResponse(JSON.stringify({"collect": {"id": 1071559576, "collection_id": 841564295, "product_id": 921728736, "created_at": "2024-01-02T08:58:05-05:00", "updated_at": "2024-01-02T08:58:05-05:00", "position": 2, "sort_value": "0000000002"}}));

    const collect = new shopify.rest.Collect({session: session});
    collect.product_id = 921728736;
    collect.collection_id = 841564295;
    await collect.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/collects.json',
      query: '',
      headers,
      data: { "collect": {"product_id": 921728736, "collection_id": 841564295} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"collects": [{"id": 358268117, "collection_id": 482865238, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 773559378, "collection_id": 395646240, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 800915878, "collection_id": 482865238, "product_id": 921728736, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}]}));

    await shopify.rest.Collect.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/collects.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"collects": [{"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 1071559575, "collection_id": 841564295, "product_id": 921728736, "created_at": "2024-01-02T08:57:59-05:00", "updated_at": "2024-01-02T08:57:59-05:00", "position": 2, "sort_value": "0000000002"}]}));

    await shopify.rest.Collect.all({
      session: session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/collects.json',
      query: 'collection_id=841564295',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"collects": [{"id": 358268117, "collection_id": 482865238, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 773559378, "collection_id": 395646240, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}]}));

    await shopify.rest.Collect.all({
      session: session,
      product_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/collects.json',
      query: 'product_id=632910392',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Collect.delete({
      session: session,
      id: 455204334,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-01/collects/455204334.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"collect": {"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}}));

    await shopify.rest.Collect.find({
      session: session,
      id: 455204334,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/collects/455204334.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.Collect.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/collects/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Collect.count({
      session: session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/collects/count.json',
      query: 'collection_id=841564295',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.Collect.count({
      session: session,
      product_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/collects/count.json',
      query: 'product_id=632910392',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
