import request from 'supertest';

import {ShopifyHeader} from '../../types';
import {shopify} from '../../__tests__/test-helper';
import {WebhookValidationErrorReason} from '../types';

import {getTestExpressApp, headers, hmac} from './utils';

describe('shopify.webhooks.validate', () => {
  const rawBody = '{"foo": "bar"}';

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

  it('returns true for valid request', async () => {
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

  [
    {headers: {apiVersion: ''}, missingHeader: ShopifyHeader.ApiVersion},
    {headers: {domain: ''}, missingHeader: ShopifyHeader.Domain},
    {headers: {hmac: ''}, missingHeader: ShopifyHeader.Hmac},
    {headers: {topic: ''}, missingHeader: ShopifyHeader.Topic},
    {headers: {webhookId: ''}, missingHeader: ShopifyHeader.WebhookId},
  ].forEach(async (config) => {
    it(`returns false on missing header: ${JSON.stringify(
      config,
    )}`, async () => {
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
  });

  it('returns false on missing body', async () => {
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
