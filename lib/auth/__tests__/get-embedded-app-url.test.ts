import {shopify} from '../../__tests__/test-helper';
import * as ShopifyErrors from '../../error';
import {NormalizedRequest} from '../../../runtime/http/types';

describe('getEmbeddedAppUrl', () => {
  beforeEach(() => {
    shopify.config.apiKey = 'my-api-key';
  });

  test('throws an error when no request is passed', async () => {
    await expect(
      shopify.auth.getEmbeddedAppUrl({rawRequest: undefined}),
    ).rejects.toThrow(ShopifyErrors.MissingRequiredArgument);
  });

  test('throws an error when the request has no URL', async () => {
    const req: NormalizedRequest = {
      method: 'GET',
      // This should never happen, so we're casting here to work around the typing
      url: undefined as any,
      headers: {},
    };

    await expect(
      shopify.auth.getEmbeddedAppUrl({rawRequest: req}),
    ).rejects.toThrow(ShopifyErrors.InvalidRequestError);
  });

  test('throws an error when the request has no host query param', async () => {
    const req: NormalizedRequest = {
      method: 'GET',
      url: '/?shop=test.myshopify.com',
      headers: {
        host: 'test.myshopify.com',
      },
    };

    await expect(
      shopify.auth.getEmbeddedAppUrl({rawRequest: req}),
    ).rejects.toThrow(ShopifyErrors.InvalidRequestError);
  });

  test('throws an error when the host query param is invalid', async () => {
    const req: NormalizedRequest = {
      method: 'GET',
      url: '/?shop=test.myshopify.com&host=test.myshopify.com',
      headers: {
        host: 'test.myshopify.com',
      },
    };

    await expect(
      shopify.auth.getEmbeddedAppUrl({rawRequest: req}),
    ).rejects.toThrow(ShopifyErrors.InvalidHostError);
  });

  test('returns the host app url', async () => {
    const host = 'test.myshopify.com/admin';
    const base64Host = Buffer.from(host, 'utf-8').toString('base64');

    const req: NormalizedRequest = {
      method: 'GET',
      url: `?shop=test.myshopify.com&host=${base64Host}`,
      headers: {
        host: 'test.myshopify.com',
      },
    };

    expect(await shopify.auth.getEmbeddedAppUrl({rawRequest: req})).toBe(
      `https://${host}/apps/${shopify.config.apiKey}`,
    );
  });
});
