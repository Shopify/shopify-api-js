import {signJWT} from '../../__tests__/test-helper';
import {testConfig} from '../../__tests__/test-config';
import * as ShopifyErrors from '../../error';
import {JwtPayload} from '../types';
import {shopifyApi} from '../..';

let payload: JwtPayload;

describe('JWT session token', () => {
  // The tests below are not in a describe block because we need to alter the config object, and we want to start
  // each test with a valid config.
  beforeEach(() => {
    // Defined here so we can get the initialized config values
    payload = {
      iss: 'test-shop.myshopify.io/admin',
      dest: 'test-shop.myshopify.io',
      aud: 'test_key',
      sub: '1',
      exp: Date.now() / 1000 + 3600,
      nbf: 1234,
      iat: 1234,
      jti: '4321',
      sid: 'abc123',
    };
  });

  test('can verify valid tokens', async () => {
    const shopify = shopifyApi(testConfig());
    const token = await signJWT(shopify.config.apiSecretKey, payload);

    const actualPayload = await shopify.session.decodeSessionToken(token);
    expect(actualPayload).toStrictEqual(payload);
  });

  test('fails with invalid tokens', async () => {
    const shopify = shopifyApi(testConfig());

    await expect(
      shopify.session.decodeSessionToken('not_a_valid_token'),
    ).rejects.toThrow(ShopifyErrors.InvalidJwtError);
  });

  test('fails if the token is expired', async () => {
    const shopify = shopifyApi(testConfig());

    const invalidPayload = {...payload};
    invalidPayload.exp = new Date().getTime() / 1000 - 60;

    const token = await signJWT(shopify.config.apiSecretKey, invalidPayload);
    await expect(shopify.session.decodeSessionToken(token)).rejects.toThrow(
      ShopifyErrors.InvalidJwtError,
    );
  });

  test('fails if the token is not activated yet', async () => {
    const shopify = shopifyApi(testConfig());

    const invalidPayload = {...payload};
    invalidPayload.nbf = new Date().getTime() / 1000 + 60;

    const token = await signJWT(shopify.config.apiSecretKey, invalidPayload);
    await expect(shopify.session.decodeSessionToken(token)).rejects.toThrow(
      ShopifyErrors.InvalidJwtError,
    );
  });

  test('fails if the API key is wrong', async () => {
    const shopify = shopifyApi(testConfig({apiKey: 'something_else'}));

    // The token is signed with a key that is not the current value
    const token = await signJWT(shopify.config.apiSecretKey, payload);

    await expect(shopify.session.decodeSessionToken(token)).rejects.toThrow(
      ShopifyErrors.InvalidJwtError,
    );
  });

  test("doesn't fail on a mismatching API key when not checking the token's audience", async () => {
    const shopify = shopifyApi(testConfig({apiKey: 'something_else'}));

    // The token is signed with a key that is not the current value
    const token = await signJWT(shopify.config.apiSecretKey, payload);

    const actualPayload = await shopify.session.decodeSessionToken(token, {
      checkAudience: false,
    });
    expect(actualPayload).toStrictEqual(payload);
  });

  test("doesn't fail on a missing aud field when not checking the token's audience", async () => {
    const shopify = shopifyApi(testConfig());

    const payloadWithoutAud = {...payload};
    delete (payloadWithoutAud as any).aud;

    // The token is signed with a key that is not the current value
    const token = await signJWT(shopify.config.apiSecretKey, payload);

    const actualPayload = await shopify.session.decodeSessionToken(token, {
      checkAudience: false,
    });
    expect(actualPayload).toStrictEqual(payload);
  });
});
