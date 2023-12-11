import {shopifyApi} from '../..';
import {testConfig} from '../../__tests__/test-config';
import {InvalidShopError} from '../../error';

const VALID_SHOP_URL_1 = 'someshop.myshopify.com';
const VALID_SHOP_URL_2 = 'devshop.myshopify.io';
const VALID_SHOP_URL_3 = 'test-shop.myshopify.com';
const VALID_SHOP_URL_4 = 'dev-shop-.myshopify.io';

const INVALID_SHOP_URL_1 = 'notshopify.com';
const INVALID_SHOP_URL_2 = '-invalid.myshopify.io';
const VALID_SHOPIFY_HOST_BUT_NOT_VALID_UNIFIED_ADMIN =
  'not-admin.shopify.com/store/my-shop';

const CUSTOM_DOMAIN = 'my-custom-domain.com';
const VALID_SHOP_WITH_CUSTOM_DOMAIN = `my-shop.${CUSTOM_DOMAIN}`;
const INVALID_SHOP_WITH_CUSTOM_DOMAIN = `my-shop.${CUSTOM_DOMAIN}.nope`;

const CUSTOM_DOMAIN_REGEX = /my-other-custom-domain\.com/;
const VALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX = `my-shop.my-other-custom-domain.com`;
const INVALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX = `my-shop.my-other-custom-domain.com.nope`;

const VALID_HOSTS = [
  'my-host.myshopify.com/admin',
  'my-other-host.myshopify.com/admin',
  'my-other-other-host.myshopify.io/admin',
  'admin.shopify.com/store/my-shop',
  'admin.spin.dev/store/my-shop',
].map((testhost) => {
  return {testhost, base64host: Buffer.from(testhost).toString('base64')};
});

const VALID_UNIFIED_ADMIN_URLS = [
  {
    unifiedAdminUrl: 'admin.shopify.com/store/my-shop',
    legacyAdminUrl: 'my-shop.myshopify.com',
  },
];

const INVALID_HOSTS = [
  {
    testhost: 'plain-string-is-not-base64',
    base64host: 'plain-string-is-not-base64',
  },
  {
    testhost: "valid host but ending with '-nope'",
    base64host: `${Buffer.from('my-other-host.myshopify.com/admin').toString(
      'base64',
    )}-nope`,
  },
  {
    testhost: 'my-fake-host.notshopify.com/admin',
    base64host: Buffer.from('my-fake-host.notshopify.com/admin').toString(
      'base64',
    ),
  },
];

describe('sanitizeShop', () => {
  test('returns the shop for valid URLs', () => {
    const shopify = shopifyApi(testConfig());

    expect(shopify.utils.sanitizeShop(VALID_SHOP_URL_1)).toEqual(
      VALID_SHOP_URL_1,
    );
    expect(shopify.utils.sanitizeShop(VALID_SHOP_URL_2)).toEqual(
      VALID_SHOP_URL_2,
    );
    expect(shopify.utils.sanitizeShop(VALID_SHOP_URL_3)).toEqual(
      VALID_SHOP_URL_3,
    );
    expect(shopify.utils.sanitizeShop(VALID_SHOP_URL_4)).toEqual(
      VALID_SHOP_URL_4,
    );
  });

  [
    INVALID_SHOP_URL_1,
    INVALID_SHOP_URL_2,
    VALID_SHOPIFY_HOST_BUT_NOT_VALID_UNIFIED_ADMIN,
  ].forEach((invalidUrl) => {
    test('returns null for invalid URLs', () => {
      const shopify = shopifyApi(testConfig());

      expect(shopify.utils.sanitizeShop(invalidUrl)).toBe(null);
    });
  });

  test('throws for invalid URLs if set to', () => {
    const shopify = shopifyApi(testConfig());

    expect(() =>
      shopify.utils.sanitizeShop(INVALID_SHOP_URL_1, true),
    ).toThrowError(InvalidShopError);
    expect(() =>
      shopify.utils.sanitizeShop(INVALID_SHOP_URL_2, true),
    ).toThrowError(InvalidShopError);
  });

  test('returns the right values when using custom domains', () => {
    const shopify = shopifyApi(
      testConfig({
        customShopDomains: [CUSTOM_DOMAIN, CUSTOM_DOMAIN_REGEX],
      }),
    );

    expect(shopify.utils.sanitizeShop(VALID_SHOP_WITH_CUSTOM_DOMAIN)).toEqual(
      VALID_SHOP_WITH_CUSTOM_DOMAIN,
    );
    expect(shopify.utils.sanitizeShop(INVALID_SHOP_WITH_CUSTOM_DOMAIN)).toBe(
      null,
    );

    expect(
      shopify.utils.sanitizeShop(VALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX),
    ).toEqual(VALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX);
    expect(
      shopify.utils.sanitizeShop(INVALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX),
    ).toBe(null);
  });

  VALID_UNIFIED_ADMIN_URLS.forEach(({unifiedAdminUrl, legacyAdminUrl}) => {
    test('accepts unified admin URLs and converts to legacy admin URLs', () => {
      const shopify = shopifyApi(testConfig());
      const actual = shopify.utils.sanitizeShop(unifiedAdminUrl);

      expect(actual).toEqual(legacyAdminUrl);
    });
  });
});

describe('sanitizeHost', () => {
  VALID_HOSTS.forEach(({testhost, base64host}) => {
    test(`returns the host for ${testhost}`, () => {
      const shopify = shopifyApi(testConfig());

      expect(shopify.utils.sanitizeHost(base64host)).toEqual(base64host);
    });
  });

  INVALID_HOSTS.forEach(({testhost, base64host}) => {
    test(`returns null for ${testhost}`, () => {
      const shopify = shopifyApi(testConfig());

      expect(shopify.utils.sanitizeHost(base64host)).toBe(null);
    });
  });
});
