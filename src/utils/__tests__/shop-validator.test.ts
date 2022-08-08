import {Context} from '../../context';
import {InvalidShopError} from '../../error';
import {sanitizeHost, sanitizeShop} from '../shop-validator';

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

const VALID_HOST_1 = Buffer.from('my-host.myshopify.com/admin').toString(
  'base64',
);
const VALID_HOST_2 = Buffer.from('my-other-host.myshopify.com/admin').toString(
  'base64',
);

const INVALID_HOST_1 = 'plain-string-is-not-base64';
const INVALID_HOST_2 = `${Buffer.from(
  'my-other-host.myshopify.com/admin',
).toString('base64')}-nope`;

describe('sanitizeShop', () => {
  test('returns the shop for valid URLs', () => {
    expect(sanitizeShop(VALID_SHOP_URL_1)).toEqual(VALID_SHOP_URL_1);
    expect(sanitizeShop(VALID_SHOP_URL_2)).toEqual(VALID_SHOP_URL_2);
    expect(sanitizeShop(VALID_SHOP_URL_3)).toEqual(VALID_SHOP_URL_3);
    expect(sanitizeShop(VALID_SHOP_URL_4)).toEqual(VALID_SHOP_URL_4);
  });

  test('returns null for invalid URLs', () => {
    expect(sanitizeShop(INVALID_SHOP_URL_1)).toBe(null);
    expect(sanitizeShop(INVALID_SHOP_URL_2)).toBe(null);
  });

  test('throws for invalid URLs if set to', () => {
    expect(() => sanitizeShop(INVALID_SHOP_URL_1, true)).toThrowError(
      InvalidShopError,
    );
    expect(() => sanitizeShop(INVALID_SHOP_URL_2, true)).toThrowError(
      InvalidShopError,
    );
  });

  test('returns the right values when using custom domains', () => {
    Context.CUSTOM_SHOP_DOMAINS = [CUSTOM_DOMAIN, CUSTOM_DOMAIN_REGEX];

    expect(sanitizeShop(VALID_SHOP_WITH_CUSTOM_DOMAIN)).toEqual(
      VALID_SHOP_WITH_CUSTOM_DOMAIN,
    );
    expect(sanitizeShop(INVALID_SHOP_WITH_CUSTOM_DOMAIN)).toBe(null);

    expect(sanitizeShop(VALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX)).toEqual(
      VALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX,
    );
    expect(sanitizeShop(INVALID_SHOP_WITH_CUSTOM_DOMAIN_REGEX)).toBe(null);
  });
});

describe('sanitizeHost', () => {
  test('returns the shop for valid URLs', () => {
    expect(sanitizeHost(VALID_HOST_1)).toEqual(VALID_HOST_1);
    expect(sanitizeHost(VALID_HOST_2)).toEqual(VALID_HOST_2);
    expect(sanitizeHost(`${VALID_HOST_2}==`)).toEqual(`${VALID_HOST_2}==`);
  });

  test('returns null for invalid URLs', () => {
    expect(sanitizeHost(INVALID_HOST_1)).toBe(null);
    expect(sanitizeHost(INVALID_HOST_2)).toBe(null);
    expect(sanitizeHost(`==${INVALID_HOST_2}`)).toBe(null);
  });
});
