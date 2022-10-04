/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Comment} from '../../2022-10';

describe('Comment resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}, {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await Comment.all({
      session: test_session,
      article_id: "134645308",
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments.json',
      query: 'article_id=134645308&blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}, {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await Comment.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}, {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await Comment.all({
      session: test_session,
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments.json',
      query: 'blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await Comment.all({
      session: test_session,
      since_id: "118373535",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments.json',
      query: 'since_id=118373535',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await Comment.count({
      session: test_session,
      article_id: "134645308",
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments/count.json',
      query: 'article_id=134645308&blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await Comment.count({
      session: test_session,
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments/count.json',
      query: 'blog_id=241253187',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await Comment.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"comment": {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T12:44:45-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}}));

    await Comment.find({
      session: test_session,
      id: 118373535,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/comments/118373535.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"comment": {"author": "Your new name", "body": "You can even update through a web service.", "email": "your@updated-email.com", "published_at": "2022-10-03T13:05:08-04:00", "id": 118373535, "body_html": "<p>You can even update through a web service.</p>", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:05:08-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}}));

    const comment = new Comment({session: test_session});
    comment.id = 118373535;
    comment.body = "You can even update through a web service.";
    comment.author = "Your new name";
    comment.email = "your@updated-email.com";
    comment.published_at = "2022-10-03T17:05:08.150Z";
    await comment.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/comments/118373535.json',
      query: '',
      headers,
      data: { "comment": {"body": "You can even update through a web service.", "author": "Your new name", "email": "your@updated-email.com", "published_at": "2022-10-03T17:05:08.150Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"comment": {"id": 757536352, "body": "I like comments\nAnd I like posting them *RESTfully*.", "body_html": "<p>I like comments<br>\nAnd I like posting them <strong>RESTfully</strong>.</p>", "author": "Your name", "email": "your@email.com", "status": "pending", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T13:05:29-04:00", "updated_at": "2022-10-03T13:05:29-04:00", "ip": "107.20.160.121", "user_agent": null, "published_at": null}}));

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
      path: '/admin/api/2022-10/comments.json',
      query: '',
      headers,
      data: { "comment": {"body": "I like comments\nAnd I like posting them *RESTfully*.", "author": "Your name", "email": "your@email.com", "ip": "107.20.160.121", "blog_id": 241253187, "article_id": 134645308} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"published_at": null, "status": "spam", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:05:02-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.spam({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/comments/653537639/spam.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"published_at": "2022-10-03T13:05:06-04:00", "status": "published", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:05:06-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.not_spam({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/comments/653537639/not_spam.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"published_at": "2022-10-03T13:05:53-04:00", "status": "published", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:05:53-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.approve({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/comments/653537639/approve.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"published_at": null, "status": "removed", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:05:04-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.remove({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/comments/653537639/remove.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"published_at": "2022-10-03T13:05:15-04:00", "status": "published", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "soleone@example.net", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-10-03T12:44:45-04:00", "updated_at": "2022-10-03T13:05:15-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new Comment({session: test_session});
    comment.id = 653537639;
    await comment.restore({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/comments/653537639/restore.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
