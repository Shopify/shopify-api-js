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
