import fetchMock from 'jest-fetch-mock';

let currentCall = 0;
beforeEach(() => {
  currentCall = 0;
});

interface AssertHttpRequestParams {
  method: string;
  domain: string;
  path: string;
  headers?: {[key: string]: unknown;};
  data?: string | null;
  tries?: number;
}

export function assertHttpRequest({
  method,
  domain,
  path,
  headers = {},
  data = null,
  tries = 1,
}: AssertHttpRequestParams): void {
  const maxCall = currentCall + tries;
  for (let i = currentCall; i < maxCall; i++) {
    currentCall++;
    expect(fetchMock.mock.calls[i]).toEqual([
      `https://${domain}${path}`,
      expect.objectContaining({
        method,
        headers: expect.objectContaining(headers),
        body: data,
      }),
    ]);
  }
}
