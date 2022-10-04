/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ScriptTag} from '../../2022-01';

describe('ScriptTag resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"script_tags": [{"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "display_scope": "all"}]}));

    await ScriptTag.all({
      session: test_session,
      since_id: "421379493",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/script_tags.json',
      query: 'since_id=421379493',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"script_tags": [{"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "display_scope": "all"}]}));

    await ScriptTag.all({
      session: test_session,
      src: "https://js.example.org/foo.js",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/script_tags.json',
      query: 'src=https%3A%2F%2Fjs.example.org%2Ffoo.js',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"script_tags": [{"id": 421379493, "src": "https://js.example.org/bar.js", "event": "onload", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "display_scope": "all"}, {"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "display_scope": "all"}]}));

    await ScriptTag.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/script_tags.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await ScriptTag.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/script_tags/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"script_tag": {"id": 596726825, "src": "https://js.example.org/foo.js", "event": "onload", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "display_scope": "all", "cache": false}}));

    await ScriptTag.find({
      session: test_session,
      id: 596726825,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/script_tags/596726825.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"script_tag": {"src": "https://somewhere-else.com/another.js", "cache": false, "id": 596726825, "event": "onload", "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:46:10-04:00", "display_scope": "all"}}));

    const script_tag = new ScriptTag({session: test_session});
    script_tag.id = 596726825;
    script_tag.src = "https://somewhere-else.com/another.js";
    await script_tag.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/script_tags/596726825.json',
      query: '',
      headers,
      data: { "script_tag": {"src": "https://somewhere-else.com/another.js"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ScriptTag.delete({
      session: test_session,
      id: 596726825,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/script_tags/596726825.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"script_tag": {"id": 870402687, "src": "https://example.com/my_script.js", "event": "onload", "created_at": "2022-10-03T12:46:20-04:00", "updated_at": "2022-10-03T12:46:20-04:00", "display_scope": "all", "cache": false}}));

    const script_tag = new ScriptTag({session: test_session});
    script_tag.event = "onload";
    script_tag.src = "https://example.com/my_script.js";
    await script_tag.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/script_tags.json',
      query: '',
      headers,
      data: { "script_tag": {"event": "onload", "src": "https://example.com/my_script.js"} }
    }).toMatchMadeHttpRequest();
  });

});
