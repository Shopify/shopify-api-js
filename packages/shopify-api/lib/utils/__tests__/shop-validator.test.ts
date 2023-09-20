import {shopify} from '../../__tests__/test-helper';
import {InvalidShopError} from '../../error';

const VALID_SHOP_URL_1 = 'someshop.myshopify.com';
const VALID_SHOP_URL_2 = 'devshop.myshopify.io';
const VALID_SHOP_URL_3 = 'test-shop.myshopify.com';
const VALID_SHOP_URL_4 = 'dev-shop-.myshopify.io';

const INVALID_SHOP_URL_1 = 'notshopify.com';
const INVALID_SHOP_URL_2 = '-invalid.myshopify.io';

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

  test('returns null for invalid URLs', () => {
    expect(shopify.utils.sanitizeShop(INVALID_SHOP_URL_1)).toBe(null);
    expect(shopify.utils.sanitizeShop(INVALID_SHOP_URL_2)).toBe(null);
  });

  test('throws for invalid URLs if set to', () => {
    expect(() =>
      shopify.utils.sanitizeShop(INVALID_SHOP_URL_1, true),
    ).toThrowError(InvalidShopError);
    expect(() =>
      shopify.utils.sanitizeShop(INVALID_SHOP_URL_2, true),
    ).toThrowError(InvalidShopError);
  });

  test('returns the right values when using custom domains', () => {
    shopify.config.customShopDomains = [CUSTOM_DOMAIN, CUSTOM_DOMAIN_REGEX];

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
});

describe('sanitizeHost', () => {
  VALID_HOSTS.forEach(({testhost, base64host}) => {
    test(`returns the host for ${testhost}`, () => {
      expect(shopify.utils.sanitizeHost(base64host)).toEqual(base64host);
    });
  });

  INVALID_HOSTS.forEach(({testhost, base64host}) => {
    test(`returns null for ${testhost}`, () => {
      expect(shopify.utils.sanitizeHost(base64host)).toBe(null);
    });
  });
});
