import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Page} from '../../2021-10';

describe('Page resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"pages": [{"id": 108828309, "title": "Sample Page", "shop_id": 548380009, "handle": "sample", "body_html": "<p>this is a <strong>sample</strong> page.</p>", "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2008-07-16T20:00:00-04:00", "published_at": null, "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/108828309"}, {"id": 169524623, "title": "Store hours", "shop_id": 548380009, "handle": "store-hours", "body_html": "<p>We never close.</p>", "author": "Jobs", "created_at": "2013-12-31T19:00:00-05:00", "updated_at": "2013-12-31T19:00:00-05:00", "published_at": "2014-02-01T19:00:00-05:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/169524623"}, {"id": 322471, "title": "Support", "shop_id": 548380009, "handle": "support", "body_html": "<p>Come in store for support.</p>", "author": "Dennis", "created_at": "2009-07-15T20:00:00-04:00", "updated_at": "2009-07-16T20:00:00-04:00", "published_at": null, "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/322471"}, {"id": 131092082, "title": "Terms of Services", "shop_id": 548380009, "handle": "tos", "body_html": "<p>We make <strong>perfect</strong> stuff, we don't need a warranty.</p>", "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2008-07-16T20:00:00-04:00", "published_at": "2008-07-15T20:00:00-04:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}]}));

    await Page.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/pages.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"pages": [{"id": 131092082, "title": "Terms of Services", "shop_id": 548380009, "handle": "tos", "body_html": "<p>We make <strong>perfect</strong> stuff, we don't need a warranty.</p>", "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2008-07-16T20:00:00-04:00", "published_at": "2008-07-15T20:00:00-04:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}, {"id": 169524623, "title": "Store hours", "shop_id": 548380009, "handle": "store-hours", "body_html": "<p>We never close.</p>", "author": "Jobs", "created_at": "2013-12-31T19:00:00-05:00", "updated_at": "2013-12-31T19:00:00-05:00", "published_at": "2014-02-01T19:00:00-05:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/169524623"}]}));

    await Page.all({
      session: test_session,
      since_id: "108828309",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/pages.json',
      query: 'since_id=108828309',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"id": 1025371372, "title": "Warranty information", "shop_id": 548380009, "handle": "warranty-information", "body_html": "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>", "author": "Shopify API", "created_at": "2022-02-08T14:49:34-05:00", "updated_at": "2022-02-08T14:49:34-05:00", "published_at": "2022-02-08T14:49:34-05:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/1025371372"}}));

    const page = new Page({session: test_session});
    page.title = "Warranty information";
    page.body_html = "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>";
    await page.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/pages.json',
      query: '',
      headers,
      data: { "page": {"title": "Warranty information", "body_html": "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"id": 1025371373, "title": "Warranty information", "shop_id": 548380009, "handle": "warranty-information", "body_html": "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>", "author": "Shopify API", "created_at": "2022-02-08T14:49:36-05:00", "updated_at": "2022-02-08T14:49:36-05:00", "published_at": null, "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/1025371373"}}));

    const page = new Page({session: test_session});
    page.title = "Warranty information";
    page.body_html = "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>";
    page.published = false;
    await page.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/pages.json',
      query: '',
      headers,
      data: { "page": {"title": "Warranty information", "body_html": "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>", "published": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"id": 1025371374, "title": "Warranty information", "shop_id": 548380009, "handle": "warranty-information", "body_html": "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>", "author": "Shopify API", "created_at": "2022-02-08T14:49:39-05:00", "updated_at": "2022-02-08T14:49:39-05:00", "published_at": "2022-02-08T14:49:39-05:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/1025371374"}}));

    const page = new Page({session: test_session});
    page.title = "Warranty information";
    page.body_html = "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>";
    page.metafields = [
      {
        "key": "new",
        "value": "new value",
        "type": "single_line_text_field",
        "namespace": "global"
      }
    ];
    await page.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/pages.json',
      query: '',
      headers,
      data: { "page": {"title": "Warranty information", "body_html": "<h2>Warranty</h2>\n<p>Returns accepted if we receive items <strong>30 days after purchase</strong>.</p>", "metafields": [{"key": "new", "value": "new value", "type": "single_line_text_field", "namespace": "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 4}));

    await Page.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/pages/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"id": 131092082, "title": "Terms of Services", "shop_id": 548380009, "handle": "tos", "body_html": "<p>We make <strong>perfect</strong> stuff, we don't need a warranty.</p>", "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2008-07-16T20:00:00-04:00", "published_at": "2008-07-15T20:00:00-04:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}}));

    await Page.find({
      session: test_session,
      id: 131092082,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/pages/131092082.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"shop_id": 548380009, "body_html": "<p>Returns accepted if we receive the items 14 days after purchase.</p>", "title": "Terms of Services", "handle": "tos", "id": 131092082, "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2022-02-08T14:49:48-05:00", "published_at": "2008-07-15T20:00:00-04:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.body_html = "<p>Returns accepted if we receive the items 14 days after purchase.</p>";
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {"id": 131092082, "body_html": "<p>Returns accepted if we receive the items 14 days after purchase.</p>"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"shop_id": 548380009, "author": "Christopher Gorski", "body_html": "<p>Returns accepted if we receive the items <strong>14 days</strong> after purchase.</p>", "handle": "new-warranty", "title": "New warranty", "id": 131092082, "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2022-02-08T14:49:49-05:00", "published_at": "2008-07-15T20:00:00-04:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}}));

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
      path: '/admin/api/2021-10/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {"id": 131092082, "body_html": "<p>Returns accepted if we receive the items <strong>14 days</strong> after purchase.</p>", "author": "Christopher Gorski", "title": "New warranty", "handle": "new-warranty"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"shop_id": 548380009, "published_at": "2022-02-08T14:49:51-05:00", "title": "Terms of Services", "handle": "tos", "body_html": "<p>We make <strong>perfect</strong> stuff, we don't need a warranty.</p>", "id": 131092082, "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2022-02-08T14:49:51-05:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.published = true;
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {"id": 131092082, "published": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"shop_id": 548380009, "published_at": null, "title": "Terms of Services", "handle": "tos", "body_html": "<p>We make <strong>perfect</strong> stuff, we don't need a warranty.</p>", "id": 131092082, "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2022-02-08T14:49:53-05:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.published = false;
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {"id": 131092082, "published": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"page": {"shop_id": 548380009, "title": "Terms of Services", "handle": "tos", "body_html": "<p>We make <strong>perfect</strong> stuff, we don't need a warranty.</p>", "id": 131092082, "author": "Dennis", "created_at": "2008-07-15T20:00:00-04:00", "updated_at": "2022-02-08T14:49:54-05:00", "published_at": "2008-07-15T20:00:00-04:00", "template_suffix": null, "admin_graphql_api_id": "gid://shopify/OnlineStorePage/131092082"}}));

    const page = new Page({session: test_session});
    page.id = 131092082;
    page.metafields = [
      {
        "key": "new",
        "value": "new value",
        "type": "single_line_text_field",
        "namespace": "global"
      }
    ];
    await page.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/pages/131092082.json',
      query: '',
      headers,
      data: { "page": {"id": 131092082, "metafields": [{"key": "new", "value": "new value", "type": "single_line_text_field", "namespace": "global"}]} }
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
      path: '/admin/api/2021-10/pages/131092082.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
