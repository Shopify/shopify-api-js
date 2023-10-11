import request from 'supertest';

import {ShopifyHeader} from '../../types';
import {WebhookValidationErrorReason} from '../types';
import {Shopify, shopifyApi} from '../..';
import {testConfig} from '../../__tests__/test-config';

import {getTestExpressApp, headers, hmac} from './utils';

describe('shopify.webhooks.validate', () => {
  const rawBody = '{"foo": "bar"}';

  it('returns true for valid request', async () => {
    const shopify = shopifyApi(testConfig());
    const app = getTestApp(shopify);

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .send(rawBody)
      .expect(200);

    expect(response.body.data).toEqual({
      valid: true,
      webhookId: '123456789',
      apiVersion: '2023-01',
      domain: 'shop1.myshopify.io',
      hmac: 'B23tXN681gZ0qIWNRrgtzBE9XSDo5yaUu6wfmhu3a7g=',
      topic: 'PRODUCTS_CREATE',
    });
  });

  it.each([
    {headers: {apiVersion: ''}, missingHeader: ShopifyHeader.ApiVersion},
    {headers: {domain: ''}, missingHeader: ShopifyHeader.Domain},
    {headers: {hmac: ''}, missingHeader: ShopifyHeader.Hmac},
    {headers: {topic: ''}, missingHeader: ShopifyHeader.Topic},
    {headers: {webhookId: ''}, missingHeader: ShopifyHeader.WebhookId},
  ])(`returns false on missing header $missingHeader`, async (config) => {
    const shopify = shopifyApi(testConfig());
    const app = getTestApp(shopify);

    const requestHeaders = headers({
      hmac: hmac(shopify.config.apiSecretKey, rawBody),
      ...config.headers,
    });

    const response = await request(app)
      .post('/webhooks')
      .set(requestHeaders)
      .send(rawBody)
      .expect(200);

    expect(response.body.data).toEqual({
      valid: false,
      reason: WebhookValidationErrorReason.MissingHeaders,
      missingHeaders: [config.missingHeader],
    });
  });

  it('returns false on missing body', async () => {
    const shopify = shopifyApi(testConfig());
    const app = getTestApp(shopify);

    const response = await request(app)
      .post('/webhooks')
      .set(headers({hmac: hmac(shopify.config.apiSecretKey, rawBody)}))
      .expect(200);

    expect(response.body.data).toEqual({
      valid: false,
      reason: WebhookValidationErrorReason.MissingBody,
    });
  });

  it('returns false on invalid HMAC', async () => {
    const shopify = shopifyApi(testConfig());
    const app = getTestApp(shopify);

    const response = await request(app)
      .post('/webhooks')
      .set(headers())
      .send(rawBody)
      .expect(200);

    expect(response.body.data).toEqual({
      valid: false,
      reason: WebhookValidationErrorReason.InvalidHmac,
    });
  });
});

function getTestApp(shopify: Shopify) {
  const app = getTestExpressApp();
  app.post('/webhooks', async (req, res) => {
    res.status(200).json({
      data: await shopify.webhooks.validate({
        rawBody: (req as any).rawBody,
        rawRequest: req,
        rawResponse: res,
      }),
    });
  });

  return app;
}
