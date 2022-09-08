import * as jose from 'jose';

import {shopifyApi} from '..';
import {ConfigParams, LATEST_API_VERSION, Shopify} from '../base-types';
import {MemorySessionStorage} from '../session/storage/memory';
import {JwtPayload} from '../utils/types';
import {getHMACKey} from '../utils/get-hmac-key';
import {mockTestRequests} from '../adapters/mock/mock_test_requests';
import {NormalizedResponse} from '../runtime/http';
import {RequestReturn} from '../clients/http_client/types';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
      toMatchMadeHttpRequest(): R;
    }
  }
}

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

export function buildMockResponse(obj: unknown): string {
  return JSON.stringify(obj);
}

export function buildExpectedResponse(obj: unknown): RequestReturn {
  const expectedResponse: RequestReturn = {
    body: obj,
    headers: expect.objectContaining({}),
  };

  return expect.objectContaining(expectedResponse);
}

export function queueMockResponse(
  body: string,
  partial: Partial<NormalizedResponse> = {},
) {
  mockTestRequests.queueResponse({
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    ...partial,
    body,
  });
}

export function queueError(error: Error) {
  mockTestRequests.queueError(error);
}

export function queueMockResponses(
  ...responses: Parameters<typeof queueMockResponse>[]
) {
  for (const [body, response] of responses) {
    queueMockResponse(body, response);
  }
}
