import {StatusCode} from '@shopify/network';
import request from 'supertest';

import {InvalidWebhookError} from '../../error';
import {testConfig} from '../../__tests__/test-config';
import {Shopify, shopifyApi} from '../..';

import {
  HTTP_HANDLER,
  HTTP_HANDLER_WITHOUT_CALLBACK,
  HTTP_HANDLER_WITH_SUBTOPIC,
} from './handlers';
import {getTestExpressApp, headers, hmac} from './utils';

interface TestResponseInterface {
  errorThrown: boolean;
  error?: Error;
  message?: string;
}

describe('shopify.webhooks.process', () => {
  const rawBody = '{"foo": "bar"}';

  let blockingWebhookHandlerCalled: boolean;
  async function blockingWebhookHandler(
    topic: string,
    shopDomain: string,
    body: string,
    webhookId: string,
  ): Promise<void> {
    await new Promise((resolve, reject) => {
      if (!topic || !shopDomain || !body || !webhookId) {
        reject(new Error('Missing webhook parameters'));
      }

      setTimeout(() => {
        blockingWebhookHandlerCalled = true;
        resolve(true);
      }, 10);
    });
  }

  async function blockingWebhookHandlerWithSubTopic(
    topic: string,
    shopDomain: string,
    body: string,
    webhookId: string,
    apiVersion: string,
    subTopic: string,
  ): Promise<void> {
    await new Promise((resolve, reject) => {
      if (
        !topic ||
        !shopDomain ||
        !body ||
        !webhookId ||
        !apiVersion ||
        !subTopic
      ) {
        console.log(topic, shopDomain, body, webhookId, apiVersion, subTopic);
        console.log('missing parameters');
        reject(new Error('Missing webhook parameters'));
      }

      setTimeout(() => {
        blockingWebhookHandlerCalled = true;
        resolve(true);
      }, 10);
    });
  }

  beforeEach(async () => {
    blockingWebhookHandlerCalled = false;
  });

  it('handles the request when topic is already registered', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Ok);

    expect(response.body.data.errorThrown).toBeFalsy();
    expect(blockingWebhookHandlerCalled).toBeTruthy();
  });

  it('handles the request with a subtopic', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {
      ...HTTP_HANDLER_WITH_SUBTOPIC,
      callback: blockingWebhookHandlerWithSubTopic,
    };
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(
        headers({
          subTopic: 'type:example',
          hmac: hmac(shopify.config.apiSecretKey, rawBody),
        }),
      )
      .send(rawBody)
      .expect(StatusCode.Ok);

    expect(response.body.data.errorThrown).toBeFalsy();
    expect(blockingWebhookHandlerCalled).toBeTruthy();
  });

  it('handles the request when a event topic is already registered', async () => {
    jest.useRealTimers();

    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({
      DOMAIN_SUB_DOMAIN_SOMETHING_HAPPENED: handler,
    });

    const response = await request(app)
      .post('/webhooks')
      .set(
        headers({
          hmac: hmac(shopify.config.apiSecretKey, rawBody),
          topic: 'domain.sub_domain.something_happened',
        }),
      )
      .send(rawBody)
      .expect(StatusCode.Ok);

    expect(response.body.data.errorThrown).toBeFalsy();
    expect(blockingWebhookHandlerCalled).toBeTruthy();
  });

  it('handles lower case headers', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(
        headers({
          hmac: hmac(shopify.config.apiSecretKey, rawBody),
          lowercase: true,
        }),
      )
      .send(rawBody)
      .expect(StatusCode.Ok);

    expect(response.body.data.errorThrown).toBeFalsy();
    expect(blockingWebhookHandlerCalled).toBeTruthy();
  });

  it('handles the request and returns Not Found when topic is not registered', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({NONSENSE_TOPIC: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.NotFound);

    expect(response.body.data.errorThrown).toBeTruthy();
    expect(response.body.data.message).toContain('PRODUCTS_CREATE');
    expect(blockingWebhookHandlerCalled).toBeFalsy();
  });

  it('handles the request and returns Unauthorized when hmac does not match', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac('incorrect secret', rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Unauthorized);

    expect(response.body.data.errorThrown).toBeTruthy();
    expect(blockingWebhookHandlerCalled).toBeFalsy();
  });

  it('fails if the given body is empty', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(headers())
      .expect(StatusCode.BadRequest);

    expect(response.body.data.errorThrown).toBeTruthy();
    expect(blockingWebhookHandlerCalled).toBeFalsy();
  });

  it('fails if the any of the required headers are missing', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const emptyHeaders = [
      {apiVersion: ''},
      {domain: ''},
      {hmac: ''},
      {topic: ''},
      {webhookId: ''},
    ];

    for (const header of emptyHeaders) {
      const response = await request(app)
        .post('/webhooks')
        .set(
          headers({
            hmac: hmac(shopify.config.apiSecretKey, rawBody),
            ...header,
          }),
        )
        .send(rawBody)
        .expect(StatusCode.BadRequest);

      expect(response.body.data.errorThrown).toBeTruthy();
      expect(blockingWebhookHandlerCalled).toBeFalsy();
    }
  });

  it('catches handler errors but still responds', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const errorMessage = 'Oh no something went wrong!';

    const handler = {
      ...HTTP_HANDLER,
      callback: () => {
        throw new Error(errorMessage);
      },
    };
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.InternalServerError);

    expect(response.body.data.errorThrown).toBeTruthy();
  });

  it('throws if the handler does not have a callback', async () => {
    const shopify = shopifyApi(
      testConfig({apiSecretKey: 'kitties are cute', isEmbeddedApp: true}),
    );
    const app = getTestApp(shopify);

    const handler = HTTP_HANDLER_WITHOUT_CALLBACK;
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody)
      .expect(StatusCode.InternalServerError);

    expect(response.body.data.errorThrown).toBeTruthy();
  });
});

function getTestApp(shopify: Shopify) {
  const app = getTestExpressApp();
  app.post('/webhooks', async (req, res) => {
    const data: TestResponseInterface = {
      errorThrown: false,
    };
    let statusCode = StatusCode.Ok;
    try {
      await shopify.webhooks.process({
        rawBody: (req as any).rawBody,
        rawRequest: req,
        rawResponse: res,
      });
    } catch (error) {
      data.errorThrown = true;
      data.error = error;
      data.message = error.message;
      expect(error).toBeInstanceOf(InvalidWebhookError);
      statusCode = error.response.statusCode;
    }
    res.status(statusCode).json({data});
  });

  return app;
}
