import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Blog} from '../../2021-07';

describe('Blog resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Blog.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/blogs.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Blog.all({
      session: test_session,
      since_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/blogs.json',
      query: 'since_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const blog = new Blog({session: test_session});
    blog.title = "Apple main blog";
    await blog.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/blogs.json',
      query: '',
      headers,
      data: { "blog": {title: "Apple main blog"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const blog = new Blog({session: test_session});
    blog.title = "Apple main blog";
    blog.metafields = [
      {
        key: "sponsor",
        value: "Shopify",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await blog.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/blogs.json',
      query: '',
      headers,
      data: { "blog": {title: "Apple main blog", metafields: [{key: "sponsor", value: "Shopify", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Blog.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/blogs/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Blog.find({
      session: test_session,
      id: 241253187,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/blogs/241253187.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Blog.find({
      session: test_session,
      id: 241253187,
      fields: "id,title",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/blogs/241253187.json',
      query: 'fields=id%2Ctitle',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const blog = new Blog({session: test_session});
    blog.id = 241253187;
    blog.title = "IPod Updates";
    await blog.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/blogs/241253187.json',
      query: '',
      headers,
      data: { "blog": {id: 241253187, title: "IPod Updates"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const blog = new Blog({session: test_session});
    blog.id = 241253187;
    blog.title = "IPod Updates";
    blog.handle = "ipod-updates";
    blog.commentable = "moderate";
    await blog.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/blogs/241253187.json',
      query: '',
      headers,
      data: { "blog": {id: 241253187, title: "IPod Updates", handle: "ipod-updates", commentable: "moderate"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const blog = new Blog({session: test_session});
    blog.id = 241253187;
    blog.metafields = [
      {
        key: "sponsor",
        value: "Shopify",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await blog.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/blogs/241253187.json',
      query: '',
      headers,
      data: { "blog": {id: 241253187, metafields: [{key: "sponsor", value: "Shopify", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Blog.delete({
      session: test_session,
      id: 241253187,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/blogs/241253187.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
