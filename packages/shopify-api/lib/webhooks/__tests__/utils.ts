import crypto from 'crypto';

import express from 'express';

import {ShopifyHeader} from '../../types';

export function getTestExpressApp() {
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
  return app;
}

export function headers({
  apiVersion = '2023-01',
  domain = 'shop1.myshopify.io',
  hmac = 'fake',
  topic = 'products/create',
  webhookId = '123456789',
  // must explicitly set to test for presence
  subTopic = '',
  lowercase = false,
}: {
  apiVersion?: string;
  domain?: string;
  hmac?: string;
  topic?: string;
  webhookId?: string;
  subTopic?: string;
  lowercase?: boolean;
} = {}) {
  return {
    [lowercase
      ? ShopifyHeader.ApiVersion.toLowerCase()
      : ShopifyHeader.ApiVersion]: apiVersion,
    [lowercase ? ShopifyHeader.Domain.toLowerCase() : ShopifyHeader.Domain]:
      domain,
    [lowercase ? ShopifyHeader.Hmac.toLowerCase() : ShopifyHeader.Hmac]: hmac,
    [lowercase ? ShopifyHeader.Topic.toLowerCase() : ShopifyHeader.Topic]:
      topic,
    [lowercase
      ? ShopifyHeader.WebhookId.toLowerCase()
      : ShopifyHeader.WebhookId]: webhookId,
    ...(subTopic
      ? {
          [lowercase
            ? ShopifyHeader.SubTopic.toLowerCase()
            : ShopifyHeader.SubTopic]: subTopic,
        }
      : {}),
  };
}

export function hmac(secret: string, body: string) {
  return crypto.createHmac('sha256', secret).update(body).digest('base64');
}
