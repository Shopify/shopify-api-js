import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Page} from '../../2022-01';

describe('Page resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Page.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/pages.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Page.all({
      session: test_session,
      since_id: "108828309",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/pages.json',
      query: 'since_id=108828309',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.title = "Warranty information";
    page.body_html = "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>";
    await page.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/pages.json',
      query: '',
      headers,
      data: { "page": {title: "Warranty information", body_html: "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.title = "Warranty information";
    page.body_html = "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>";
    page.published = false;
    await page.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/pages.json',
      query: '',
      headers,
      data: { "page": {title: "Warranty information", body_html: "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>", published: false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.title = "Warranty information";
    page.body_html = "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>";
    page.metafields = [
      {
        key: "new",
        value: "new value",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await page.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/pages.json',
      query: '',
      headers,
      data: { "page": {title: "Warranty information", body_html: "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>", metafields: [{key: "new", value: "new value", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Page.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/pages/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Page.find({
      session: test_session,
      id: 131092082,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/pages/131092082.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.body_html = "<p>Returns accepted if we receive the items 14 days after purchase.</p>";
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {id: 131092082, body_html: "<p>Returns accepted if we receive the items 14 days after purchase.</p>"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.body_html = "<p>Returns accepted if we receive the items <strong>14 days</strong> after purchase.</p>";
    page.author = "Christopher Gorski";
    page.title = "New warranty";
    page.handle = "new-warranty";
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {id: 131092082, body_html: "<p>Returns accepted if we receive the items <strong>14 days</strong> after purchase.</p>", author: "Christopher Gorski", title: "New warranty", handle: "new-warranty"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.published = true;
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {id: 131092082, published: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.published = false;
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {id: 131092082, published: false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.metafields = [
      {
        key: "new",
        value: "new value",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {id: 131092082, metafields: [{key: "new", value: "new value", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Page.delete({
      session: test_session,
      id: 131092082,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/pages/131092082.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
