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
    Context.WEBHOOKS_REGISTRY = {};
  });

  it('does nothing if there is no webhook to register', async () => {
    Context.WEBHOOKS_REGISTRY = {};
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result).toEqual({});
    expect(fetchMock.mock.calls.length).toBe(0);
  });

  it('sends a post request to the given shop domain with the webhook data as a GraphQL query in the body and the access token in the headers', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(successResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE');
  });

  it('returns a result with success set to false, body set to empty object, when the server doesn’t return a webhookSubscriptionCreate field', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(failResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(false);
    expect(result.PRODUCTS_CREATE.result).toEqual(failResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE');
  });

  it('can register multiple webhooks', async () => {
    fetchMock.mockResponse(async (req) => {
      const body = await req.text();

      if (body.includes('webhookSubscriptions(first: 1')) {
        return JSON.stringify(webhookCheckEmptyResponse);
      }
      if (body.includes('webhookSubscriptionCreate(topic: PRODUCTS_CREATE')) {
        return JSON.stringify(successResponse);
      }
      if (body.includes('pubSubWebhookSubscriptionCreate(topic: APP_UNINSTALLED')) {
        return JSON.stringify(pubSubSuccessResponse);
      }
      return JSON.stringify({});
    });

    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
      APP_UNINSTALLED: {
        path: 'pubsub://my-project-id:my-topic-id',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: DeliveryMethod.PubSub,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(successResponse);
    expect(result.APP_UNINSTALLED.success).toBe(true);
    expect(result.APP_UNINSTALLED.result).toEqual(pubSubSuccessResponse);
    expect(fetchMock.mock.calls.length).toBe(4);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookCheckRequest(webhook, 'APP_UNINSTALLED');
    assertWebhookRegistrationRequest(webhook, 'APP_UNINSTALLED');
    fetchMock.resetMocks();
  });

  it('only register optional webhooks', async () => {
    fetchMock.mockResponse(async (req) => {
      const body = await req.text();

      if (body.includes('webhookSubscriptions(first: 1')) {
        return JSON.stringify(webhookCheckEmptyResponse);
      }
      if (body.includes('webhookSubscriptionCreate(topic: PRODUCTS_CREATE')) {
        return JSON.stringify(successResponse);
      }
      if (body.includes('pubSubWebhookSubscriptionCreate(topic: APP_UNINSTALLED')) {
        return JSON.stringify(pubSubSuccessResponse);
      }
      return JSON.stringify({});
    });

    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
      APP_UNINSTALLED: {
        path: 'pubsub://my-project-id:my-topic-id',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: DeliveryMethod.PubSub,
      },
      CUSTOMERS_DATA_REQUEST: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
      CUSTOMERS_REDACT: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
      SHOP_REDACT: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(successResponse);
    expect(result.APP_UNINSTALLED.success).toBe(true);
    expect(result.APP_UNINSTALLED.result).toEqual(pubSubSuccessResponse);
    expect(fetchMock.mock.calls.length).toBe(4);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookCheckRequest(webhook, 'APP_UNINSTALLED');
    assertWebhookRegistrationRequest(webhook, 'APP_UNINSTALLED');
    fetchMock.resetMocks();
  });

  it('sends an eventbridge registration GraphQL query for an eventbridge webhook registration', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: 'arn:test',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: DeliveryMethod.EventBridge,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(eventBridgeSuccessResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE');
  });

  it('sends a pubsub registration GraphQL query for a pubsub webhook registration', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(pubSubSuccessResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: 'pubsub://my-project-id:my-topic-id',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: DeliveryMethod.PubSub,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(pubSubSuccessResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE');
  });

  it('updates a pre-existing webhook even if it is already registered with Shopify', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponse));
    fetchMock.mockResponseOnce(JSON.stringify(successUpdateResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks/new',
        webhookHandler: genericWebhookHandler,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(successUpdateResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE', webhookId);
  });

  it('updates a pre-existing eventbridge webhook even if it is already registered with Shopify', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeWebhookCheckResponse));
    fetchMock.mockResponseOnce(
      JSON.stringify(eventBridgeSuccessUpdateResponse),
    );
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: 'arn:test-new',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: DeliveryMethod.EventBridge,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(eventBridgeSuccessUpdateResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE', webhookId);
  });

  it('updates a pre-existing pubsub webhook even if it is already registered with Shopify', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(pubSubWebhookCheckResponse));
    fetchMock.mockResponseOnce(JSON.stringify(pubSubSuccessUpdateResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: 'pubsub://my-project-id:my-topic-id',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: DeliveryMethod.PubSub,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(pubSubSuccessUpdateResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE', webhookId);
  });

  // FIX
  it('fully skips registering a webhook if it is already registered with Shopify and its callback is the same', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeWebhookCheckResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: 'arn:test',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: DeliveryMethod.EventBridge,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual({});
    expect(fetchMock.mock.calls.length).toBe(1);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
  });

  it('succeeds if a webhook is registered with a legacy API version', async () => {
    Context.API_VERSION = ApiVersion.April19;
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckResponseLegacy));
    fetchMock.mockResponseOnce(JSON.stringify(successUpdateResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks/new',
        webhookHandler: genericWebhookHandler,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(successUpdateResponse);
    expect(fetchMock.mock.calls.length).toBe(2);
    assertWebhookCheckRequest(webhook, 'PRODUCTS_CREATE');
    assertWebhookRegistrationRequest(webhook, 'PRODUCTS_CREATE', webhookId);
  });

  it('throws if an eventbridge webhook is registered with an unsupported API version', async () => {
    expect(async () => {
      fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
      Context.API_VERSION = ApiVersion.April19;
      Context.WEBHOOKS_REGISTRY = {
        PRODUCTS_CREATE: {
          path: '/webhooks/new',
          webhookHandler: genericWebhookHandler,
          deliveryMethod: DeliveryMethod.EventBridge,
        },
        APP_UNINSTALLED: {
          path: '/webhooks',
          webhookHandler: genericWebhookHandler,
        },
      };
      const webhook: RegisterOptions = {
        accessToken: 'some token',
        shop: 'shop1.myshopify.io',
      };
      await ShopifyWebhooks.Registry.register(webhook);
    }).rejects.toThrow(ShopifyErrors.UnsupportedClientType);
  });

  it('throws if a pubsub webhook is registered with an unsupported API version', async () => {
    expect(async () => {
      fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
      Context.API_VERSION = ApiVersion.April21;
      Context.WEBHOOKS_REGISTRY = {
        PRODUCTS_CREATE: {
          path: 'pubsub://my-project-id:my-topic-id',
          webhookHandler: genericWebhookHandler,
          deliveryMethod: DeliveryMethod.PubSub,
        },
        APP_UNINSTALLED: {
          path: '/webhooks',
          webhookHandler: genericWebhookHandler,
        },
      };
      const webhook: RegisterOptions = {
        accessToken: 'some token',
        shop: 'shop1.myshopify.io',
      };
      await ShopifyWebhooks.Registry.register(webhook);
    }).rejects.toThrow(ShopifyErrors.UnsupportedClientType);
  });

  it('fails if given an invalid DeliveryMethod', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(webhookCheckEmptyResponse));
    fetchMock.mockResponseOnce(JSON.stringify(eventBridgeSuccessResponse));
    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: 'Something else' as DeliveryMethod,
      },
    };
    const webhook = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(
      webhook as RegisterOptions,
    );
    expect(result.PRODUCTS_CREATE.success).toBe(false);
  });

  it('only fails the invalid webhooks', async () => {
    fetchMock.mockResponse(async (req) => {
      const body = await req.text();

      if (body.includes('webhookSubscriptions(first: 1')) {
        return JSON.stringify(webhookCheckEmptyResponse);
      }
      if (body.includes('webhookSubscriptionCreate(topic: PRODUCTS_CREATE')) {
        return JSON.stringify(successResponse);
      }
      return JSON.stringify({});
    });

    Context.WEBHOOKS_REGISTRY = {
      PRODUCTS_CREATE: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
      },
      APP_UNINSTALLED: {
        path: '/webhooks',
        webhookHandler: genericWebhookHandler,
        deliveryMethod: 'Something else' as DeliveryMethod,
      },
    };
    const webhook: RegisterOptions = {
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await ShopifyWebhooks.Registry.register(webhook);
    expect(result.PRODUCTS_CREATE.success).toBe(true);
    expect(result.PRODUCTS_CREATE.result).toEqual(successResponse);
    expect(result.APP_UNINSTALLED.success).toBe(false);
    expect(result.APP_UNINSTALLED.result).toEqual({});
    fetchMock.resetMocks();
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
    Context.WEBHOOKS_REGISTRY = {};
  });

  it('handles the request when topic is already registered', async () => {
    Context.WEBHOOKS_REGISTRY.PRODUCTS = {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    };

    const app = express();
    app.post('/webhooks', ShopifyWebhooks.Registry.process);

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(Context.API_SECRET_KEY, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Ok);
  });

  it('handles lower case headers', async () => {
    Context.WEBHOOKS_REGISTRY.PRODUCTS = {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    };

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
    Context.WEBHOOKS_REGISTRY.NONSENSE_TOPIC = {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    };

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
    Context.WEBHOOKS_REGISTRY.PRODUCTS = {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    };

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
    Context.WEBHOOKS_REGISTRY.NONSENSE_TOPIC = {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    };

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
    Context.WEBHOOKS_REGISTRY.PRODUCTS = {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    };

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

    Context.WEBHOOKS_REGISTRY.PRODUCTS = {
      path: '/webhooks',
      webhookHandler: () => {
        throw new Error(errorMessage);
      },
    };

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
    Context.WEBHOOKS_REGISTRY = {};
  });

  it('returns true when given path is registered for a webhook topic', async () => {
    Context.WEBHOOKS_REGISTRY.PRODUCTS = {
      path: '/webhooks',
      webhookHandler: genericWebhookHandler,
    };

    expect(ShopifyWebhooks.Registry.isWebhookPath('/webhooks')).toBe(true);
  });

  it('returns false when given path is not registered for a webhook topic', async () => {
    Context.WEBHOOKS_REGISTRY.PRODUCTS = {
      path: '/fakepath',
      webhookHandler: genericWebhookHandler,
    };

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

function assertWebhookCheckRequest(webhook: RegisterOptions, topic: string) {
  assertHttpRequest({
    method: Method.Post.toString(),
    domain: webhook.shop,
    path: `/admin/api/${Context.API_VERSION}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    data: createWebhookCheckQuery(topic),
  });
}

function assertWebhookRegistrationRequest(
  webhook: RegisterOptions,
  topic: string,
  webhookId?: string,
) {
  const {deliveryMethod, path} = Context.WEBHOOKS_REGISTRY[topic];
  const address =
    !deliveryMethod || deliveryMethod === DeliveryMethod.Http
      ? `https://${Context.HOST_NAME}${path}`
      : path;
  assertHttpRequest({
    method: Method.Post.toString(),
    domain: webhook.shop,
    path: `/admin/api/${Context.API_VERSION}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: webhook.accessToken,
    },
    data: createWebhookQuery(
      topic,
      address,
      deliveryMethod,
      webhookId,
    ),
  });
}
