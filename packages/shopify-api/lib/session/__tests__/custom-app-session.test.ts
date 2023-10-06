import {shopifyApi} from '../..';
import {testConfig} from '../../__tests__/test-config';
import * as ShopifyErrors from '../../error';
import {customAppSession} from '../session-utils';

const valid_shop_urls = [
  'someshop.myshopify.com',
  'devshop.myshopify.io',
  'test-shop.myshopify.com',
  'dev-shop-.myshopify.io',
];

const invalid_shop_urls = ['notshopify.com', '-invalid.myshopify.io'];

describe('customAppSession', () => {
  const valid_session = {
    id: '',
    shop: 'someshop.myshopify.com',
    state: '',
    isOnline: false,
  };

  describe('returns a dummy session for valid shop strings', () => {
    valid_shop_urls.forEach((shop) => {
      it(`${shop}`, async () => {
        const shopify = shopifyApi(testConfig());

        valid_session.shop = shop;
        const session = await customAppSession(shopify.config)(shop);
        expect(session).toEqual(valid_session);
      });
    });
  });

  describe('throws an error for invalid shop strings', () => {
    invalid_shop_urls.forEach((shop) => {
      it(`${shop}`, async () => {
        const shopify = shopifyApi(testConfig());

        expect(() => customAppSession(shopify.config)(shop)).toThrowError(
          ShopifyErrors.InvalidShopError,
        );
      });
    });
  });
});
