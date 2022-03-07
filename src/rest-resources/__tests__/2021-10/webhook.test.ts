import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Webhook} from '../../2021-10';

describe('Webhook resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Webhook.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/webhooks.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Webhook.all({
      session: test_session,
      since_id: "901431826",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/webhooks.json',
      query: 'since_id=901431826',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const webhook = new Webhook({session: test_session});
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
      path: '/admin/api/2021-10/webhooks.json',
      query: '',
      headers,
      data: { "webhook": {topic: "orders/create", address: "https://example.hostname.com/", format: "json", fields: ["id", "note"]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const webhook = new Webhook({session: test_session});
    webhook.address = "arn:aws:events:us-east-1::event-source/aws.partner/shopify.com/755357713/example-event-source";
    webhook.topic = "customers/update";
    webhook.format = "json";
    await webhook.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/webhooks.json',
      query: '',
      headers,
      data: { "webhook": {address: "arn:aws:events:us-east-1::event-source/aws.partner/shopify.com/755357713/example-event-source", topic: "customers/update", format: "json"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const webhook = new Webhook({session: test_session});
    webhook.address = "pubsub://projectName:topicName";
    webhook.topic = "customers/update";
    webhook.format = "json";
    await webhook.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/webhooks.json',
      query: '',
      headers,
      data: { "webhook": {address: "pubsub://projectName:topicName", topic: "customers/update", format: "json"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Webhook.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/webhooks/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Webhook.count({
      session: test_session,
      topic: "orders/create",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/webhooks/count.json',
      query: 'topic=orders%2Fcreate',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Webhook.find({
      session: test_session,
      id: 4759306,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/webhooks/4759306.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const webhook = new Webhook({session: test_session});
    webhook.id = 4759306;
    webhook.address = "https://somewhere-else.com/";
    await webhook.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/webhooks/4759306.json',
      query: '',
      headers,
      data: { "webhook": {id: 4759306, address: "https://somewhere-else.com/"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Webhook.delete({
      session: test_session,
      id: 4759306,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-10/webhooks/4759306.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
