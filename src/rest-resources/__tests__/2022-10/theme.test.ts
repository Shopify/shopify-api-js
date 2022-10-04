/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Theme} from '../../2022-10';

describe('Theme resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"themes": [{"id": 828155753, "name": "Comfort", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "role": "main", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/828155753"}, {"id": 976877075, "name": "Preview of Parallax", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "role": "demo", "theme_store_id": 688, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/976877075"}, {"id": 752253240, "name": "Sandbox", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "role": "unpublished", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}]}));

    await Theme.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/themes.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"theme": {"id": 1049083723, "name": "Lemongrass", "created_at": "2022-10-03T13:05:00-04:00", "updated_at": "2022-10-03T13:05:00-04:00", "role": "unpublished", "theme_store_id": null, "previewable": false, "processing": true, "admin_graphql_api_id": "gid://shopify/Theme/1049083723"}}));

    const theme = new Theme({session: test_session});
    theme.name = "Lemongrass";
    theme.src = "http://themes.shopify.com/theme.zip";
    theme.role = "main";
    await theme.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/themes.json',
      query: '',
      headers,
      data: { "theme": {"name": "Lemongrass", "src": "http://themes.shopify.com/theme.zip", "role": "main"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"theme": {"id": 828155753, "name": "Comfort", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "role": "main", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/828155753"}}));

    await Theme.find({
      session: test_session,
      id: 828155753,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/themes/828155753.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"theme": {"name": "Experimental", "role": "unpublished", "id": 752253240, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:04:50-04:00", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}}));

    const theme = new Theme({session: test_session});
    theme.id = 752253240;
    theme.name = "Experimental";
    await theme.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/themes/752253240.json',
      query: '',
      headers,
      data: { "theme": {"name": "Experimental"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"theme": {"role": "main", "id": 752253240, "name": "Sandbox", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:04:59-04:00", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}}));

    const theme = new Theme({session: test_session});
    theme.id = 752253240;
    theme.role = "main";
    await theme.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/themes/752253240.json',
      query: '',
      headers,
      data: { "theme": {"role": "main"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"id": 752253240, "name": "Sandbox", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "role": "unpublished", "theme_store_id": null, "previewable": true, "processing": false, "admin_graphql_api_id": "gid://shopify/Theme/752253240"}));

    await Theme.delete({
      session: test_session,
      id: 752253240,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/themes/752253240.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
