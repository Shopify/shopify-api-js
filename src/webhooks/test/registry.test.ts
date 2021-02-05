import '../../test/test_helper';
import {createHmac} from 'crypto';

import {Method, Header, StatusCode} from '@shopify/network';

import {DeliveryMethod, ProcessReturn, RegisterOptions} from '../types';
import {ApiVersion, ShopifyHeader} from '../../base_types';
import {Context} from '../../context';
import {DataType} from '../../clients/types';
import {assertHttpRequest} from '../../clients/http_client/test/test_helper';
import * as ShopifyErrors from '../../error';
import ShopifyWebhooks from '..';

const webhookCheckEmptyResponse = {
  data: {
    webhookSubscriptions: {
      edges: [],
    },
  },
};

const webhookId = 'gid://shopify/WebhookSubscription/12345';
const webhookCheckResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: webhookId,
            callbackUrl: 'https://test_host_name/webhooks',
          },
        },
      ],
    },
  },
};

const successResponse = {
  data: {
    webhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: {id: webhookId},
    },
  },
};

const eventBridgeSuccessResponse = {
  data: {
    eventBridgeWebhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: {id: webhookId},
    },
  },
};

const successUpdateResponse = {
  data: {
    webhookSubscriptionUpdate: {
      userErrors: [],
      webhookSubscription: {id: webhookId},
    },
  },
};

const eventBridgeSuccessUpdateResponse = {
  data: {
    eventBridgeWebhookSubscriptionUpdate: {
      userErrors: [],
      webhookSubscription: {id: webhookId},
    },
  },
};

const failResponse = {
  data: {},
};

function genericWebhookHandler(topic: string, shopDomain: string, body: Buffer) {
  if (topic && shopDomain && body) { // eslint-disable-lint no-empty
  }
}

describe('ShopifyWebhooks.Registry.register', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = [];
  });

  it('sends a post request to the given shop domain with the webhook data as a GraphQL query in the body and the access token in the headers', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      webhookHandler: genericWebhookHandler,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(successResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook);
  });

  it('returns a result with success set to false, body set to empty object, when the server doesn’t return a webhookSubscriptionCreate field', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(failResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      webhookHandler: genericWebhookHandler,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(false);
    expect(result.result).toEqual(failResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook);
  });

  it('sends an eventbridge registration GraphQL query for an eventbridge webhook registration', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      deliveryMethod: DeliveryMethod.EventBridge,
      webhookHandler: genericWebhookHandler,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(eventBridgeSuccessResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook);
  });

  it('updates a pre-existing webhook even if it is already registered with Shopify', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successUpdateResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks/new',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      webhookHandler: genericWebhookHandler,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(successUpdateResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  });

  it('updates a pre-existing eventbridge webhook even if it is already registered with Shopify', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponse));
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessUpdateResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks/new',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      deliveryMethod: DeliveryMethod.EventBridge,
      webhookHandler: genericWebhookHandler,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(eventBridgeSuccessUpdateResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  });

  it('fully skips registering a webhook if it is already registered with Shopify and its callback is the same', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      deliveryMethod: DeliveryMethod.EventBridge,
      webhookHandler: genericWebhookHandler,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual({});
    expect(fetchMock.mock.calls.length).toBe(1);
    assertWebhookCheckRequest(webhook);
  });

  it('fails if given an invalid DeliveryMethod', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessResponse));
    const webhook = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      deliveryMethod: 'Something else',
      webhookHandler: genericWebhookHandler,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook as RegisterOptions);
    expect(result.success).toBe(false);
  });

  it('only contains a single entry for a topic after an update', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));
    let webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      webhookHandler: genericWebhookHandler,
    };
    await ShopifyWebhooks.Registry.register(webhook);
    expect(ShopifyWebhooks.Registry.webhookRegistry).toHaveLength(1);

    // Add a second handler
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));
    webhook = {
      path: '/webhooks',
      topic: 'PRODUCTS_UPDATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      webhookHandler: genericWebhookHandler,
    };
    await ShopifyWebhooks.Registry.register(webhook);
    expect(ShopifyWebhooks.Registry.webhookRegistry).toHaveLength(2);

    // Update the second handler and make sure we still have the two of them
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successUpdateResponse));
    webhook.path = '/webhooks/new';
    await ShopifyWebhooks.Registry.register(webhook);
    expect(ShopifyWebhooks.Registry.webhookRegistry).toHaveLength(2);

    // Make sure we have one of each topic in the registry
    const actualTopics = ShopifyWebhooks.Registry.webhookRegistry.reduce(
      (arr: string[], item) => arr.concat(item.topic),
      [],
    );
    expect(actualTopics).toEqual(['PRODUCTS_CREATE', 'PRODUCTS_UPDATE']);
  });
});

describe('ShopifyWebhooks.Registry.process', () => {
  const rawBody = Buffer.from('{"foo": "bar"}', 'utf8');

  beforeEach(async () => {
    Context.API_SECRET_KEY = 'kitties are cute';
  });

  afterEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = [];
  });

  it('handles the request when topic is already registered', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'PRODUCTS',
      webhookHandler: genericWebhookHandler,
    });

    const result: ProcessReturn = ShopifyWebhooks.Registry.process({
      headers: headers({hmac: hmac(Context.API_SECRET_KEY, rawBody.toString('utf8'))}),
      body: rawBody,
    });

    expect(result.statusCode).toBe(StatusCode.Ok);
  });

  it('handles lower case headers', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'PRODUCTS',
      webhookHandler: genericWebhookHandler,
    });

    const result: ProcessReturn = ShopifyWebhooks.Registry.process({
      headers: headers({hmac: hmac(Context.API_SECRET_KEY, rawBody.toString('utf8')), lowercase: true}),
      body: rawBody,
    });

    expect(result.statusCode).toBe(StatusCode.Ok);
  });

  it('handles the request and returns Forbidden when topic is not registered', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'NONSENSE_TOPIC',
      webhookHandler: genericWebhookHandler,
    });

    const result: ProcessReturn = ShopifyWebhooks.Registry.process({
      headers: headers({hmac: hmac(Context.API_SECRET_KEY, rawBody.toString('utf8'))}),
      body: rawBody,
    });

    expect(result.statusCode).toBe(StatusCode.Forbidden);
  });

  it('handles the request and returns Forbidden when hmac does not match', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'PRODUCTS',
      webhookHandler: genericWebhookHandler,
    });

    const result: ProcessReturn = ShopifyWebhooks.Registry.process({
      headers: headers({hmac: hmac('incorrect secret', rawBody.toString('utf8'))}),
      body: rawBody,
    });

    expect(result.statusCode).toBe(StatusCode.Forbidden);
  });

  it('fails if the given body is empty', () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'NONSENSE_TOPIC',
      webhookHandler: genericWebhookHandler,
    });

    expect(() => ShopifyWebhooks.Registry.process({headers: headers(), body: Buffer.from('', 'utf8')})).toThrow(
      ShopifyErrors.MissingRequiredArgument,
    );
  });

  it('fails if the any of the required headers are missing', () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'NONSENSE_TOPIC',
      webhookHandler: genericWebhookHandler,
    });

    expect(() => ShopifyWebhooks.Registry.process({headers: headers({hmac: ''}), body: rawBody})).toThrow(
      ShopifyErrors.InvalidWebhookError,
    );

    expect(() => ShopifyWebhooks.Registry.process({headers: headers({topic: ''}), body: rawBody})).toThrow(
      ShopifyErrors.InvalidWebhookError,
    );

    expect(() => ShopifyWebhooks.Registry.process({headers: headers({domain: ''}), body: rawBody})).toThrow(
      ShopifyErrors.InvalidWebhookError,
    );
  });
});

describe('ShopifyWebhooks.Registry.isWebhookPath', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = [];
  });

  it('returns true when given path is registered for a webhook topic', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'PRODUCTS',
      webhookHandler: genericWebhookHandler,
    });

    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(true);
  });

  it('returns false when given path is not registered for a webhook topic', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/fakepath',
      topic: 'PRODUCTS',
      webhookHandler: genericWebhookHandler,
    });

    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(false);
  });

  it('returns false when there is no webhooks registered', async () => {
    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(false);
  });
});

function headers({
  hmac = 'fake',
  topic = 'products',
  domain = 'shop1.myshopify.io',
  lowercase = false,
}: {hmac?: string; topic?: string; domain?: string; lowercase?: boolean;} = {}) {
  return {
    [lowercase ? ShopifyHeader.Hmac.toLowerCase() : ShopifyHeader.Hmac]: hmac,
    [lowercase ? ShopifyHeader.Topic.toLowerCase() : ShopifyHeader.Topic]: topic,
    [lowercase ? ShopifyHeader.Domain.toLowerCase() : ShopifyHeader.Domain]: domain,
  };
}

function hmac(secret: string, body: string) {
  return createHmac('sha256', secret).update(body, 'utf8').digest('base64');
}

function createWebhookCheckQuery(topic: string) {
  return `{
    webhookSubscriptions(first: 1, topics: ${topic}) {
      edges {
        node {
          id
          callbackUrl
        }
      }
    }
  }`;
}

function createWebhookQuery(topic: string, address: string, deliveryMethod?: DeliveryMethod, webhookId?: string) {
  const identifier = webhookId ? `id: "${webhookId}"` : `topic: ${topic}`;

  if (deliveryMethod && deliveryMethod === DeliveryMethod.EventBridge) {
    const name = webhookId ? 'eventBridgeWebhookSubscriptionUpdate' : 'eventBridgeWebhookSubscriptionCreate';
    return `
    mutation webhookSubscription {
      ${name}(${identifier}, webhookSubscription: {arn: "${address}"}) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;
  } else {
    const name = webhookId ? 'webhookSubscriptionUpdate' : 'webhookSubscriptionCreate';
    return `
    mutation webhookSubscription {
      ${name}(${identifier}, webhookSubscription: {callbackUrl: "${address}"}) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;
  }
}

function assertWebhookCheckRequest(webhook: RegisterOptions) {
  assertHttpRequest(
    Method.Post.toString(),
    webhook.shop,
    `/admin/api/${webhook.apiVersion}/graphql.json`,
    {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    createWebhookCheckQuery(webhook.topic),
  );
}

function assertWebhookRegistrationRequest(webhook: RegisterOptions, webhookId?: string) {
  assertHttpRequest(
    Method.Post.toString(),
    webhook.shop,
    `/admin/api/${webhook.apiVersion}/graphql.json`,
    {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    createWebhookQuery(webhook.topic, `https://${Context.HOST_NAME}${webhook.path}`, webhook.deliveryMethod, webhookId),
  );
}
