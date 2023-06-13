import {createHmac} from 'crypto';

import express from 'express';
import request from 'supertest';
import {Method, Header, StatusCode} from '@shopify/network';

import {
  DeliveryMethod,
  RegisterOptions,
  RegisterReturn,
  ShortenedRegisterOptions,
} from '../types';
import {ApiVersion, ShopifyHeader} from '../../base-types';
import {Context} from '../../context';
import {DataType} from '../../clients/types';
import {
  setAbstractFetchFunc,
  Request,
  Response,
  flatHeaders,
  canonicalizeHeaders,
} from '../../runtime/http';
import Shopify from '../../adapters/node';
import * as mockAdapter from '../../adapters/mock';
import ShopifyWebhooks from '..';
import {
  buildQuery as createWebhookQuery,
  buildCheckQuery as createWebhookCheckQuery,
  gdprTopics,
} from '../registry';

setAbstractFetchFunc(mockAdapter.abstractFetch);

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    /* eslint-disable @typescript-eslint/naming-convention */
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
      toMatchMadeHttpRequest(): R;
    }
    /* eslint-enable @typescript-eslint/naming-convention */
  }
}

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
  webhookId?: string,
): Promise<void> {
  if (!topic || !shopDomain || !body || !webhookId) {
    throw new Error('Missing webhook parameters');
  }
}

const TEST_WEBHOOK_ID = 'gid://shopify/WebhookSubscription/12345';

describe('ShopifyWebhooks.Registry.register', () => {
  beforeEach(async () => {
    Context.API_VERSION = ApiVersion.Unstable;
    ShopifyWebhooks.Registry.webhookRegistry = {};
    mockAdapter.reset();
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

  it('throws if a pubsub webhook is registered with an unsupported API version', async () => {
    expect(async () => {
      Context.API_VERSION = ApiVersion.April21;

      const topic = 'PRODUCTS_CREATE';
      await registerWebhook({
        topic,
        path: 'pubsub://my-project-id:my-new-topic-id',
        checkMockResponse: webhookCheckEmptyResponse,
        deliveryMethod: DeliveryMethod.PubSub,
        expectRegistrationQuery: false,
      });
    }).rejects.toThrow(ShopifyErrors.UnsupportedClientType);
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

    const result = await ShopifyWebhooks.Registry.register(
      webhook as RegisterOptions,
    );
    expect(result.PRODUCTS_CREATE.success).toBe(false);
  });

  it('only contains a single entry for a topic after an update', async () => {
    queueMockResponse(JSON.stringify(webhookCheckEmptyResponse));
    queueMockResponse(JSON.stringify(successResponse));
    let webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };
    await ShopifyWebhooks.Registry.addHandler('PRODUCTS_CREATE', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    await ShopifyWebhooks.Registry.register(webhook);
    expect('PRODUCTS_CREATE' in ShopifyWebhooks.Registry.webhookRegistry);

    // Add a second handler
    queueMockResponse(JSON.stringify(webhookCheckEmptyResponse));
    queueMockResponse(JSON.stringify(successResponse));
    webhook = {
      path: '/webhooks',
      topic: 'PRODUCTS_UPDATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };
    await ShopifyWebhooks.Registry.addHandler('PRODUCTS_UPDATE', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    await ShopifyWebhooks.Registry.register(webhook);
    expect('PRODUCTS_UPDATE' in ShopifyWebhooks.Registry.webhookRegistry);
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      2,
    );

    // Update the second handler and make sure we still have the two of them
    queueMockResponse(JSON.stringify(webhookCheckResponse));
    queueMockResponse(JSON.stringify(successUpdateResponse));
    webhook.path = '/webhooks/new';
    await ShopifyWebhooks.Registry.register(webhook);
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      2,
    );

    // Make sure we have one of each topic in the registry
    const actualTopics = Object.keys(ShopifyWebhooks.Registry.webhookRegistry);
    expect(actualTopics).toEqual(['PRODUCTS_CREATE', 'PRODUCTS_UPDATE']);
  });

  gdprTopics.forEach((gdprTopic) => {
    it(`does not send a register for ${gdprTopic}`, async () => {
      const webhook: RegisterOptions = {
        path: '/webhooks',
        topic: gdprTopic,
        accessToken: 'some token',
        shop: 'shop1.myshopify.io',
        deliveryMethod: DeliveryMethod.Http,
      };

      const response = await ShopifyWebhooks.Registry.register(webhook);
      expect(fetchMock.mock.calls).toHaveLength(0);
      expect(response[gdprTopic].success).toBeFalsy();
      expect(
        (response[gdprTopic].result as {errors: [{message: string}]}).errors[0]
          .message,
      ).toContain('cannot be registered here');
    });
  });

  it('does not send a register for NONSENSE_TOPIC', async () => {
    const topic = 'NONSENSE_TOPIC';
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic,
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: DeliveryMethod.Http,
    };

    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckErrorResponse));
    const response = await ShopifyWebhooks.Registry.register(webhook);
    expect(fetchMock.mock.calls).toHaveLength(1);
    expect(response[topic].success).toBeFalsy();
    expect(
      (response[topic].result as {errors: [{message: string}]}).errors[0]
        .message,
    ).toContain(
      `Argument 'topics' on Field 'webhookSubscriptions' has an invalid value`,
    );
  });
});

describe('ShopifyWebhooks.Registry.registerAll', () => {
  const shortenedRegisterOptions: ShortenedRegisterOptions = {
    accessToken: 'some token',
    shop: 'shop1.myshopify.io',
  };
  const productsCreate: RegisterOptions = {
    path: '/webhooks',
    topic: 'PRODUCTS_CREATE',
    ...shortenedRegisterOptions,
  };

  beforeEach(async () => {
    Context.API_VERSION = ApiVersion.Unstable;
    ShopifyWebhooks.Registry.webhookRegistry = {};
    ShopifyWebhooks.Registry.addHandler('PRODUCTS_CREATE', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
  });

  gdprTopics.forEach((gdprTopic) => {
    it(`does not send a register for ${gdprTopic} if handler added for ${gdprTopic}`, async () => {
      ShopifyWebhooks.Registry.addHandler(gdprTopic, {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      });
      expect(gdprTopic in ShopifyWebhooks.Registry.webhookRegistry);
      expect(
        Object.keys(ShopifyWebhooks.Registry.webhookRegistry),
      ).toHaveLength(2);

      fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
      fetchMock.mockResponseOnce(JSON.stringify(successResponse));

      await ShopifyWebhooks.Registry.registerAll(shortenedRegisterOptions);

      expect(fetchMock.mock.calls).toHaveLength(2);
      assertWebhookCheckRequest(productsCreate);
      assertWebhookRegistrationRequest(productsCreate);
    });
  });
});

describe('ShopifyWebhooks.Registry.process', () => {
  const rawBody = '{"foo": "bar"}';

  beforeEach(async () => {
    mockAdapter.reset();
    Context.API_SECRET_KEY = 'kitties are cute';
    Context.API_VERSION = ApiVersion.Unstable;
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);
  });

  afterEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('handles the request when topic is already registered', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });

    const app = express();
    app.post('/webhooks', expressAdapter(ShopifyWebhooks.Registry.process));

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(Context.API_SECRET_KEY, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Ok);
  });

  it('handles lower case headers', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    const app = express();
    app.post('/webhooks', expressAdapter(ShopifyWebhooks.Registry.process));

    await request(app)
      .post('/webhooks')
      .set(
        headers({
          hmac: hmac(Context.API_SECRET_KEY, rawBody),
          lowercase: true,
        }),
      )
      .send(rawBody)
      .expect(StatusCode.Ok);
  });

  it('handles the request and returns Not Found when topic is not registered', async () => {
    ShopifyWebhooks.Registry.addHandler('NONSENSE_TOPIC', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await expressAdapter(ShopifyWebhooks.Registry.process)(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(Shopify.Errors.InvalidWebhookError);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(Context.API_SECRET_KEY, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.NotFound);
  });

  it('handles the request and returns Unauthorized when hmac does not match', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await expressAdapter(ShopifyWebhooks.Registry.process)(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(Shopify.Errors.InvalidWebhookError);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac('incorrect secret', rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Unauthorized);
  });

  it('fails if the given body is empty', async () => {
    ShopifyWebhooks.Registry.addHandler('NONSENSE_TOPIC', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await expressAdapter(ShopifyWebhooks.Registry.process)(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(Shopify.Errors.InvalidWebhookError);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers())
      .expect(StatusCode.BadRequest);
  });

  it('fails if the any of the required headers are missing', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await expressAdapter(ShopifyWebhooks.Registry.process)(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(Shopify.Errors.InvalidWebhookError);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: ''}))
      .send(rawBody)
      .expect(StatusCode.BadRequest);

    await request(app)
      .post('/webhooks')
      .set(headers({topic: ''}))
      .send(rawBody)
      .expect(StatusCode.BadRequest);

    await request(app)
      .post('/webhooks')
      .set(headers({domain: ''}))
      .send(rawBody)
      .expect(StatusCode.BadRequest);
  });

  it('catches handler errors but still responds', async () => {
    const errorMessage = 'Oh no something went wrong!';

    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: () => {
        throw new Error(errorMessage);
      },
    });

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await expressAdapter(ShopifyWebhooks.Registry.process)(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error.message).toEqual(errorMessage);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(Context.API_SECRET_KEY, rawBody)}))
      .send(rawBody)
      .expect(500);
  });
});

describe('ShopifyWebhooks.Registry.isWebhookPath', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('returns true when given path is registered for a webhook topic', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });

    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(true);
  });

  it('returns false when given path is not registered for a webhook topic', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/fakepath',
      webhookHandler: genericWebhookHandler,
    });

    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(false);
  });

  it('returns false when there is no webhooks registered', async () => {
    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(false);
  });
});

describe('ShopifyWebhooks.Registry.addHandler', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('adds two handlers to the webhook registry', async () => {
    await ShopifyWebhooks.Registry.addHandler('PRODUCTS_CREATE', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      1,
    );

    await ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      2,
    );
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS',
    ]);
  });

  it('adds a handler and replaces it with a new one', async () => {
    await ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      1,
    );

    await ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhookspath',
      webhookHandler: genericWebhookHandler,
    });
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      1,
    );

    expect(ShopifyWebhooks.Registry.webhookRegistry.PRODUCTS.path).toBe(
      '/webhookspath',
    );
  });
});

describe('ShopifyWebhooks.Registry.addHandlers', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('adds two unique handlers to the webhook registry', async () => {
    await ShopifyWebhooks.Registry.addHandlers({
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
      PRODUCTS: {path: '/webhooks', webhookHandler: genericWebhookHandler},
    });
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      2,
    );
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS',
    ]);
  });

  it('adds multiple handlers with duplicates', async () => {
    await ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    await ShopifyWebhooks.Registry.addHandlers({
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
      PRODUCTS: {path: '/newerpath', webhookHandler: genericWebhookHandler},
    });
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(
      2,
    );
    expect(
      Object.keys(ShopifyWebhooks.Registry.webhookRegistry).sort(),
    ).toEqual(['PRODUCTS_CREATE', 'PRODUCTS'].sort());
    expect(ShopifyWebhooks.Registry.webhookRegistry.PRODUCTS.path).toBe(
      '/newerpath',
    );
  });
});

describe('ShopifyWebhooks.Registry.getHandler', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('gets a nonexistent handler', async () => {
    expect(ShopifyWebhooks.Registry.getHandler('PRODUCTS')).toBe(null);
  });

  it('gets a handler', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    expect(ShopifyWebhooks.Registry.getHandler('PRODUCTS')).toStrictEqual({
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
  });
});

describe('ShopifyWebhooks.Registry.getTopics', () => {
  beforeEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('gets an empty list of topics', async () => {
    expect(ShopifyWebhooks.Registry.getTopics()).toStrictEqual([]);
  });

  it('adds two handlers and gets them', async () => {
    ShopifyWebhooks.Registry.addHandler('PRODUCTS', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    ShopifyWebhooks.Registry.addHandler('PRODUCTS_CREATE', {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    });
    expect(ShopifyWebhooks.Registry.getTopics()).toStrictEqual([
      'PRODUCTS',
      'PRODUCTS_CREATE',
    ]);
  });
});

function headers({
  hmac = 'fake',
  topic = 'products',
  domain = 'shop1.myshopify.io',
  webhookId = 'b54557e4-bdd9-4b37-8a5f-bf7d70bcd043',
  lowercase = false,
}: {
  hmac?: string;
  topic?: string;
  domain?: string;
  webhookId?: string;
  lowercase?: boolean;
} = {}) {
  return {
    [lowercase ? ShopifyHeader.Hmac.toLowerCase() : ShopifyHeader.Hmac]: hmac,
    [lowercase ? ShopifyHeader.Topic.toLowerCase() : ShopifyHeader.Topic]:
      topic,
    [lowercase ? ShopifyHeader.Domain.toLowerCase() : ShopifyHeader.Domain]:
      domain,
    [lowercase
      ? ShopifyHeader.WebhookId.toLowerCase()
      : ShopifyHeader.WebhookId]: webhookId,
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
  const webhook: RegisterOptions = {
    path,
    topic,
    accessToken: 'some token',
    shop: 'shop1.myshopify.io',
    deliveryMethod,
  };

  const result = await ShopifyWebhooks.Registry.register(webhook);

  if (expectRegistrationQuery) {
    // expect(fetchMock.mock.calls).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  } else {
    // expect(fetchMock.mock.calls).toHaveLength(1);
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

function assertWebhookCheckRequest(webhook: RegisterOptions) {
  expect({
    method: Method.Post.toString(),
    domain: webhook.shop,
    path: `/admin/api/${Context.API_VERSION}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    data: createWebhookCheckQuery(webhook.topic),
  }).toMatchMadeHttpRequest();
}

function assertWebhookRegistrationRequest(
  webhook: RegisterOptions,
  webhookId?: string | undefined,
) {
  const address =
    !webhook.deliveryMethod || webhook.deliveryMethod === DeliveryMethod.Http
      ? `${Context.HOST_SCHEME}://${Context.HOST_NAME}${webhook.path}`
      : webhook.path;
  expect({
    method: Method.Post.toString(),
    domain: webhook.shop,
    path: `/admin/api/${Context.API_VERSION}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    data: createWebhookQuery(
      webhook.topic,
      address,
      webhook.deliveryMethod,
      webhookId,
    ),
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

function queueMockResponse(body: string, partial: Partial<Response> = {}) {
  mockAdapter.queueResponse({
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    ...partial,
    body,
  });
}

function expressAdapter(
  func: (req: Request, res: Response) => Promise<void>,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async function (
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    const body = await new Promise<string>((resolve, reject) => {
      let str = '';
      req.on('data', (chunk) => {
        str += chunk.toString();
      });
      req.on('error', (error) => reject(error));
      req.on('end', () => resolve(str));
    });
    const internalRequest: Request = {
      method: req.method,
      headers: canonicalizeHeaders(req.headers as any),
      url: req.url,
      body,
    };
    const internalResponse: Response = {
      statusCode: 204,
      statusText: 'No content',
    };
    let thrown;
    try {
      await func(internalRequest, internalResponse);
    } catch (err) {
      thrown = err;
    }
    res.statusCode = internalResponse.statusCode;
    res.statusMessage = internalResponse.statusText;
    for (const [key, values] of flatHeaders(internalResponse.headers ?? {})) {
      res.header(key, values);
    }
    res.end(internalResponse.body);
    if (thrown) throw thrown;
  };
}

// function queueMockResponses(
//   ...responses: Parameters<typeof queueMockResponse>[]
// ) {
//   for (const [body, response] of responses) {
//     queueMockResponse(body, response);
//   }
// }

// function buildExpectedResponse(body: string): Response {
//   const expectedResponse: Partial<Response> = {
//     headers: expect.objectContaining({}),
//     body: JSON.parse(body),
//   };

//   return expect.objectContaining(expectedResponse);
// }
