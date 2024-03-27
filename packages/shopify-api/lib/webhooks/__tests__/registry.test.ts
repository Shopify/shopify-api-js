import {LogSeverity} from '../../types';
import {testConfig} from '../../__tests__/test-config';
import {HttpWebhookHandlerWithCallback} from '../types';
import {shopifyApi} from '../..';

import {EVENT_BRIDGE_HANDLER, HTTP_HANDLER, PUB_SUB_HANDLER} from './handlers';

function genericWebhookHandler(
  topic: string,
  shopDomain: string,
  body: string,
) {
  if (!topic || !shopDomain || !body) {
    throw new Error('Missing webhook parameters');
  }
}

describe('shopify.webhooks.addHandlers', () => {
  let handler1: HttpWebhookHandlerWithCallback;
  let handler2: HttpWebhookHandlerWithCallback;

  it('adds two handlers to the webhook registry', async () => {
    const shopify = shopifyApi(testConfig());

    handler1 = {
      ...HTTP_HANDLER,
      callback: jest.fn().mockImplementation(genericWebhookHandler),
    };
    handler2 = {
      ...HTTP_HANDLER,
      callback: jest.fn().mockImplementation(genericWebhookHandler),
    };

    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler1});
    expect(shopify.webhooks.getTopicsAdded()).toHaveLength(1);

    shopify.webhooks.addHandlers({PRODUCTS: handler2});
    expect(shopify.webhooks.getTopicsAdded()).toHaveLength(2);
    expect(shopify.webhooks.getTopicsAdded()).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS',
    ]);
  });

  it('allows adding multiple of the same HTTP handler', async () => {
    const shopify = shopifyApi(testConfig());

    handler1 = {...HTTP_HANDLER, callback: jest.fn()};
    handler2 = {...HTTP_HANDLER, callback: jest.fn()};

    shopify.webhooks.addHandlers({PRODUCTS_CREATE: [handler1, handler2]});

    expect(shopify.webhooks.getTopicsAdded()).toHaveLength(1);
    expect(shopify.config.logger.log).toHaveBeenCalledWith(
      LogSeverity.Info,
      expect.stringContaining(
        "Detected multiple handlers for 'PRODUCTS_CREATE', webhooks.process will call them sequentially",
      ),
    );

    const handlers = shopify.webhooks.getHandlers('PRODUCTS_CREATE');
    expect(handlers).toEqual([handler1, handler2]);
  });

  it('fails if eventbridge handlers point to the same location', async () => {
    expect(() => {
      const shopify = shopifyApi(testConfig());

      return shopify.webhooks.addHandlers({
        PRODUCTS_CREATE: [EVENT_BRIDGE_HANDLER, EVENT_BRIDGE_HANDLER],
      });
    }).toThrow(
      'Can only add multiple handlers for a topic when deliveryMethod is Http. Please be sure that you used addHandler method once after creating ShopifyApi instance in your app.',
    );
  });

  it('fails if pubsub handlers point to the same location', async () => {
    expect(() => {
      const shopify = shopifyApi(testConfig());

      return shopify.webhooks.addHandlers({
        PRODUCTS_CREATE: [PUB_SUB_HANDLER, PUB_SUB_HANDLER],
      });
    }).toThrow(
      'Can only add multiple handlers for a topic when deliveryMethod is Http. Please be sure that you used addHandler method once after creating ShopifyApi instance in your app.',
    );
  });

  it('adds handler with lowercase/slash-period format to the webhook registry', async () => {
    const shopify = shopifyApi(testConfig());

    const handler3: HttpWebhookHandlerWithCallback = {
      ...HTTP_HANDLER,
      callback: jest.fn().mockImplementation(genericWebhookHandler),
    };

    await shopify.webhooks.addHandlers({
      'products/create': handler1,
      'products/delete': handler2,
      'domain.sub_domain.something_happened': handler3,
    });
    expect(shopify.webhooks.getTopicsAdded()).toHaveLength(3);
    expect(shopify.webhooks.getTopicsAdded()).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS_DELETE',
      'DOMAIN_SUB_DOMAIN_SOMETHING_HAPPENED',
    ]);
  });
});

describe('shopify.webhooks.getHandlers', () => {
  it('gets a nonexistent handler', async () => {
    const shopify = shopifyApi(testConfig());

    expect(shopify.webhooks.getHandlers('PRODUCTS')).toEqual([]);
  });

  it('gets a handler', async () => {
    const shopify = shopifyApi(testConfig());

    const handler = HTTP_HANDLER;

    shopify.webhooks.addHandlers({PRODUCTS: handler});
    expect(shopify.webhooks.getHandlers('PRODUCTS')).toStrictEqual([handler]);
  });

  it('gets a handler using lowercase and slash format', async () => {
    const shopify = shopifyApi(testConfig());

    const handler = HTTP_HANDLER;

    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});
    expect(shopify.webhooks.getHandlers('products/create')).toStrictEqual([
      handler,
    ]);
  });

  it('gets a handler registered using lowercase and slash format using uppercase format', async () => {
    const shopify = shopifyApi(testConfig());

    const handler = HTTP_HANDLER;

    shopify.webhooks.addHandlers({'products/create': handler});

    expect(shopify.webhooks.getHandlers('PRODUCTS_CREATE')).toStrictEqual([
      handler,
    ]);
  });
});

describe('shopify.webhooks.getTopicsAdded', () => {
  it('gets an empty list of topics', async () => {
    const shopify = shopifyApi(testConfig());

    expect(shopify.webhooks.getTopicsAdded()).toStrictEqual([]);
  });

  it('adds two handlers and gets them', async () => {
    const shopify = shopifyApi(testConfig());

    const handler1 = {...HTTP_HANDLER};
    const handler2 = {...HTTP_HANDLER};

    shopify.webhooks.addHandlers({PRODUCTS: handler1});
    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler2});
    expect(shopify.webhooks.getTopicsAdded()).toStrictEqual([
      'PRODUCTS',
      'PRODUCTS_CREATE',
    ]);
  });
});
