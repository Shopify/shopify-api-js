/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-07';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.July23,
    restResources,
  });
});

describe('ScriptTag resource', () => {
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
    queueMockResponse(JSON.stringify({"script_tags": [{"id": 421379493, "src": "https://js.example.org/bar.js", "event": "onload", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "display_scope": "all"}, {"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "display_scope": "all"}]}));

    await shopify.rest.ScriptTag.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/script_tags.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"script_tags": [{"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "display_scope": "all"}]}));

    await shopify.rest.ScriptTag.all({
      session: session,
      since_id: "421379493",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/script_tags.json',
      query: 'since_id=421379493',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"script_tags": [{"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "display_scope": "all"}]}));

    await shopify.rest.ScriptTag.all({
      session: session,
      src: "https://js.example.org/foo.js",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/script_tags.json',
      query: 'src=https%3A%2F%2Fjs.example.org%2Ffoo.js',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"script_tag": {"id": 870402687, "src": "https://example.com/my_script.js", "event": "onload", "created_at": "2023-07-05T19:17:51-04:00", "updated_at": "2023-07-05T19:17:51-04:00", "display_scope": "all", "cache": false}}));

    const script_tag = new shopify.rest.ScriptTag({session: session});
    script_tag.event = "onload";
    script_tag.src = "https://example.com/my_script.js";
    await script_tag.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-07/script_tags.json',
      query: '',
      headers,
      data: { "script_tag": {"event": "onload", "src": "https://example.com/my_script.js"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.ScriptTag.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/script_tags/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"script_tag": {"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "display_scope": "all", "cache": false}}));

    await shopify.rest.ScriptTag.find({
      session: session,
      id: 596726825,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/script_tags/596726825.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"script_tag": {"src": "https://somewhere-else.com/another.js", "cache": false, "id": 596726825, "event": "onload", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:17:47-04:00", "display_scope": "all"}}));

    const script_tag = new shopify.rest.ScriptTag({session: session});
    script_tag.id = 596726825;
    script_tag.src = "https://somewhere-else.com/another.js";
    await script_tag.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-07/script_tags/596726825.json',
      query: '',
      headers,
      data: { "script_tag": {"src": "https://somewhere-else.com/another.js"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({}));

    await shopify.rest.ScriptTag.delete({
      session: session,
      id: 596726825,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-07/script_tags/596726825.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
