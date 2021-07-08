import '../../test/test_helper';
import {createHmac} from 'crypto';

import express from 'express';
import request from 'supertest';
import {Method, Header, StatusCode} from '@shopify/network';

import {DeliveryMethod, RegisterOptions} from '../types';
import {ApiVersion, ShopifyHeader} from '../../base_types';
import {Context} from '../../context';
import {DataType} from '../../clients/types';
import {assertHttpRequest} from '../../clients/http_client/test/test_helper';
import ShopifyWebhooks from '..';
import * as ShopifyErrors from '../../error';
import {
  buildQuery as createWebhookQuery,
  buildCheckQuery as createWebhookCheckQuery,
} from '../registry';

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

const eventBridgeWebhookCheckResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: webhookId,
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

const pubSubWebhookCheckResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: webhookId,
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

const webhookCheckResponseLegacy = {
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

const pubSubSuccessResponse = {
  data: {
    pubSubWebhookSubscriptionCreate: {
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

const pubSubSuccessUpdateResponse = {
  data: {
    pubSubWebhookSubscriptionUpdate: {
      userErrors: [],
      webhookSubscription: {id: webhookId},
    },
  },
};

const failResponse = {
  data: {},
};

async function genericWebhookHandler(
  topic: string,
  shopDomain: string,
  body: string,
): Promise<void> {
  if (!topic || !shopDomain || !body) {
    throw new Error('Missing webhook parameters');
  }
}

describe('ShopifyWebhooks.Registry.register', () => {
  beforeEach(async () => {
    Context.API_VERSION = ApiVersion.Unstable;
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('sends a post request to the given shop domain with the webhook data as a GraphQL query in the body and the access token in the headers', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(successResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
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
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(false);
    expect(result.result).toEqual(failResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook);
  });

  it('sends an eventbridge registration GraphQL query for an eventbridge webhook registration', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessResponse));
    const webhook: RegisterOptions = {
      path: 'arn:test',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: DeliveryMethod.EventBridge,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(eventBridgeSuccessResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook);
  });

  it('sends a pubsub registration GraphQL query for a pubsub webhook registration', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(pubSubSuccessResponse));
    const webhook: RegisterOptions = {
      path: 'pubsub://my-project-id:my-topic-id',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: DeliveryMethod.PubSub,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(pubSubSuccessResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
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
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(successUpdateResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  });

  it('updates a pre-existing eventbridge webhook even if it is already registered with Shopify', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeWebhookCheckResponse));
    fetchMock.mockResponseOnce(
      JSON.stringify(eventBridgeSuccessUpdateResponse),
    );
    const webhook: RegisterOptions = {
      path: 'arn:test-new',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: DeliveryMethod.EventBridge,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(eventBridgeSuccessUpdateResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  });

  it('updates a pre-existing pubsub webhook even if it is already registered with Shopify', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(pubSubWebhookCheckResponse));
    fetchMock.mockResponseOnce(JSON.stringify(pubSubSuccessUpdateResponse));
    const webhook: RegisterOptions = {
      path: 'pubsub://my-project-id:my-topic-id',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: DeliveryMethod.PubSub,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(pubSubSuccessUpdateResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  });

  it('fully skips registering a webhook if it is already registered with Shopify and its callback is the same', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeWebhookCheckResponse));
    const webhook: RegisterOptions = {
      path: 'arn:test',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      deliveryMethod: DeliveryMethod.EventBridge,
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual({});
    expect('PRODUCTS_CREATE' in ShopifyWebhooks.Registry.webhookRegistry);
    expect(fetchMock.mock.calls).toHaveLength(1);
    assertWebhookCheckRequest(webhook);
  });

  it('succeeds if a webhook is registered with a legacy API version', async () => {
    Context.API_VERSION = ApiVersion.April19;
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponseLegacy));
    fetchMock.mockResponseOnce(JSON.stringify(successUpdateResponse));
    const webhook: RegisterOptions = {
      path: '/webhooks/new',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.success).toBe(true);
    expect(result.result).toEqual(successUpdateResponse);
    expect(fetchMock.mock.calls).toHaveLength(2);
    assertWebhookCheckRequest(webhook);
    assertWebhookRegistrationRequest(webhook, webhookId);
  });

  it('throws if an eventbridge webhook is registered with an unsupported API version', async () => {
    expect(async () => {
      fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
      Context.API_VERSION = ApiVersion.April19;
      const webhook: RegisterOptions = {
        path: '/webhooks/new',
        topic: 'PRODUCTS_CREATE',
        accessToken: 'some token',
        shop: 'shop1.myshopify.io',
        deliveryMethod: DeliveryMethod.EventBridge,
      };
      await ShopifyWebhooks.Registry.register(webhook);
    }).rejects.toThrow(ShopifyErrors.UnsupportedClientType);
  });

  it('throws if a pubsub webhook is registered with an unsupported API version', async () => {
    expect(async () => {
      fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
      Context.API_VERSION = ApiVersion.April21;
      const webhook: RegisterOptions = {
        path: 'pubsub://my-project-id:my-topic-id',
        topic: 'PRODUCTS_CREATE',
        accessToken: 'some token',
        shop: 'shop1.myshopify.io',
        deliveryMethod: DeliveryMethod.PubSub,
      };
      await ShopifyWebhooks.Registry.register(webhook);
    }).rejects.toThrow(ShopifyErrors.UnsupportedClientType);
  });

  it('fails if given an invalid DeliveryMethod', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessResponse));
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
    };
    await ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS_CREATE', webhookHandler: genericWebhookHandler});
    await ShopifyWebhooks.Registry.register(webhook);
    expect('PRODUCTS_CREATE' in ShopifyWebhooks.Registry.webhookRegistry);

    // Add a second handler
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));
    webhook = {
      path: '/webhooks',
      topic: 'PRODUCTS_UPDATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };
    await ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS_UPDATE', webhookHandler: genericWebhookHandler});
    await ShopifyWebhooks.Registry.register(webhook);
    expect('PRODUCTS_UPDATE' in ShopifyWebhooks.Registry.webhookRegistry);
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(2);

    // Update the second handler and make sure we still have the two of them
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successUpdateResponse));
    webhook.path = '/webhooks/new';
    await ShopifyWebhooks.Registry.register(webhook);
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(2);

    // Make sure we have one of each topic in the registry
    const actualTopics = Object.keys(ShopifyWebhooks.Registry.webhookRegistry);
    expect(actualTopics).toEqual(['PRODUCTS_CREATE', 'PRODUCTS_UPDATE']);
  });
});

describe('ShopifyWebhooks.Registry.process', () => {
  const rawBody = '{"foo": "bar"}';

  beforeEach(async () => {
    fetchMock.resetMocks();
    Context.API_SECRET_KEY = 'kitties are cute';
    Context.API_VERSION = ApiVersion.Unstable;
    Context.IS_EMBEDDED_APP = true;
    Context.initialize(Context);
  });

  afterEach(async () => {
    ShopifyWebhooks.Registry.webhookRegistry = {};
  });

  it('handles the request when topic is already registered', async () => {
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});

    const app = express();
    app.post('/webhooks', ShopifyWebhooks.Registry.process);

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(Context.API_SECRET_KEY, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Ok);
  });

  it('handles lower case headers', async () => {
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});
    const app = express();
    app.post('/webhooks', ShopifyWebhooks.Registry.process);

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

  it('handles the request and returns Forbidden when topic is not registered', async () => {
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'NONSENSE_TOPIC', webhookHandler: genericWebhookHandler});

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await ShopifyWebhooks.Registry.process(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(ShopifyErrors.InvalidWebhookError);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(Context.API_SECRET_KEY, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Forbidden);
  });

  it('handles the request and returns Forbidden when hmac does not match', async () => {
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await ShopifyWebhooks.Registry.process(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(ShopifyErrors.InvalidWebhookError);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac('incorrect secret', rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Forbidden);
  });

  it('fails if the given body is empty', async () => {
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'NONSENSE_TOPIC', webhookHandler: genericWebhookHandler});

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await ShopifyWebhooks.Registry.process(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(ShopifyErrors.InvalidWebhookError);
      }
      expect(errorThrown).toBeTruthy();
    });

    await request(app)
      .post('/webhooks')
      .set(headers())
      .expect(StatusCode.BadRequest);
  });

  it('fails if the any of the required headers are missing', async () => {
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await ShopifyWebhooks.Registry.process(req, res);
      } catch (error) {
        errorThrown = true;
        expect(error).toBeInstanceOf(ShopifyErrors.InvalidWebhookError);
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

    ShopifyWebhooks.Registry.addHandler({
      path: '/webhooks',
      topic: 'PRODUCTS',
      webhookHandler: () => {
        throw new Error(errorMessage);
      },
    });

    const app = express();
    app.post('/webhooks', async (req, res) => {
      let errorThrown = false;
      try {
        await ShopifyWebhooks.Registry.process(req, res);
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
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});

    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(true);
  });

  it('returns false when given path is not registered for a webhook topic', async () => {
    ShopifyWebhooks.Registry.addHandler({path: '/fakepath', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});

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
    await ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS_CREATE', webhookHandler: genericWebhookHandler});
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(1);

    await ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(2);
  });

  it('adds a handler and deletes it', async () => {
    await ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS_CREATE', webhookHandler: genericWebhookHandler});
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(1);

    await ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(2);
  });

  it('adds a handler and replaces it with a new one', async () => {
    await ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(1);

    await ShopifyWebhooks.Registry.addHandler({path: '/webhookspath', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});
    expect(Object.keys(ShopifyWebhooks.Registry.webhookRegistry)).toHaveLength(1);

    expect(ShopifyWebhooks.Registry.webhookRegistry.PRODUCTS.path).toBe('/webhookspath');
    expect(ShopifyWebhooks.Registry.webhookRegistry.PRODUCTS.topic).toBe('PRODUCTS');
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
    ShopifyWebhooks.Registry.addHandler({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});
    expect(ShopifyWebhooks.Registry.getHandler('PRODUCTS')).toStrictEqual({path: '/webhooks', topic: 'PRODUCTS', webhookHandler: genericWebhookHandler});
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

function assertWebhookCheckRequest(webhook: RegisterOptions) {
  assertHttpRequest({
    method: Method.Post.toString(),
    domain: webhook.shop,
    path: `/admin/api/${Context.API_VERSION}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    data: createWebhookCheckQuery(webhook.topic),
  });
}

function assertWebhookRegistrationRequest(
  webhook: RegisterOptions,
  webhookId?: string,
) {
  const address =
    !webhook.deliveryMethod || webhook.deliveryMethod === DeliveryMethod.Http
      ? `https://${Context.HOST_NAME}${webhook.path}`
      : webhook.path;
  assertHttpRequest({
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
  });
}
