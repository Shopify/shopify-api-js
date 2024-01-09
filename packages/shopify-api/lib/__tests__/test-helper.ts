import * as jose from 'jose';
import {compare} from 'compare-versions';

import {JwtPayload} from '../session/types';
import {getHMACKey} from '../utils/get-hmac-key';
import {mockTestRequests} from '../../adapters/mock/mock_test_requests';
import {
  canonicalizeHeaders,
  Cookies,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';
import {Session} from '../session/session';
import {RequestReturn} from '../clients/types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../version';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeWithinSecondsOf(compareDate: number, seconds: number): R;
      toMatchMadeHttpRequest(): R;
      toBeWithinDeprecationSchedule(): R;
    }
  }
}

beforeEach(() => {
  mockTestRequests.reset();
});

afterEach(() => {
  const remainingResponses = mockTestRequests.getResponses();
  if (remainingResponses.length) {
    throw new Error(
      `Test did not check all expected responses, responses: ${JSON.stringify(
        remainingResponses,
        undefined,
        2,
      )}`,
    );
  }
});

test('passes test deprecation checks', () => {
  expect('9999.0.0').toBeWithinDeprecationSchedule();
  expect(() => expect('1.0.0').toBeWithinDeprecationSchedule()).toThrow();
  expect(() =>
    expect(SHOPIFY_API_LIBRARY_VERSION).toBeWithinDeprecationSchedule(),
  ).toThrow();
});

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
    statusCode: partial.statusCode ?? 200,
    statusText: partial.statusText ?? 'OK',
    headers: canonicalizeHeaders({
      'Content-Type': 'application/json',
      ...partial.headers,
    }),
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

// Slightly hacky way to grab the Set-Cookie header from a response and use it as a request's Cookie header
export async function setSignedSessionCookie({
  apiSecretKey,
  request,
  cookieId,
}: {
  apiSecretKey: string;
  request: NormalizedRequest;
  cookieId: string;
}) {
  const cookies = new Cookies(request, {} as NormalizedResponse, {
    keys: [apiSecretKey],
  });
  await cookies.setAndSign('shopify_app_session', cookieId, {
    secure: true,
  });

  // eslint-disable-next-line require-atomic-updates
  request.headers.Cookie = cookies.toHeaders().join(';');
}

export async function createDummySession({
  sessionId,
  isOnline,
  shop = 'test-shop.myshopify.io',
  expires = undefined,
  accessToken = undefined,
}: {
  sessionId: string;
  isOnline: boolean;
  shop?: string;
  expires?: Date;
  accessToken?: string;
}): Promise<Session> {
  const session = new Session({
    id: sessionId,
    shop,
    state: 'state',
    isOnline,
    expires,
    accessToken,
  });

  return session;
}

export function testIfLibraryVersionIsAtLeast(
  version: string,
  testName: string,
  testFn: jest.ProvidesCallback,
) {
  describe(`when library version is at least ${version}`, () => {
    if (compare(SHOPIFY_API_LIBRARY_VERSION, version, '>=')) {
      test(testName, testFn);
    } else {
      test.skip(`- '${testName}' requires library version ${version} or higher`, () => {});
    }
  });
}
