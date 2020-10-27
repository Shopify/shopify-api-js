import validateShop from '../validateShop';

test('returns a boolean value', () => {
  expect(typeof validateShop('someshop')).toBe('boolean');
});

test('returns true for valid shop urls', () => {
  let shopUrl = 'https://someshop.myshopify.com';
  let result = validateShop(shopUrl);

  expect(result).toBe(true);
});

test('returns false for invalid shop urls', () => {
  let shopUrl = 'https://notshopify.com';
  let result = validateShop(shopUrl);

  expect(result).toBe(false);
});

test("returns false for invalid shop urls, even if they contain the string 'myshopify.com'", () => {
  let shopUrl = 'https://notshopify.myshopify.com.org/potato';
  let result = validateShop(shopUrl);

  expect(result).toBe(false);
});
