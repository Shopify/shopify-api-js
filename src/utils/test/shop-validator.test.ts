import validateShop from '../shop-validator';

test('returns a boolean value', () => {
  expect(typeof validateShop('someshop')).toBe('boolean');
});

test('returns true for valid shop urls', () => {
  const shopUrl = 'https://someshop.myshopify.com';
  const result = validateShop(shopUrl);

  expect(result).toBe(true);
});

test('returns false for invalid shop urls', () => {
  const shopUrl = 'https://notshopify.com';
  const result = validateShop(shopUrl);

  expect(result).toBe(false);
});

test("returns false for invalid shop urls, even if they contain the string 'myshopify.com'", () => {
  const shopUrl = 'https://notshopify.myshopify.com.org/potato';
  const result = validateShop(shopUrl);

  expect(result).toBe(false);
});
