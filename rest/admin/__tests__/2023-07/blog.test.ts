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

describe('Blog resource', () => {
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
    queueMockResponse(JSON.stringify({"blogs": [{"id": 382285388, "handle": "banana-blog", "title": "A Gnu Blog", "updated_at": "2006-02-02T19:00:00-05:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:05:24-04:00", "template_suffix": null, "tags": "", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/382285388"}, {"id": 241253187, "handle": "apple-blog", "title": "Mah Blog", "updated_at": "2006-02-01T19:00:00-05:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:05:24-04:00", "template_suffix": null, "tags": "Announcing, Mystery", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/241253187"}]}));

    await shopify.rest.Blog.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/blogs.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"blogs": [{"id": 382285388, "handle": "banana-blog", "title": "A Gnu Blog", "updated_at": "2006-02-02T19:00:00-05:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:05:24-04:00", "template_suffix": null, "tags": "", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/382285388"}, {"id": 1008414253, "handle": "apple-main-blog", "title": "Apple main blog", "updated_at": "2023-07-05T19:16:12-04:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:16:12-04:00", "template_suffix": null, "tags": "", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/1008414253"}]}));

    await shopify.rest.Blog.all({
      session: session,
      since_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/blogs.json',
      query: 'since_id=241253187',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"blog": {"id": 1008414251, "handle": "apple-main-blog", "title": "Apple main blog", "updated_at": "2023-07-05T19:16:07-04:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:16:07-04:00", "template_suffix": null, "tags": "", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/1008414251"}}));

    const blog = new shopify.rest.Blog({session: session});
    blog.title = "Apple main blog";
    await blog.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-07/blogs.json',
      query: '',
      headers,
      data: { "blog": {"title": "Apple main blog"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"blog": {"id": 1008414252, "handle": "apple-main-blog", "title": "Apple main blog", "updated_at": "2023-07-05T19:16:10-04:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:16:10-04:00", "template_suffix": null, "tags": "", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/1008414252"}}));

    const blog = new shopify.rest.Blog({session: session});
    blog.title = "Apple main blog";
    blog.metafields = [
      {
        "key": "sponsor",
        "value": "Shopify",
        "type": "single_line_text_field",
        "namespace": "global"
      }
    ];
    await blog.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-07/blogs.json',
      query: '',
      headers,
      data: { "blog": {"title": "Apple main blog", "metafields": [{"key": "sponsor", "value": "Shopify", "type": "single_line_text_field", "namespace": "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.Blog.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/blogs/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"blog": {"id": 241253187, "handle": "apple-blog", "title": "Mah Blog", "updated_at": "2006-02-01T19:00:00-05:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:05:24-04:00", "template_suffix": null, "tags": "Announcing, Mystery", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/241253187"}}));

    await shopify.rest.Blog.find({
      session: session,
      id: 241253187,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/blogs/241253187.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"blog": {"id": 241253187, "title": "Mah Blog"}}));

    await shopify.rest.Blog.find({
      session: session,
      id: 241253187,
      fields: "id,title",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/blogs/241253187.json',
      query: 'fields=id%2Ctitle',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({"blog": {"title": "Mah Blog", "handle": "apple-blog", "id": 241253187, "updated_at": "2023-07-05T19:16:19-04:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:05:24-04:00", "template_suffix": null, "tags": "Announcing, Mystery", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/241253187"}}));

    const blog = new shopify.rest.Blog({session: session});
    blog.id = 241253187;
    blog.metafields = [
      {
        "key": "sponsor",
        "value": "Shopify",
        "type": "single_line_text_field",
        "namespace": "global"
      }
    ];
    await blog.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-07/blogs/241253187.json',
      query: '',
      headers,
      data: { "blog": {"metafields": [{"key": "sponsor", "value": "Shopify", "type": "single_line_text_field", "namespace": "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    queueMockResponse(JSON.stringify({"blog": {"title": "IPod Updates", "handle": "apple-blog", "id": 241253187, "updated_at": "2023-07-05T19:16:18-04:00", "commentable": "no", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:05:24-04:00", "template_suffix": null, "tags": "Announcing, Mystery", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/241253187"}}));

    const blog = new shopify.rest.Blog({session: session});
    blog.id = 241253187;
    blog.title = "IPod Updates";
    await blog.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-07/blogs/241253187.json',
      query: '',
      headers,
      data: { "blog": {"title": "IPod Updates"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    queueMockResponse(JSON.stringify({"blog": {"title": "IPod Updates", "handle": "ipod-updates", "commentable": "moderate", "id": 241253187, "updated_at": "2023-07-05T19:16:09-04:00", "feedburner": null, "feedburner_location": null, "created_at": "2023-07-05T19:05:24-04:00", "template_suffix": null, "tags": "Announcing, Mystery", "admin_graphql_api_id": "gid://shopify/OnlineStoreBlog/241253187"}}));

    const blog = new shopify.rest.Blog({session: session});
    blog.id = 241253187;
    blog.title = "IPod Updates";
    blog.handle = "ipod-updates";
    blog.commentable = "moderate";
    await blog.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-07/blogs/241253187.json',
      query: '',
      headers,
      data: { "blog": {"title": "IPod Updates", "handle": "ipod-updates", "commentable": "moderate"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Blog.delete({
      session: session,
      id: 241253187,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-07/blogs/241253187.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
