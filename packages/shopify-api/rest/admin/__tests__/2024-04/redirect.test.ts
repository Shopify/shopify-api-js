/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2024-04';

describe('Redirect resource', () => {
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
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirects": [{"id": 950115854, "path": "/ibook", "target": "/products/macbook"}]}));

    await shopify.rest.Redirect.all({
      session: session,
      since_id: "668809255",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/redirects.json',
      query: 'since_id=668809255',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirects": [{"id": 304339089, "path": "/products.php", "target": "/products"}, {"id": 668809255, "path": "/leopard", "target": "/pages/macosx"}, {"id": 950115854, "path": "/ibook", "target": "/products/macbook"}]}));

    await shopify.rest.Redirect.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/redirects.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.Redirect.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/redirects/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirect": {"id": 668809255, "path": "/leopard", "target": "/pages/macosx"}}));

    await shopify.rest.Redirect.find({
      session: session,
      id: 668809255,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-04/redirects/668809255.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirect": {"path": "/powermac", "target": "/pages/macpro", "id": 950115854}}));

    const redirect = new shopify.rest.Redirect({session: session});
    redirect.id = 950115854;
    redirect.path = "/powermac";
    redirect.target = "/pages/macpro";
    await redirect.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2024-04/redirects/950115854.json',
      query: '',
      headers,
      data: { "redirect": {"path": "/powermac", "target": "/pages/macpro"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirect": {"path": "/tiger", "target": "/pages/macosx", "id": 668809255}}));

    const redirect = new shopify.rest.Redirect({session: session});
    redirect.id = 668809255;
    redirect.path = "/tiger";
    await redirect.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2024-04/redirects/668809255.json',
      query: '',
      headers,
      data: { "redirect": {"path": "/tiger"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirect": {"target": "/pages/macpro", "path": "/leopard", "id": 668809255}}));

    const redirect = new shopify.rest.Redirect({session: session});
    redirect.id = 668809255;
    redirect.target = "/pages/macpro";
    await redirect.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2024-04/redirects/668809255.json',
      query: '',
      headers,
      data: { "redirect": {"target": "/pages/macpro"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Redirect.delete({
      session: session,
      id: 668809255,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2024-04/redirects/668809255.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirect": {"id": 984542200, "path": "/ipod", "target": "/pages/itunes"}}));

    const redirect = new shopify.rest.Redirect({session: session});
    redirect.path = "/ipod";
    redirect.target = "/pages/itunes";
    await redirect.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/redirects.json',
      query: '',
      headers,
      data: { "redirect": {"path": "/ipod", "target": "/pages/itunes"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April24, restResources}),
    );

    queueMockResponse(JSON.stringify({"redirect": {"id": 984542199, "path": "/forums", "target": "http://forums.apple.com/"}}));

    const redirect = new shopify.rest.Redirect({session: session});
    redirect.path = "http://www.apple.com/forums";
    redirect.target = "http://forums.apple.com";
    await redirect.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2024-04/redirects.json',
      query: '',
      headers,
      data: { "redirect": {"path": "http://www.apple.com/forums", "target": "http://forums.apple.com"} }
    }).toMatchMadeHttpRequest();
  });

});
