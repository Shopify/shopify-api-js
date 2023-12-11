import {shopifyApi} from '../..';
import {testConfig} from '../../__tests__/test-config';

const VALID_UNIFIED_ADMIN_URLS = [
  {
    unifiedAdminUrl: 'admin.shopify.com/store/my-shop',
    legacyAdminUrl: 'my-shop.myshopify.com',
  },
  {
    unifiedAdminUrl: 'admin.web.abc.def-gh.ij.spin.dev/store/my-shop',
    legacyAdminUrl: 'my-shop.shopify.abc.def-gh.ij.spin.dev',
  },
];

VALID_UNIFIED_ADMIN_URLS.forEach(({unifiedAdminUrl, legacyAdminUrl}) => {
  test('converts unified admin URL to legacy URL', () => {
    const shopify = shopifyApi(testConfig());
    const actual = shopify.utils.unifiedAdminUrlToLegacyUrl(unifiedAdminUrl);
    expect(actual).toEqual(legacyAdminUrl);
  });

  test('converts legacy URL to unified admin URL', () => {
    const shopify = shopifyApi(testConfig());
    const actual = shopify.utils.legacyUrlToUnifiedAdminUrl(legacyAdminUrl);
    expect(actual).toEqual(unifiedAdminUrl);
  });
});

test('returns null when trying to convert from unified admin url to legacy url', () => {
  const invalid_url = 'not-admin.shopify.com/store/my-shop';
  const shopify = shopifyApi(testConfig());

  expect(shopify.utils.unifiedAdminUrlToLegacyUrl(invalid_url)).toBe(null);
});
