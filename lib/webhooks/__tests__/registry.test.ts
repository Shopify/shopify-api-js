import {shopify} from '../../__tests__/test-helper';
import {HttpWebhookHandler} from '../types';

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
  let handler1: HttpWebhookHandler;
  let handler2: HttpWebhookHandler;

  it('adds two handlers to the webhook registry', async () => {
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
    handler1 = {...HTTP_HANDLER, callback: jest.fn()};
    handler2 = {...HTTP_HANDLER, callback: jest.fn()};

    const consoleLogMock = jest
      .spyOn(console, 'log')
      .mockImplementation(() => {});

    shopify.webhooks.addHandlers({PRODUCTS_CREATE: [handler1, handler2]});

    expect(shopify.webhooks.getTopicsAdded()).toHaveLength(1);
    expect(consoleLogMock).toHaveBeenCalledWith(
      "Detected multiple handlers for 'PRODUCTS_CREATE', webhooks.process will call them sequentially",
    );
    consoleLogMock.mockRestore();

    const handlers = shopify.webhooks.getHandlers('PRODUCTS_CREATE');
    expect(handlers).toEqual([handler1, handler2]);
  });

  it('fails if eventbridge handlers point to the same location', async () => {
    expect(() => {
      shopify.webhooks.addHandlers({
        PRODUCTS_CREATE: [EVENT_BRIDGE_HANDLER, EVENT_BRIDGE_HANDLER],
      });
    }).toThrow('Can only add multiple handlers when deliveryMethod is Http.');
  });

  it('fails if pubsub handlers point to the same location', async () => {
    expect(() => {
      shopify.webhooks.addHandlers({
        PRODUCTS_CREATE: [PUB_SUB_HANDLER, PUB_SUB_HANDLER],
      });
    }).toThrow('Can only add multiple handlers when deliveryMethod is Http.');
  });

  it('adds handler with lowercase/slash format to the webhook registry', async () => {
    shopify.webhooks.addHandlers({
      'products/create': handler1,
      'products/delete': handler2,
    });
    expect(shopify.webhooks.getTopicsAdded()).toHaveLength(2);
    expect(shopify.webhooks.getTopicsAdded()).toEqual([
      'PRODUCTS_CREATE',
      'PRODUCTS_DELETE',
    ]);
  });
});

describe('shopify.webhooks.getHandlers', () => {
  it('gets a nonexistent handler', async () => {
    expect(shopify.webhooks.getHandlers('PRODUCTS')).toEqual([]);
  });

  it('gets a handler', async () => {
    const handler = HTTP_HANDLER;

    shopify.webhooks.addHandlers({PRODUCTS: handler});
    expect(shopify.webhooks.getHandlers('PRODUCTS')).toStrictEqual([handler]);
  });

  it('gets a handler using lowercase and slash format', async () => {
    const handler = HTTP_HANDLER;

    shopify.webhooks.addHandlers({PRODUCTS_CREATE: handler});
    expect(shopify.webhooks.getHandlers('products/create')).toStrictEqual([
      handler,
    ]);
  });

  it('gets a handler registered using lowercase and slash format using uppercase format', async () => {
    const handler = HTTP_HANDLER;

    shopify.webhooks.addHandlers({'products/create': handler});

    expect(shopify.webhooks.getHandlers('PRODUCTS_CREATE')).toStrictEqual([
      handler,
    ]);
  });
});

describe('shopify.webhooks.getTopicsAdded', () => {
  it('gets an empty list of topics', async () => {
    expect(shopify.webhooks.getTopicsAdded()).toStrictEqual([]);
  });

  it('adds two handlers and gets them', async () => {
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
