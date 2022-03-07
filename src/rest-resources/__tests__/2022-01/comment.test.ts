import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Comment} from '../../2022-01';

describe('Comment resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.all({
      session: test_session,
      article_id: "134645308",
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments.json',
      query: 'article_id=134645308&blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.all({
      session: test_session,
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments.json',
      query: 'blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.all({
      session: test_session,
      since_id: "118373535",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments.json',
      query: 'since_id=118373535',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.count({
      session: test_session,
      article_id: "134645308",
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments/count.json',
      query: 'article_id=134645308&blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.count({
      session: test_session,
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments/count.json',
      query: 'blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Comment.find({
      session: test_session,
      id: 118373535,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/comments/118373535.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const comment = new Comment({session: test_session});
    comment.id = 118373535;
    comment.body = "You can even update through a web service.";
    comment.author = "Your new name";
    comment.email = "your@updated-email.com";
    comment.published_at = "2022-02-03T22:13:53.233Z";
    await comment.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/comments/118373535.json',
      query: '',
      headers,
      data: { "comment": {id: 118373535, body: "You can even update through a web service.", author: "Your new name", email: "your@updated-email.com", published_at: "2022-02-03T22:13:53.233Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const comment = new Comment({session: test_session});
    comment.body = "I like comments\nAnd I like posting them *RESTfully*.";
    comment.author = "Your name";
    comment.email = "your@email.com";
    comment.ip = "107.20.160.121";
    comment.blog_id = 241253187;
    comment.article_id = 134645308;
    await comment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/comments.json',
      query: '',
      headers,
      data: { "comment": {body: "I like comments\nAnd I like posting them *RESTfully*.", author: "Your name", email: "your@email.com", ip: "107.20.160.121", blog_id: 241253187, article_id: 134645308} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.spam({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/comments/653537639/spam.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.not_spam({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/comments/653537639/not_spam.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.approve({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/comments/653537639/approve.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.remove({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/comments/653537639/remove.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.restore({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/comments/653537639/restore.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
