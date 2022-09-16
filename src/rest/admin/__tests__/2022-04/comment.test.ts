/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../session/session';
import {testConfig, queueMockResponse} from '../../../../__tests__/test-helper';
import {ApiVersion, Shopify} from '../../../../base-types';
import {shopifyApi} from '../../../..';

import {restResources} from '../../2022-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April22,
    restResources,
  });
});

describe('Comment resource', () => {
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
    queueMockResponse(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}, {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await shopify.rest.Comment.all({
      session: session,
      article_id: "134645308",
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments.json',
      query: 'article_id=134645308&blog_id=241253187',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}, {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await shopify.rest.Comment.all({
      session: session,
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments.json',
      query: 'blog_id=241253187',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}, {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await shopify.rest.Comment.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"comments": [{"id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "unapproved", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}]}));

    await shopify.rest.Comment.all({
      session: session,
      since_id: "118373535",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments.json',
      query: 'since_id=118373535',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.Comment.count({
      session: session,
      article_id: "134645308",
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments/count.json',
      query: 'article_id=134645308&blog_id=241253187',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.Comment.count({
      session: session,
      blog_id: "241253187",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments/count.json',
      query: 'blog_id=241253187',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.Comment.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({"comment": {"id": 118373535, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:05:24-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1", "published_at": null}}));

    await shopify.rest.Comment.find({
      session: session,
      id: 118373535,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/comments/118373535.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    queueMockResponse(JSON.stringify({"comment": {"author": "Your new name", "body": "You can even update through a web service.", "email": "your@updated-email.com", "published_at": "2022-04-05T13:14:00-04:00", "id": 118373535, "body_html": "<p>You can even update through a web service.</p>", "status": "published", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:14:01-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}}));

    const comment = new shopify.rest.Comment({session: session});
    comment.id = 118373535;
    comment.body = "You can even update through a web service.";
    comment.author = "Your new name";
    comment.email = "your@updated-email.com";
    comment.published_at = "2022-04-05T17:14:00.495Z";
    await comment.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/comments/118373535.json',
      query: '',
      headers,
      data: { "comment": {"body": "You can even update through a web service.", "author": "Your new name", "email": "your@updated-email.com", "published_at": "2022-04-05T17:14:00.495Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    queueMockResponse(JSON.stringify({"comment": {"id": 757536351, "body": "I like comments\nAnd I like posting them *RESTfully*.", "body_html": "<p>I like comments<br>\nAnd I like posting them <strong>RESTfully</strong>.</p>", "author": "Your name", "email": "your@email.com", "status": "pending", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:13:59-04:00", "updated_at": "2022-04-05T13:13:59-04:00", "ip": "107.20.160.121", "user_agent": null, "published_at": null}}));

    const comment = new shopify.rest.Comment({session: session});
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
      path: '/admin/api/2022-04/comments.json',
      query: '',
      headers,
      data: { "comment": {"body": "I like comments\nAnd I like posting them *RESTfully*.", "author": "Your name", "email": "your@email.com", "ip": "107.20.160.121", "blog_id": 241253187, "article_id": 134645308} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    queueMockResponse(JSON.stringify({"published_at": null, "status": "spam", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:14:03-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new shopify.rest.Comment({session: session});
    comment.id = 653537639;
    await comment.spam({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/comments/653537639/spam.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    queueMockResponse(JSON.stringify({"published_at": "2022-04-05T13:14:05-04:00", "status": "published", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:14:05-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new shopify.rest.Comment({session: session});
    comment.id = 653537639;
    await comment.not_spam({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/comments/653537639/not_spam.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    queueMockResponse(JSON.stringify({"published_at": "2022-04-05T13:14:07-04:00", "status": "published", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:14:07-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new shopify.rest.Comment({session: session});
    comment.id = 653537639;
    await comment.approve({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/comments/653537639/approve.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    queueMockResponse(JSON.stringify({"published_at": null, "status": "removed", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:14:09-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new shopify.rest.Comment({session: session});
    comment.id = 653537639;
    await comment.remove({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/comments/653537639/remove.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    queueMockResponse(JSON.stringify({"published_at": "2022-04-05T13:14:12-04:00", "status": "published", "id": 653537639, "body": "Hi author, I really _like_ what you're doing there.", "body_html": "<p>Hi author, I really <em>like</em> what you're doing there.</p>", "author": "Soleone", "email": "sole@one.de", "article_id": 134645308, "blog_id": 241253187, "created_at": "2022-04-05T13:05:24-04:00", "updated_at": "2022-04-05T13:14:12-04:00", "ip": "127.0.0.1", "user_agent": "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_5_4; en-us) AppleWebKit/525.18 (KHTML, like Gecko) Version/3.1.2 Safari/525.20.1"}));

    const comment = new shopify.rest.Comment({session: session});
    comment.id = 653537639;
    await comment.restore({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/comments/653537639/restore.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
