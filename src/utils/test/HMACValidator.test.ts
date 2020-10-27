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

let testQueryString = querystring.stringify(testQuery);

let hmacValidator: ShopifyHMACValidator;

beforeEach(() => {
  hmacValidator = new ShopifyHMACValidator(testQuery);
});

test('initializes with a query object', () => {
  expect(hmacValidator.query).toEqual(testQuery);
  expect(typeof hmacValidator.query).toBe('object');
});

test('converts query to object when initialized with a string', () => {
  hmacValidator = new ShopifyHMACValidator(testQueryString);
  expect(hmacValidator.query).toEqual(testQuery);
  expect(typeof hmacValidator.query).toBe('object');
});

test("function 'removeHmacFromQuery' alters the query to remove the hmac and updates the queryHmac value", () => {
  hmacValidator.removeHmacFromQuery();

  expect(hmacValidator).toHaveProperty('queryHmac');
  expect(hmacValidator.queryHmac).not.toBe(undefined);

  expect(hmacValidator).toHaveProperty('query');
  expect(hmacValidator.query).not.toBe(undefined);
  expect(hmacValidator.query).not.toHaveProperty('hmac');
});

test("function 'generateLocalHmac' uses 'cleaned' query to generate a comparative local HMAC code", () => {
  let expectedHmacValue =
    '3a95433f2b2126c305c90ee20b80822d12a662d3183d533599ed86dabc3d1bd0';
  hmacValidator.removeHmacFromQuery();
  hmacValidator.generateLocalHmac();

  expect(hmacValidator.localHmac).toEqual(expectedHmacValue);
});

test("after running 'generateLocalHmac', the local and query hmac strings match", () => {
  hmacValidator.removeHmacFromQuery();
  hmacValidator.generateLocalHmac();

  expect(hmacValidator.localHmac).toEqual(hmacValidator.queryHmac);
});

test('function .validate() runs all private methods and returns boolean comparison value', () => {
  let valid = hmacValidator.validate();

  expect(valid).toBe(true);
});
