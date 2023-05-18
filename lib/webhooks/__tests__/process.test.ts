import {StatusCode} from '@shopify/network';
import request from 'supertest';

import {InvalidWebhookError} from '../../error';
import {LogSeverity} from '../../types';
import {shopify} from '../../__tests__/test-helper';

import {HTTP_HANDLER, HTTP_HANDLER_WITHOUT_CALLBACK} from './handlers';
import {getTestExpressApp, headers, hmac} from './utils';

interface TestResponseInterface {
  errorThrown: boolean;
  error?: Error;
  message?: string;
}

describe('shopify.webhooks.process', () => {
  const rawBody = '{"foo": "bar"}';

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

  beforeEach(async () => {
    shopify.config.apiSecretKey = 'kitties are cute';
    shopify.config.isEmbeddedApp = true;

    blockingWebhookHandlerCalled = false;
  });

  it('handles the request when topic is already registered', async () => {
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

  it('handles the request when a event topic is already registered', async () => {
    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    await shopify.webhooks.addHandlers({
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
        .set(headers(header))
        .send(rawBody)
        .expect(StatusCode.BadRequest);

      expect(response.body.data.errorThrown).toBeTruthy();
      expect(blockingWebhookHandlerCalled).toBeFalsy();
    }
  });

  it('catches handler errors but still responds', async () => {
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

  it('logs a deprecation notice if isCustomStoreApp === true and hmac does not match', async () => {
    const handler = {...HTTP_HANDLER, callback: blockingWebhookHandler};
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});
    shopify.config.isCustomStoreApp = true;

    await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac('incorrect secret', rawBody)}))
      .send(rawBody)
      .expect(StatusCode.Unauthorized);

    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Warning,
      expect.stringContaining('apiSecretKey should be set to'),
    );
  });

  it('throws if the handler does not have a callback', async () => {
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
