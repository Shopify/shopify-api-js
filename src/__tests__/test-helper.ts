import * as jose from 'jose';

import {shopifyApi} from '..';
import {ConfigParams, LATEST_API_VERSION, Shopify} from '../base-types';
import {MemorySessionStorage} from '../auth/session/storage/memory';
import {JwtPayload} from '../utils/types';
import {getHMACKey} from '../utils/get-hmac-key';

// eslint-disable-next-line import/no-mutable-exports
let shopify: Shopify;

beforeEach(() => {
  const testConfig: ConfigParams = {
    apiKey: 'test_key',
    apiSecretKey: 'test_secret_key',
    scopes: ['test_scope'],
    hostName: 'test_host_name',
    hostScheme: 'https',
    apiVersion: LATEST_API_VERSION,
    isEmbeddedApp: false,
    isPrivateApp: false,
    sessionStorage: new MemorySessionStorage(),
    customShopDomains: undefined,
    billing: undefined,
  };

  shopify = shopifyApi(testConfig);
});

export {shopify};

export async function signJWT(
  secret: string,
  payload: JwtPayload,
): Promise<string> {
  return new jose.SignJWT(payload as any)
    .setProtectedHeader({alg: 'HS256'})
    .sign(getHMACKey(secret));
}
