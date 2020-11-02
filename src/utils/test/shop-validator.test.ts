import validateShop from '../shop-validator';

test('returns a boolean value', () => {
  expect(typeof validateShop('someshop')).toBe('boolean');
});

test('returns true for valid shop urls', () => {
  const shopUrl = 'https://someshop.myshopify.com';
  expect(validateShop(shopUrl)).toBe(true);
});

test('returns false for invalid shop urls', () => {
  const shopUrl = 'https://notshopify.com';
  const anotherShop = 'https://-invalid.myshopify.com';
  expect(validateShop(shopUrl)).toBe(false);
  expect(validateShop(anotherShop)).toBe(false);
});

test("returns false for invalid shop urls, even if they contain the string 'myshopify.com'", () => {
  const shopUrl = 'https://notshopify.myshopify.com.org/potato';
  expect(validateShop(shopUrl)).toBe(false);
});
