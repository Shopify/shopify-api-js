import validateShop from '../shop-validator';

test('returns a boolean value', () => {
  expect(typeof validateShop('someshop')).toBe('boolean');
});

test('returns true for valid shop urls', () => {
  const shopUrl = 'someshop.myshopify.io';
  expect(validateShop(shopUrl)).toBe(true);
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
