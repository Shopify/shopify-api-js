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

VALID_URLS.forEach(({adminUrl, legacyAdminUrl}) => {
  test('converts shop admin URL to legacy URL', () => {
    const shopify = shopifyApi(testConfig());
    const actual = shopify.utils.shopAdminUrlToLegacyUrl(adminUrl);
    expect(actual).toEqual(legacyAdminUrl);
  });

  test('converts legacy URL to shop admin URL', () => {
    const shopify = shopifyApi(testConfig());
    const actual = shopify.utils.legacyUrlToShopAdminUrl(legacyAdminUrl);
    expect(actual).toEqual(adminUrl);
  });
});

test('returns null when trying to convert from shop admin url to legacy url', () => {
  const invalid_url = 'not-admin.shopify.com/store/my-shop';
  const shopify = shopifyApi(testConfig());

  expect(shopify.utils.shopAdminUrlToLegacyUrl(invalid_url)).toBe(null);
});
