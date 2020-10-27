import ShopifyHMACValidator from '../HMACValidator';
import querystring from 'querystring';

// Example query: "?code={temporary authorization code}&hmac={hmac}&timestamp={time}&state={nonce}&shop={hostname}"
const testQuery = {
  code: 'some code goes here',
  // hmac generated from the rest of this query object
  hmac: '3a95433f2b2126c305c90ee20b80822d12a662d3183d533599ed86dabc3d1bd0',
  timestamp: 'a number as a string',
  state: 'some nonce passed from auth',
  shop: 'the shop URL',
};

const badQuery = {
  code: 'some code goes here',
  // very obviously incorrect hmac
  hmac: 'incorrect_hmac_string',
  timestamp: 'a number as a string',
  state: 'some nonce passed from auth',
  shop: 'the shop URL',
};

const testQueryString = querystring.stringify(testQuery);

const badQueryString = querystring.stringify(badQuery);

let hmacValidator: ShopifyHMACValidator;

test('initializes with a query object', () => {
  hmacValidator = new ShopifyHMACValidator(testQuery);
  expect(hmacValidator.query).toEqual(testQuery);
  expect(typeof hmacValidator.query).toBe('object');
});

test('converts query to object when initialized with a string', () => {
  hmacValidator = new ShopifyHMACValidator(testQueryString);
  expect(hmacValidator.query).toEqual(testQuery);
  expect(typeof hmacValidator.query).toBe('object');
});

test('correctly validates query objects', () => {
  hmacValidator = new ShopifyHMACValidator(testQuery);
  const result = hmacValidator.validate();
  expect(result).toBe(true);
});

test('correctly validates queries passed as strings', () => {
  hmacValidator = new ShopifyHMACValidator(testQueryString);
  const result = hmacValidator.validate();
  expect(result).toBe(true);
});

test('returns false for queries with incorrect hmac', () => {
  const badHmacValidator = new ShopifyHMACValidator(badQuery);
  const result = badHmacValidator.validate();

  const badHmacStringValidator = new ShopifyHMACValidator(badQueryString);
  const stringResult = badHmacStringValidator.validate();

  expect(result).toBe(false);
  expect(stringResult).toBe(false);
});
