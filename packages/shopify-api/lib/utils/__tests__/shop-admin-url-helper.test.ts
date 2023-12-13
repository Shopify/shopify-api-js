import {shopifyApi} from '../..';
import {testConfig} from '../../__tests__/test-config';

const VALID_URLS = [
  {
    adminUrl: 'admin.shopify.com/store/my-shop',
    legacyAdminUrl: 'my-shop.myshopify.com',
  },
  {
    adminUrl: 'admin.web.abc.def-gh.ij.spin.dev/store/my-shop',
    legacyAdminUrl: 'my-shop.shopify.abc.def-gh.ij.spin.dev',
  },
];

describe.each(VALID_URLS)(
  'For valid shop URLs: %s',
  ({adminUrl, legacyAdminUrl}) => {
    it('can convert from shop admin URL to legacy URL', () => {
      const shopify = shopifyApi(testConfig());
      const actual = shopify.utils.shopAdminUrlToLegacyUrl(adminUrl);
      expect(actual).toEqual(actual);
    });

    it('can convert from legacy URL to shop admin URL', () => {
      const shopify = shopifyApi(testConfig());
      const actual = shopify.utils.legacyUrlToShopAdminUrl(legacyAdminUrl);
      expect(actual).toEqual(adminUrl);
    });
  },
);

it('returns null when trying to convert from shop admin url to legacy url', () => {
  const invalid_url = 'not-admin.shopify.com/store/my-shop';
  const shopify = shopifyApi(testConfig());

  expect(shopify.utils.shopAdminUrlToLegacyUrl(invalid_url)).toBe(null);
});
