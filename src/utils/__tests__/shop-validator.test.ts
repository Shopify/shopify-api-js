import validateShop from '../shop-validator';

test('returns true for valid shop urls', () => {
  const shopUrl1 = 'someshop.myshopify.com';
  const shopUrl2 = 'devshop.myshopify.io';
  const shopUrl3 = 'test-shop.myshopify.com';
  const shopUrl4 = 'dev-shop-.myshopify.io';

  expect(validateShop(shopUrl1)).toBe(true);
  expect(validateShop(shopUrl2)).toBe(true);
  expect(validateShop(shopUrl3)).toBe(true);
  expect(validateShop(shopUrl4)).toBe(true);
});

test('returns false for invalid shop urls', () => {
  const shopUrl = 'notshopify.com';
  const anotherShop = '-invalid.myshopify.io';
  expect(validateShop(shopUrl)).toBe(false);
  expect(validateShop(anotherShop)).toBe(false);
});

test("returns false for invalid shop urls, even if they contain the string 'myshopify.io'", () => {
  const shopUrl = 'notshopify.myshopify.io.org/potato';
  expect(validateShop(shopUrl)).toBe(false);
});

test('returns true for spin shop urls', () => {
  const shopUrlUS = 'shop1.shopify.workspace.namespace.us.spin.dev';
  const shopUrlAsia = 'shop1.shopify.workspace.namespace.asia.spin.dev';
  const shopUrlEU = 'shop1.shopify.workspace.namespace.eu.spin.dev';
  expect(validateShop(shopUrlUS)).toBe(true);
  expect(validateShop(shopUrlAsia)).toBe(true);
  expect(validateShop(shopUrlEU)).toBe(true);
});

test('returns false for missing workspace', () => {
  const shopUrl = 'shop1.shopify.namespace.us.spin.dev';
  expect(validateShop(shopUrl)).toBe(false);
});

test('returns false for missing workspace', () => {
  const shopUrl = 'shop1.shopify.workspace.us.spin.dev';
  expect(validateShop(shopUrl)).toBe(false);
});

test('returns false for wrong region', () => {
  const shopUrl = 'shop1.shopify.workspace.namespace.ca.spin.dev';
  expect(validateShop(shopUrl)).toBe(false);
});
