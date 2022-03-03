import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ScriptTag} from '../../2021-10';

describe('ScriptTag resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ScriptTag.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/script_tags.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ScriptTag.all({
      session: test_session,
      src: "https://js-aplenty.com/foo.js",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/script_tags.json',
      query: 'src=https%3A%2F%2Fjs-aplenty.com%2Ffoo.js',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ScriptTag.all({
      session: test_session,
      since_id: "421379493",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/script_tags.json',
      query: 'since_id=421379493',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const script_tag = new ScriptTag({session: test_session});
    script_tag.event = "onload";
    script_tag.src = "https://djavaskripped.org/fancy.js";
    await script_tag.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/script_tags.json',
      query: '',
      headers,
      data: { "script_tag": {event: "onload", src: "https://djavaskripped.org/fancy.js"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ScriptTag.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/script_tags/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ScriptTag.find({
      session: test_session,
      id: 596726825,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/script_tags/596726825.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const script_tag = new ScriptTag({session: test_session});
    script_tag.id = 596726825;
    script_tag.src = "https://somewhere-else.com/another.js";
    await script_tag.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/script_tags/596726825.json',
      query: '',
      headers,
      data: { "script_tag": {id: 596726825, src: "https://somewhere-else.com/another.js"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ScriptTag.delete({
      session: test_session,
      id: 596726825,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-10/script_tags/596726825.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
