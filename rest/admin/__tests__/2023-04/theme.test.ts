/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April23,
    restResources,
  });
});

describe('Theme resource', () => {
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
    queueMockResponse(JSON.stringify({"themes": [{"id": 828155753, "name": "Comfort", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "role": "main", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/828155753"}, {"id": 976877075, "name": "Preview of Parallax", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "role": "demo", "theme_store_id": 688, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/976877075"}, {"id": 752253240, "name": "Sandbox", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "role": "unpublished", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}]}));

    await shopify.rest.Theme.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/themes.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"theme": {"id": 1049083723, "name": "Lemongrass", "created_at": "2023-07-05T19:12:27-04:00", "updated_at": "2023-07-05T19:12:27-04:00", "role": "unpublished", "theme_store_id": null, "previewable": false, "processing": true, "admin_graphql_api_id": "gid://shopify/Theme/1049083723"}}));

    const theme = new shopify.rest.Theme({session: session});
    theme.name = "Lemongrass";
    theme.src = "http://themes.shopify.com/theme.zip";
    theme.role = "main";
    await theme.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/themes.json',
      query: '',
      headers,
      data: { "theme": {"name": "Lemongrass", "src": "http://themes.shopify.com/theme.zip", "role": "main"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"theme": {"id": 828155753, "name": "Comfort", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "role": "main", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/828155753"}}));

    await shopify.rest.Theme.find({
      session: session,
      id: 828155753,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/themes/828155753.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"theme": {"role": "main", "id": 752253240, "name": "Sandbox", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:12:26-04:00", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}}));

    const theme = new shopify.rest.Theme({session: session});
    theme.id = 752253240;
    theme.role = "main";
    await theme.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-04/themes/752253240.json',
      query: '',
      headers,
      data: { "theme": {"role": "main"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"theme": {"name": "Experimental", "role": "unpublished", "id": 752253240, "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:12:23-04:00", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}}));

    const theme = new shopify.rest.Theme({session: session});
    theme.id = 752253240;
    theme.name = "Experimental";
    await theme.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-04/themes/752253240.json',
      query: '',
      headers,
      data: { "theme": {"name": "Experimental"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"id": 752253240, "name": "Sandbox", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "role": "unpublished", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}));

    await shopify.rest.Theme.delete({
      session: session,
      id: 752253240,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-04/themes/752253240.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
