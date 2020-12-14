import { Method, Header, StatusCode } from '@shopify/network';
import '../../test/test_helper';
import { ApiVersion, ShopifyHeader } from "../../types";
import { DeliveryMethod, ProcessReturn, RegisterOptions } from '../registry';
import ShopifyWebhooks from '..';
import { createHmac } from 'crypto';
import { Context } from '../../context';
import { DataType } from '../../clients/http_client';
import { assertHttpRequest } from '../../clients/test/test_helper';

const successResponse = {
  data: {
    webhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: { id: 'gid://shopify/WebhookSubscription/12345' },
    },
  }
};

const eventBridgeSuccessResponse = {
  data: {
    eventBridgeWebhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: { id: 'gid://shopify/WebhookSubscription/12345' },
    },
  }
};

const failResponse = {
  data: {
  }
};

function genericWebhookHandler(topic: string, shop_domain: string, body: Buffer) {
  if (topic && shop_domain && body) {
    return;
  }
  return;
}

describe('ShopifyWebhooks.Registry.register', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = [];
  });

  it('sends a post request to the given shop domain with the webhook data as a GraphQL query in the body and the access token in the headers', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      webhookHandler: genericWebhookHandler
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(successResponse);
    expect(fetchMock.mock.calls.length).toBe(1);
    assertWebhookRegistrationRequest(webhook);
  });

  it('returns a result with success set to false, body set to empty object, when the server doesn’t return a webhookSubscriptionCreate field', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(failResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
      webhookHandler: genericWebhookHandler
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(false);
    expect(result.result).toEqual(failResponse);
    expect(fetchMock.mock.calls.length).toBe(1);
    assertWebhookRegistrationRequest(webhook);
  });

  it('sends an eventbridge registration GraphQL query for an eventbridge webhook registration', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.April20,
      deliveryMethod: DeliveryMethod.EventBridge,
      webhookHandler: genericWebhookHandler
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(eventBridgeSuccessResponse);
    expect(fetchMock.mock.calls.length).toBe(1);
    assertWebhookRegistrationRequest(webhook);
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
      webhookHandler: genericWebhookHandler
    });

    const result: ProcessReturn = ShopifyWebhooks.Registry.process({
      headers: headers({ hmac: hmac(Context.API_SECRET_KEY, rawBody.toString('utf8')) }),
      body: rawBody
    });

    expect(result.statusCode).toBe(StatusCode.Ok);
  });

  it('handles the request and returns Forbidden when topic is not registered', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'NONSENSE_TOPIC',
      webhookHandler: genericWebhookHandler
    });

    const result: ProcessReturn = ShopifyWebhooks.Registry.process({
      headers: headers({ hmac: hmac(Context.API_SECRET_KEY, rawBody.toString('utf8')) }),
      body: rawBody
    });

    expect(result.statusCode).toBe(StatusCode.Forbidden);
  });

  it('handles the request and returns Forbidden when hmac does not match', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/webhooks',
      topic: 'PRODUCTS',
      webhookHandler: genericWebhookHandler
    });

    const result: ProcessReturn = ShopifyWebhooks.Registry.process({
      headers: headers({ hmac: hmac('incorrect secret', rawBody.toString('utf8')) }),
      body: rawBody
    });

    expect(result.statusCode).toBe(StatusCode.Forbidden);
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
      webhookHandler: genericWebhookHandler
    });

    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(true);
  });

  it('returns false when given path is not registered for a webhook topic', async () => {
    ShopifyWebhooks.Registry.webhookRegistry.push({
      path: '/fakepath',
      topic: 'PRODUCTS',
      webhookHandler: genericWebhookHandler
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
}: { hmac?: string; topic?: string; domain?: string } = {}) {
  return {
    [ShopifyHeader.Hmac]: hmac,
    [ShopifyHeader.Topic]: topic,
    [ShopifyHeader.Domain]: domain,
  };
}

function hmac(secret: string, body: string) {
  return createHmac('sha256', secret).update(body, 'utf8').digest('base64');
}

function createWebhookQuery(topic: string, address: string, deliveryMethod?: DeliveryMethod) {
  if (deliveryMethod && deliveryMethod === DeliveryMethod.EventBridge) {
    return `
    mutation webhookSubscriptionCreate {
      eventBridgeWebhookSubscriptionCreate(topic: ${topic}, webhookSubscription: {arn: "${address}"}) {
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
  return `
    mutation webhookSubscriptionCreate {
      webhookSubscriptionCreate(topic: ${topic}, webhookSubscription: {callbackUrl: "${address}"}) {
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

function assertWebhookRegistrationRequest(webhook: RegisterOptions) {
  assertHttpRequest(
    Method.Post.toString(),
    webhook.shop,
    `/admin/api/${webhook.apiVersion}/graphql.json`,
    {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    createWebhookQuery(webhook.topic, `https://${Context.HOST_NAME}${webhook.path}`, webhook.deliveryMethod)
  );
}
