import {createHmac} from 'crypto';

import express from 'express';
import request from 'supertest';
import {Method, Header, StatusCode} from '@shopify/network';

import {
  DeliveryMethod,
  RegisterParams,
  RegisterReturn,
  ShortenedRegisterParams,
} from '../types';
import {
  ApiVersion,
  ConfigParams,
  gdprTopics,
  LATEST_API_VERSION,
  ShopifyHeader,
} from '../../base-types';
import {DataType} from '../../clients/types';
import * as ShopifyErrors from '../../error';
import {
  buildQuery as createWebhookQuery,
  buildCheckQuery as createWebhookCheckQuery,
} from '../registry';
import {queueMockResponse, shopify} from '../../__tests__/test-helper';
import {mockTestRequests} from '../../adapters/mock/mock_test_requests';
import {shopifyApi} from '../..';
import {MemorySessionStorage} from '../../session-storage/memory';
import type {shopifyWebhooks} from '..';

type ShopifyWebhooksWithTesting = ReturnType<typeof shopifyWebhooks>;
type ShopifyWebhooksTesting = ReturnType<typeof shopifyWebhooks>['testing'];

interface MockResponse {
  [key: string]: unknown;
}

interface RegisterTestWebhook {
  topic: string;
  path?: string;
  registerMockResponse?: MockResponse;
  checkMockResponse?: MockResponse;
  deliveryMethod?: DeliveryMethod;
  webhookId?: string | undefined;
  expectRegistrationQuery?: boolean;
}

interface RegisterTestResponse {
  topic: string;
  webhook: RegisterReturn;
  expectedSuccess?: boolean;
  expectedResponse: MockResponse;
}

async function genericWebhookHandler(
  topic: string,
  shopDomain: string,
  body: string,
): Promise<void> {
  if (!topic || !shopDomain || !body) {
    throw new Error('Missing webhook parameters');
  }
}

const TEST_WEBHOOK_ID = 'gid://shopify/WebhookSubscription/12345';

describe('shopify.webhooks.register', () => {
  let testing: ShopifyWebhooksTesting;

  beforeEach(async () => {
    shopify.config.apiVersion = ApiVersion.Unstable;
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
  });

  it('sends a post request to the given shop domain with the webhook data as a GraphQL query in the body and the access token in the headers', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      registerMockResponse: successResponse,
    });

    assertRegisterResponse({webhook, topic, expectedResponse: successResponse});
  });

  it('returns a result with success set to false, body set to empty object, when the server doesn’t return a webhookSubscriptionCreate field', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      registerMockResponse: failResponse,
    });

    assertRegisterResponse({
      webhook,
      topic,
      expectedResponse: failResponse,
      expectedSuccess: false,
    });
  });

  it('sends an eventbridge registration GraphQL query for an eventbridge webhook registration', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      path: 'arn:test',
      deliveryMethod: DeliveryMethod.EventBridge,
      registerMockResponse: eventBridgeSuccessResponse,
    });

    assertRegisterResponse({
      webhook,
      topic,
      expectedResponse: eventBridgeSuccessResponse,
    });
  });

  it('sends a pubsub registration GraphQL query for a pubsub webhook registration', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      path: 'pubsub://my-project-id:my-topic-id',
      deliveryMethod: DeliveryMethod.PubSub,
      registerMockResponse: pubSubSuccessResponse,
    });

    assertRegisterResponse({
      webhook,
      topic,
      expectedResponse: pubSubSuccessResponse,
    });
  });

  it('updates a pre-existing webhook even if it is already registered with Shopify', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      path: '/webhooks/new',
      checkMockResponse: webhookCheckResponse,
      registerMockResponse: successUpdateResponse,
      webhookId: TEST_WEBHOOK_ID,
    });

    assertRegisterResponse({
      webhook,
      topic,
      expectedResponse: successUpdateResponse,
    });
  });

  it('updates a pre-existing eventbridge webhook even if it is already registered with Shopify', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      path: 'arn:test-new',
      checkMockResponse: eventBridgeWebhookCheckResponse,
      registerMockResponse: eventBridgeSuccessUpdateResponse,
      webhookId: TEST_WEBHOOK_ID,
      deliveryMethod: DeliveryMethod.EventBridge,
    });

    assertRegisterResponse({
      webhook,
      topic,
      expectedResponse: eventBridgeSuccessUpdateResponse,
    });
  });

  it('updates a pre-existing pubsub webhook even if it is already registered with Shopify', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      path: 'pubsub://my-project-id:my-new-topic-id',
      checkMockResponse: pubSubWebhookCheckResponse,
      registerMockResponse: pubSubSuccessUpdateResponse,
      webhookId: TEST_WEBHOOK_ID,
      deliveryMethod: DeliveryMethod.PubSub,
    });

    assertRegisterResponse({
      webhook,
      topic,
      expectedResponse: pubSubSuccessUpdateResponse,
    });
  });

  it('fully skips registering a webhook if it is already registered with Shopify and its callback is the same', async () => {
    const topic = 'PRODUCTS_CREATE';
    const webhook = await registerWebhook({
      topic,
      path: 'arn:test',
      checkMockResponse: eventBridgeWebhookCheckResponse,
      deliveryMethod: DeliveryMethod.EventBridge,
      expectRegistrationQuery: false,
    });

    expect(webhook[topic].success).toBe(true);
    expect(webhook[topic].result).toEqual({});
  });

  it('fails if given an invalid DeliveryMethod', async () => {
    queueMockResponse(JSON.stringify(webhookCheckEmptyResponse));
    queueMockResponse(JSON.stringify(eventBridgeSuccessResponse));
    const webhook = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: 'Something else',
    };

    const result = await shopify.webhooks.register(webhook as RegisterParams);
    expect(result.PRODUCTS_CREATE.success).toBe(false);
  });

  it('only contains a single entry for a topic after an update', async () => {
    queueMockResponse(JSON.stringify(webhookCheckEmptyResponse));
    queueMockResponse(JSON.stringify(successResponse));
    let webhook: RegisterParams = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };
    await shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS_CREATE',
      handler: genericWebhookHandler,
    });
    await shopify.webhooks.register(webhook);
    expect(testing.topicInHttpWebhookRegistry('PRODUCTS_CREATE')).toBe(true);

    // Add a second handler
    queueMockResponse(JSON.stringify(webhookCheckEmptyResponse));
    queueMockResponse(JSON.stringify(successResponse));
    webhook = {
      path: '/webhooks',
      topic: 'PRODUCTS_UPDATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };
    await shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS_UPDATE',
      handler: genericWebhookHandler,
    });
    await shopify.webhooks.register(webhook);
    expect(testing.topicInHttpWebhookRegistry('PRODUCTS_UPDATE')).toBe(true);
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(2);

    // Update the second handler and make sure we still have the two of them
    queueMockResponse(JSON.stringify(webhookCheckResponse));
    queueMockResponse(JSON.stringify(successUpdateResponse));
    webhook.path = '/webhooks/new';
    await shopify.webhooks.register(webhook);
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(2);

    // Make sure we have one of each topic in the HTTP registry
    const actualTopics = testing.httpWebhookRegistryKeys();
    expect(actualTopics).toEqual(['PRODUCTS_CREATE', 'PRODUCTS_UPDATE']);
  });

  gdprTopics.forEach((gdprTopic) => {
    it(`does not send a register for ${gdprTopic}`, async () => {
      const webhook: RegisterParams = {
        path: '/webhooks',
        topic: gdprTopic,
        accessToken: 'some token',
        shop: 'shop1.myshopify.io',
        deliveryMethod: DeliveryMethod.Http,
      };

      const response = await shopify.webhooks.register(webhook);
      expect(mockTestRequests.requestList).toHaveLength(0);
      expect(response[gdprTopic].success).toBeFalsy();
      expect(
        (response[gdprTopic].result as {errors: [{message: string}]}).errors[0]
          .message,
      ).toContain('cannot be registered here');
    });
  });

  it('does not send a register for NONSENSE_TOPIC', async () => {
    const topic = 'NONSENSE_TOPIC';
    const webhook: RegisterParams = {
      path: '/webhooks',
      topic,
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: DeliveryMethod.Http,
    };

    queueMockResponse(JSON.stringify(webhookCheckErrorResponse));
    const response = await shopify.webhooks.register(webhook);
    expect(mockTestRequests.requestList).toHaveLength(1);
    expect(response[topic].success).toBeFalsy();
    expect(
      (response[topic].result as {errors: [{message: string}]}).errors[0]
        .message,
    ).toContain(
      `Argument 'topics' on Field 'webhookSubscriptions' has an invalid value`,
    );
  });
});

describe('shopify.webhooks.registerAllHttp', () => {
  const shortenedRegisterParams: ShortenedRegisterParams = {
    path: '/webhooks',
    accessToken: 'some token',
    shop: 'shop1.myshopify.io',
  };
  const productsCreate: RegisterParams = {
    topic: 'PRODUCTS_CREATE',
    ...shortenedRegisterParams,
  };
  let testing: ShopifyWebhooksTesting;

  beforeEach(async () => {
    shopify.config.apiVersion = ApiVersion.Unstable;
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
    testing.resetHttpWebhookRegistry();
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS_CREATE',
      handler: genericWebhookHandler,
    });
  });

  gdprTopics.forEach((gdprTopic) => {
    it(`does not send a register for ${gdprTopic} if handler added for ${gdprTopic}`, async () => {
      shopify.webhooks.addHttpHandler({
        topic: gdprTopic,
        handler: genericWebhookHandler,
      });
      expect(testing.topicInHttpWebhookRegistry(gdprTopic)).toBe(true);
      expect(testing.httpWebhookRegistryKeys()).toHaveLength(2);

      queueMockResponse(JSON.stringify(webhookCheckEmptyResponse));
      queueMockResponse(JSON.stringify(successResponse));

      await shopify.webhooks.registerAllHttp(shortenedRegisterParams);

      expect(mockTestRequests.requestList).toHaveLength(2);
      assertWebhookCheckRequest(productsCreate);
      assertWebhookRegistrationRequest(productsCreate);
    });
  });
});

describe('shopify.webhooks.process', () => {
  const rawBody = '{"foo": "bar"}';
  let testing: ShopifyWebhooksTesting;

  const parseRawBody = (req: any, _res: any, next: any) => {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', (chunk: any) => {
      req.rawBody += chunk;
    });
    req.on('end', () => {
      next();
    });
  };

  const app = express();
  app.use(parseRawBody);
  app.post('/webhooks', async (req, res) => {
    let errorThrown = false;
    let statusCode = StatusCode.Ok;
    try {
      await shopify.webhooks.process({
        rawBody: (req as any).rawBody,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(ShopifyErrors.InvalidWebhookError);
      statusCode = error.response.statusCode;
    }
    res.status(statusCode).json({errorThrown});
  });

  beforeEach(async () => {
    shopify.config.apiSecretKey = 'kitties are cute';
    shopify.config.apiVersion = ApiVersion.Unstable;
    shopify.config.isEmbeddedApp = true;
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
    testing.resetHttpWebhookRegistry();
  });

  it('handles the request when topic is already registered', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.Ok);
    expect(response.body.errorThrown).toBeFalsy();
  });

  it('handles lower case headers', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });

    const response = await request(app)
      .post('/webhooks')
      .set(
        headers({
          hmac: hmac(shopify.config.apiSecretKey, rawBody),
          lowercase: true,
        }),
      )
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.Ok);
    expect(response.body.errorThrown).toBeFalsy();
  });

  it('handles the request and returns Not Found when topic is not registered', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'NONSENSE_TOPIC',
      handler: genericWebhookHandler,
    });

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.NotFound);
    expect(response.body.errorThrown).toBeTruthy();
  });

  it('handles the request and returns Unauthorized when hmac does not match', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac('incorrect secret', rawBody)}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.Unauthorized);
    expect(response.body.errorThrown).toBeTruthy();
  });

  it('fails if the given body is empty', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'NONSENSE_TOPIC',
      handler: genericWebhookHandler,
    });

    const response = await request(app).post('/webhooks').set(headers());

    expect(response.status).toEqual(StatusCode.BadRequest);
    expect(response.body.errorThrown).toBeTruthy();
  });

  it('fails if the any of the required headers are missing', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });

    let response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: ''}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.BadRequest);
    expect(response.body.errorThrown).toBeTruthy();

    response = await request(app)
      .post('/webhooks')
      .set(headers({topic: ''}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.BadRequest);
    expect(response.body.errorThrown).toBeTruthy();

    response = await request(app)
      .post('/webhooks')
      .set(headers({domain: ''}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.BadRequest);
    expect(response.body.errorThrown).toBeTruthy();
  });

  it('catches handler errors but still responds', async () => {
    const errorMessage = 'Oh no something went wrong!';

    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: () => {
        throw new Error(errorMessage);
      },
    });

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.InternalServerError);
    expect(response.body.errorThrown).toBeTruthy();
  });
});

describe('shopify.webhooks.addHttpHandler', () => {
  let testing: ShopifyWebhooksTesting;

  beforeEach(async () => {
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
    testing.resetHttpWebhookRegistry();
  });

  it('adds two handlers to the HTTP webhook registry', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS_CREATE',
      handler: genericWebhookHandler,
    });
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(1);

    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(2);
    expect(testing.httpWebhookRegistryKeys()).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS',
    ]);
  });

  it('adds a handler and replaces it with a new one', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(1);

    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(1);
  });

  it('adds handler with lowercase/slash format to the HTTP webhook registry', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'products/create',
      handler: genericWebhookHandler,
    });
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(1);
    expect(testing.httpWebhookRegistryKeys()).toEqual(['PRODUCTS_CREATE']);
  });
});

describe('shopify.webhooks.addHttpHandlers', () => {
  let testing: ShopifyWebhooksTesting;

  beforeEach(async () => {
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
    testing.resetHttpWebhookRegistry();
  });

  it('adds two unique handlers to the HTTP webhook registry', async () => {
    shopify.webhooks.addHttpHandlers([
      {topic: 'PRODUCTS_CREATE', handler: genericWebhookHandler},
      {topic: 'PRODUCTS', handler: genericWebhookHandler},
    ]);
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(2);
    expect(testing.httpWebhookRegistryKeys()).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS',
    ]);
  });

  it('adds multiple handlers with duplicates', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });
    shopify.webhooks.addHttpHandlers([
      {topic: 'PRODUCTS_CREATE', handler: genericWebhookHandler},
      {topic: 'PRODUCTS', handler: genericWebhookHandler},
    ]);
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(2);
    expect(testing.httpWebhookRegistryKeys().sort()).toEqual(
      ['PRODUCTS_CREATE', 'PRODUCTS'].sort(),
    );
  });

  it('adds handlers with lowercase/slash format to the HTTP webhook registry', async () => {
    shopify.webhooks.addHttpHandlers([
      {topic: 'products/create', handler: genericWebhookHandler},
      {topic: 'products/delete', handler: genericWebhookHandler},
    ]);
    expect(testing.httpWebhookRegistryKeys()).toHaveLength(2);
    expect(testing.httpWebhookRegistryKeys()).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS_DELETE',
    ]);
  });
});

describe('shopify.webhooks.getHttpHandler', () => {
  let testing: ShopifyWebhooksTesting;

  beforeEach(async () => {
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
    testing.resetHttpWebhookRegistry();
  });

  it('gets a nonexistent handler', async () => {
    expect(shopify.webhooks.getHttpHandler('PRODUCTS')).toBe(null);
  });

  it('gets a handler', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });
    expect(shopify.webhooks.getHttpHandler('PRODUCTS')).toStrictEqual(
      genericWebhookHandler,
    );
  });

  it('gets a handler using lowercase and slash format', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS_CREATE',
      handler: genericWebhookHandler,
    });
    expect(shopify.webhooks.getHttpHandler('products/create')).toStrictEqual(
      genericWebhookHandler,
    );
  });

  it('gets a handler registered using lowercase and slash format using uppercase format', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'products/create',
      handler: genericWebhookHandler,
    });
    expect(shopify.webhooks.getHttpHandler('PRODUCTS_CREATE')).toStrictEqual(
      genericWebhookHandler,
    );
  });
});

describe('shopify.webhooks.getTopicsAdded', () => {
  let testing: ShopifyWebhooksTesting;

  beforeEach(async () => {
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
    testing.resetHttpWebhookRegistry();
  });

  it('gets an empty list of topics', async () => {
    expect(shopify.webhooks.getTopicsAdded()).toStrictEqual([]);
  });

  it('adds two handlers and gets them', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: genericWebhookHandler,
    });
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS_CREATE',
      handler: genericWebhookHandler,
    });
    expect(shopify.webhooks.getTopicsAdded()).toStrictEqual([
      'PRODUCTS',
      'PRODUCTS_CREATE',
    ]);
  });
});

describe('dual webhook registry instances', () => {
  let testing: ShopifyWebhooksTesting;
  let testing2: ShopifyWebhooksTesting;

  const testConfig2: ConfigParams = {
    apiKey: 'test_key_2',
    apiSecretKey: 'dogs are cute too',
    scopes: ['test_scope2'],
    hostName: 'test_host_name_2',
    hostScheme: 'https',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: true,
    isPrivateApp: false,
    sessionStorage: new MemorySessionStorage(),
    customShopDomains: undefined,
    billing: undefined,
  };

  const shopify2 = shopifyApi(testConfig2);

  let webhookHandlerCalled = false;
  async function webhookHandler(
    _topic: string,
    _shopDomain: string,
    _body: string,
  ): Promise<void> {
    webhookHandlerCalled = true;
  }

  let webhookHandler2Called = false;
  async function webhookHandler2(
    _topic: string,
    _shopDomain: string,
    _body: string,
  ): Promise<void> {
    webhookHandler2Called = true;
  }

  beforeEach(async () => {
    testing = (shopify.webhooks as ShopifyWebhooksWithTesting).testing;
    testing2 = (shopify2.webhooks as ShopifyWebhooksWithTesting).testing;
    testing.resetHttpWebhookRegistry();
    testing2.resetHttpWebhookRegistry();

    shopify.config.apiSecretKey = 'kitties are cute';
    shopify.config.isEmbeddedApp = true;

    webhookHandlerCalled = false;
    webhookHandler2Called = false;
  });

  it('adds different handlers for different topics to each registry', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: webhookHandler,
    });
    shopify2.webhooks.addHttpHandler({
      topic: 'PRODUCTS_CREATE',
      handler: webhookHandler2,
    });
    expect(shopify.webhooks.getTopicsAdded()).toStrictEqual(['PRODUCTS']);
    expect(shopify.webhooks.getHttpHandler('PRODUCTS')).toStrictEqual(
      webhookHandler,
    );
    expect(shopify.webhooks.getHttpHandler('PRODUCTS_CREATE')).toBeNull();
    expect(shopify2.webhooks.getTopicsAdded()).toStrictEqual([
      'PRODUCTS_CREATE',
    ]);
    expect(shopify2.webhooks.getHttpHandler('PRODUCTS_CREATE')).toStrictEqual(
      webhookHandler2,
    );
    expect(shopify2.webhooks.getHttpHandler('PRODUCTS')).toBeNull();
  });

  it('adds different handlers for same topic to each registry', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: webhookHandler,
    });
    shopify2.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: webhookHandler2,
    });
    expect(shopify.webhooks.getTopicsAdded()).toStrictEqual(['PRODUCTS']);
    expect(shopify.webhooks.getHttpHandler('PRODUCTS')).toStrictEqual(
      webhookHandler,
    );
    expect(shopify2.webhooks.getTopicsAdded()).toStrictEqual(['PRODUCTS']);
    expect(shopify2.webhooks.getHttpHandler('PRODUCTS')).toStrictEqual(
      webhookHandler2,
    );
  });

  const rawBody = '{"foo": "bar"}';
  const parseRawBody = (req: any, _res: any, next: any) => {
    req.setEncoding('utf8');
    req.rawBody = '';
    req.on('data', (chunk: any) => {
      req.rawBody += chunk;
    });
    req.on('end', () => {
      next();
    });
  };

  const app = express();
  app.use(parseRawBody);
  app.post('/webhooks', async (req, res) => {
    let errorThrown = false;
    let statusCode = StatusCode.Ok;
    try {
      await shopify.webhooks.process({
        rawBody: (req as any).rawBody,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(ShopifyErrors.InvalidWebhookError);
      statusCode = error.response.statusCode;
    }
    res.status(statusCode).json({errorThrown});
  });
  app.post('/webhooks2', async (req, res) => {
    let errorThrown = false;
    let statusCode = StatusCode.Ok;
    try {
      await shopify2.webhooks.process({
        rawBody: (req as any).rawBody,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      errorThrown = true;
      expect(error).toBeInstanceOf(ShopifyErrors.InvalidWebhookError);
      statusCode = error.response.statusCode;
    }
    res.status(statusCode).json({errorThrown});
  });

  it('can fire handlers from different instances', async () => {
    shopify.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: webhookHandler,
    });
    shopify2.webhooks.addHttpHandler({
      topic: 'PRODUCTS',
      handler: webhookHandler2,
    });

    let response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.Ok);
    expect(response.body.errorThrown).toBeFalsy();
    expect(webhookHandlerCalled).toBeTruthy();
    expect(webhookHandler2Called).toBeFalsy();
    webhookHandlerCalled = false;

    response = await request(app)
      .post('/webhooks2')
      .set(headers({hmac: hmac(shopify2.config.apiSecretKey, rawBody)}))
      .send(rawBody);

    expect(response.status).toEqual(StatusCode.Ok);
    expect(response.body.errorThrown).toBeFalsy();
    expect(webhookHandler2Called).toBeTruthy();
    expect(webhookHandlerCalled).toBeFalsy();
  });
});

function headers({
  hmac = 'fake',
  topic = 'products',
  domain = 'shop1.myshopify.io',
  lowercase = false,
}: {
  hmac?: string;
  topic?: string;
  domain?: string;
  lowercase?: boolean;
} = {}) {
  return {
    [lowercase ? ShopifyHeader.Hmac.toLowerCase() : ShopifyHeader.Hmac]: hmac,
    [lowercase ? ShopifyHeader.Topic.toLowerCase() : ShopifyHeader.Topic]:
      topic,
    [lowercase ? ShopifyHeader.Domain.toLowerCase() : ShopifyHeader.Domain]:
      domain,
  };
}

function hmac(secret: string, body: string) {
  return createHmac('sha256', secret).update(body, 'utf8').digest('base64');
}

async function registerWebhook({
  topic,
  path = '/webhooks',
  registerMockResponse = undefined,
  checkMockResponse = webhookCheckEmptyResponse,
  deliveryMethod = DeliveryMethod.Http,
  webhookId = undefined,
  expectRegistrationQuery = true,
}: RegisterTestWebhook): Promise<RegisterReturn> {
  queueMockResponse(JSON.stringify(checkMockResponse));
  if (expectRegistrationQuery) {
    queueMockResponse(JSON.stringify(registerMockResponse));
  }
  const webhook: RegisterParams = {
    path,
    topic,
    accessToken: 'some token',
    shop: 'shop1.myshopify.io',
    deliveryMethod,
  };

  const result = await shopify.webhooks.register(webhook);

  if (expectRegistrationQuery) {
    expect(mockTestRequests.requestList).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  } else {
    expect(mockTestRequests.requestList).toHaveLength(1);
    assertWebhookCheckRequest(webhook);
  }
  return result;
}

function assertRegisterResponse({
  webhook,
  topic,
  expectedSuccess = true,
  expectedResponse,
}: RegisterTestResponse) {
  expect(webhook[topic].success).toBe(expectedSuccess);
  expect(webhook[topic].result).toEqual(expectedResponse);
}

function assertWebhookCheckRequest(webhook: RegisterParams) {
  expect({
    method: Method.Post.toString(),
    domain: webhook.shop,
    path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    data: createWebhookCheckQuery({topic: webhook.topic}),
  }).toMatchMadeHttpRequest();
}

function assertWebhookRegistrationRequest(
  webhook: RegisterParams,
  webhookId?: string | undefined,
) {
  const address =
    !webhook.deliveryMethod || webhook.deliveryMethod === DeliveryMethod.Http
      ? `${shopify.config.hostScheme}://${shopify.config.hostName}${webhook.path}`
      : webhook.path;
  expect({
    method: Method.Post.toString(),
    domain: webhook.shop,
    path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    data: createWebhookQuery({
      topic: webhook.topic,
      address,
      deliveryMethod: webhook.deliveryMethod!,
      webhookId,
    }),
  }).toMatchMadeHttpRequest();
}

const webhookCheckEmptyResponse: MockResponse = {
  data: {
    webhookSubscriptions: {
      edges: [],
    },
  },
};

const webhookCheckErrorResponse: MockResponse = {
  errors: [
    {
      message:
        "Argument 'topics' on Field 'webhookSubscriptions' has an invalid value (topic). Expected type '[WebhookSubscriptionTopic!]'.",
    },
  ],
};

const webhookCheckResponse: MockResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: TEST_WEBHOOK_ID,
            endpoint: {
              __typename: 'WebhookHttpEndpoint',
              callbackUrl: 'https://test_host_name/webhooks',
            },
          },
        },
      ],
    },
  },
};

const eventBridgeWebhookCheckResponse: MockResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: TEST_WEBHOOK_ID,
            endpoint: {
              __typename: 'WebhookEventBridgeEndpoint',
              arn: 'arn:test',
            },
          },
        },
      ],
    },
  },
};

const pubSubWebhookCheckResponse: MockResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: TEST_WEBHOOK_ID,
            endpoint: {
              __typename: 'WebhookPubSubEndpoint',
              pubSubProject: 'my-project-id',
              pubSubTopic: 'my-topic-id',
            },
          },
        },
      ],
    },
  },
};

const successResponse: MockResponse = {
  data: {
    webhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: {id: TEST_WEBHOOK_ID},
    },
  },
};

const eventBridgeSuccessResponse: MockResponse = {
  data: {
    eventBridgeWebhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: {id: TEST_WEBHOOK_ID},
    },
  },
};

const pubSubSuccessResponse: MockResponse = {
  data: {
    pubSubWebhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: {id: TEST_WEBHOOK_ID},
    },
  },
};

const successUpdateResponse: MockResponse = {
  data: {
    webhookSubscriptionUpdate: {
      userErrors: [],
      webhookSubscription: {id: TEST_WEBHOOK_ID},
    },
  },
};

const eventBridgeSuccessUpdateResponse: MockResponse = {
  data: {
    eventBridgeWebhookSubscriptionUpdate: {
      userErrors: [],
      webhookSubscription: {id: TEST_WEBHOOK_ID},
    },
  },
};

const pubSubSuccessUpdateResponse: MockResponse = {
  data: {
    pubSubWebhookSubscriptionUpdate: {
      userErrors: [],
      webhookSubscription: {id: TEST_WEBHOOK_ID},
    },
  },
};

const failResponse: MockResponse = {
  data: {},
};
