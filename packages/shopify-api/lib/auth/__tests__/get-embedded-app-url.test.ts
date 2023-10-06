import {testConfig} from '../../__tests__/test-config';
import * as ShopifyErrors from '../../error';
import {NormalizedRequest} from '../../../runtime/http/types';
import {shopifyApi} from '../..';

describe('getEmbeddedAppUrl', () => {
  test('throws an error when no request is passed', async () => {
    const shopify = shopifyApi(testConfig());

    await expect(
      shopify.auth.getEmbeddedAppUrl({rawRequest: undefined}),
    ).rejects.toThrow(ShopifyErrors.MissingRequiredArgument);
  });

  test('throws an error when the request has no URL', async () => {
    const shopify = shopifyApi(testConfig());

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
    const shopify = shopifyApi(testConfig());

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
    const shopify = shopifyApi(testConfig());

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
    const shopify = shopifyApi(testConfig());
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
      `https://${host}/apps/test_key`,
    );
  });
});
