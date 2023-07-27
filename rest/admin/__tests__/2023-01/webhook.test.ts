/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-01';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.January23,
    restResources,
  });
});

describe('Webhook resource', () => {
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
    queueMockResponse(JSON.stringify({"webhooks": [{"id": 4759306, "address": "https://apple.com", "topic": "orders/create", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}, {"id": 892403750, "address": "https://example.org/fully_loaded_1", "topic": "orders/cancelled", "created_at": "2021-12-01T05:23:43-05:00", "updated_at": "2021-12-01T05:23:43-05:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}, {"id": 901431826, "address": "https://apple.com/uninstall", "topic": "app/uninstalled", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}, {"id": 1014196360, "address": "https://example.org/app_uninstalled", "topic": "app/uninstalled", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}]}));

    await shopify.rest.Webhook.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/webhooks.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"webhooks": [{"id": 1014196360, "address": "https://example.org/app_uninstalled", "topic": "app/uninstalled", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}]}));

    await shopify.rest.Webhook.all({
      session: session,
      since_id: "901431826",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/webhooks.json',
      query: 'since_id=901431826',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"webhook": {"id": 5969010389, "address": "pubsub://projectName:topicName", "topic": "customers/update", "created_at": "2023-07-05T19:09:46-04:00", "updated_at": "2023-07-05T19:09:46-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}}));

    const webhook = new shopify.rest.Webhook({session: session});
    webhook.address = "pubsub://projectName:topicName";
    webhook.topic = "customers/update";
    webhook.format = "json";
    await webhook.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/webhooks.json',
      query: '',
      headers,
      data: { "webhook": {"address": "pubsub://projectName:topicName", "topic": "customers/update", "format": "json"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"webhook": {"id": 5969010387, "address": "arn:aws:events:us-east-1::event-source/aws.partner/shopify.com/755357713/example-event-source", "topic": "customers/update", "created_at": "2023-07-05T19:09:40-04:00", "updated_at": "2023-07-05T19:09:40-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}}));

    const webhook = new shopify.rest.Webhook({session: session});
    webhook.address = "arn:aws:events:us-east-1::event-source/aws.partner/shopify.com/755357713/example-event-source";
    webhook.topic = "customers/update";
    webhook.format = "json";
    await webhook.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/webhooks.json',
      query: '',
      headers,
      data: { "webhook": {"address": "arn:aws:events:us-east-1::event-source/aws.partner/shopify.com/755357713/example-event-source", "topic": "customers/update", "format": "json"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"webhook": {"id": 5969010364, "address": "https://example.hostname.com/", "topic": "orders/create", "created_at": "2023-07-05T19:08:01-04:00", "updated_at": "2023-07-05T19:08:01-04:00", "format": "json", "fields": ["id", "note"], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}}));

    const webhook = new shopify.rest.Webhook({session: session});
    webhook.topic = "orders/create";
    webhook.address = "https://example.hostname.com/";
    webhook.format = "json";
    webhook.fields = [
      "id",
      "note"
    ];
    await webhook.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/webhooks.json',
      query: '',
      headers,
      data: { "webhook": {"topic": "orders/create", "address": "https://example.hostname.com/", "format": "json", "fields": ["id", "note"]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Webhook.count({
      session: session,
      topic: "orders/create",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/webhooks/count.json',
      query: 'topic=orders%2Fcreate',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"count": 4}));

    await shopify.rest.Webhook.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/webhooks/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({"webhook": {"id": 4759306, "address": "https://apple.com", "topic": "orders/create", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:05:24-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}}));

    await shopify.rest.Webhook.find({
      session: session,
      id: 4759306,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/webhooks/4759306.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    queueMockResponse(JSON.stringify({"webhook": {"id": 4759306, "address": "https://somewhere-else.com/", "topic": "orders/create", "created_at": "2023-07-05T19:05:24-04:00", "updated_at": "2023-07-05T19:07:52-04:00", "format": "json", "fields": [], "metafield_namespaces": [], "api_version": "unstable", "private_metafield_namespaces": []}}));

    const webhook = new shopify.rest.Webhook({session: session});
    webhook.id = 4759306;
    webhook.address = "https://somewhere-else.com/";
    await webhook.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-01/webhooks/4759306.json',
      query: '',
      headers,
      data: { "webhook": {"address": "https://somewhere-else.com/"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Webhook.delete({
      session: session,
      id: 4759306,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-01/webhooks/4759306.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
