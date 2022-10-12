import {Headers, canonicalizeHeaders} from '../../runtime/http';
import {MemorySessionStorage} from '../../session-storage/memory';
import {ConfigInterface, LATEST_API_VERSION} from '../../lib/base-types';
import {AuthScopes} from '../../lib/auth/scopes';

export function matchHeaders(received: Headers, expected: Headers): boolean {
  let expectedHeadersCorrect = true;
  const canonicalizedReceived = canonicalizeHeaders(received);
  const canonicalizedExpected = canonicalizeHeaders(expected);

  if (Object.keys(canonicalizedExpected).length > 0) {
    for (const [expectedKey, expectedValues] of Object.entries(
      canonicalizedExpected,
    )) {
      expectedHeadersCorrect =
        expectedHeadersCorrect &&
        expectedKey in canonicalizedReceived &&
        received[expectedKey][0].includes(expectedValues[0]);

      if (!expectedHeadersCorrect) return false;
    }
  }
  return expectedHeadersCorrect;
}

export const config: ConfigInterface = {
  apiKey: 'test_key',
  apiSecretKey: 'test_secret_key',
  scopes: new AuthScopes('test_scope'),
  hostName: 'test_host_name',
  hostScheme: 'https',
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: true,
  isPrivateApp: false,
  sessionStorage: new MemorySessionStorage(),
};
