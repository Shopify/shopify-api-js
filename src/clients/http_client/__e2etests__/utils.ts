import {Headers, canonicalizeHeaders} from '../../../adapters/abstract-http';

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
