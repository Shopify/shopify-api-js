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

const INVALID_ADMIN_URLS = [
  'not-admin.shopify.com/store/my-shop',
  'adminisnotthis.shopify.com/store/my-shop',
  'adminisnot.web.abc.def-gh.ij.spin.dev/store/my-shop',
  'admin.what.abc.def-gh.ij.spin.dev/store/my-shop',
];

const INVALID_LEGACY_URLS = [
  'notshopify.com',
  'my-shop.myshopify.com.nope',
  'my-shop.myshopify.com/admin',
];

describe.each(VALID_URLS)(
  'For valid shop URL: %s',
  ({adminUrl, legacyAdminUrl}) => {
    it('can convert from shop admin URL to legacy URL', () => {
      const shopify = shopifyApi(testConfig());
      const actual = shopify.utils.shopAdminUrlToLegacyUrl(adminUrl);
      expect(actual).toEqual(legacyAdminUrl);
    });

    it('can convert from legacy URL to shop admin URL', () => {
      const shopify = shopifyApi(testConfig());
      const actual = shopify.utils.legacyUrlToShopAdminUrl(legacyAdminUrl);
      expect(actual).toEqual(adminUrl);
    });

    it('can strip protocol before converting from shop admin URL to legacy URL', () => {
      const shopify = shopifyApi(testConfig());
      const urlWithProtocol = `https://${adminUrl}`;
      const actual = shopify.utils.shopAdminUrlToLegacyUrl(urlWithProtocol);
      expect(actual).toEqual(legacyAdminUrl);
    });

    it('can strip protocol before converting from legacy URL to shop admin URL', () => {
      const shopify = shopifyApi(testConfig());
      const urlWithProtocol = `https://${legacyAdminUrl}`;
      const actual = shopify.utils.legacyUrlToShopAdminUrl(urlWithProtocol);
      expect(actual).toEqual(adminUrl);
    });
  },
);

describe.each(INVALID_ADMIN_URLS)(
  'For invalid shop admin URL: %s',
  (invalidUrl) => {
    it('returns null when trying to convert from shop admin url to legacy url', () => {
      const shopify = shopifyApi(testConfig());

      expect(shopify.utils.shopAdminUrlToLegacyUrl(invalidUrl)).toBe(null);
    });
  },
);

describe.each(INVALID_LEGACY_URLS)(
  'For invalid legacy shop URL: %s',
  (invalidUrl) => {
    it('returns null when trying to convert from legacy url to shop admin url', () => {
      const shopify = shopifyApi(testConfig());

      expect(shopify.utils.legacyUrlToShopAdminUrl(invalidUrl)).toBe(null);
    });
  },
);
