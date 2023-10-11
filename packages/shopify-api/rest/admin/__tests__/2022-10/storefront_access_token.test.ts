/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('StorefrontAccessToken resource', () => {
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

    queueMockResponse(JSON.stringify({"storefront_access_token": {"access_token": "daa82586599a3c253573aabac1356236", "access_scope": "unauthenticated_read_product_listings", "created_at": "2023-10-03T13:47:31-04:00", "id": 1003304090, "admin_graphql_api_id": "gid://shopify/StorefrontAccessToken/1003304090", "title": "Test"}}));

    const storefront_access_token = new shopify.rest.StorefrontAccessToken({session: session});
    storefront_access_token.title = "Test";
    await storefront_access_token.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/storefront_access_tokens.json',
      query: '',
      headers,
      data: { "storefront_access_token": {"title": "Test"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"storefront_access_tokens": [{"access_token": "378d95641257a4ab3feff967ee234f4d", "access_scope": "unauthenticated_read_product_listings", "created_at": "2023-10-03T13:46:47-04:00", "id": 755357713, "admin_graphql_api_id": "gid://shopify/StorefrontAccessToken/755357713", "title": "API Client Extension"}]}));

    await shopify.rest.StorefrontAccessToken.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/storefront_access_tokens.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.StorefrontAccessToken.delete({
      session: session,
      id: 755357713,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/storefront_access_tokens/755357713.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
