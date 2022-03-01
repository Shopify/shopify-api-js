import fetchMock from 'jest-fetch-mock';

let currentCall = 0;
beforeEach(() => {
  currentCall = 0;
});

interface AssertHttpRequestParams {
  method: string;
  domain: string;
  path: string;
  query?: string;
  headers?: {[key: string]: unknown};
  data?: string | {[key: string]: unknown} | null;
  tries?: number;
}

export function assertHttpRequest({
  method,
  domain,
  path,
  query = '',
  headers = {},
  data = null,
  tries = 1,
}: AssertHttpRequestParams): void {
  const bodyObject = data && (typeof data !== 'string');
  const maxCall = currentCall + tries;
  for (let i = currentCall; i < maxCall; i++) {
    currentCall++;

    const mockCall = fetchMock.mock.calls[i];
    expect(mockCall).not.toBeUndefined();

    if (bodyObject && mockCall[1]) {
      mockCall[1].body = JSON.parse(mockCall[1].body as string);
    }

    expect(mockCall[0]).toEqual(
      `https://${domain}${path}${
        query ? `?${query.replace(/\+/g, '%20')}` : ''
      }`,
    );
    expect(mockCall[1]).toMatchObject({method, headers, body: data});
  }
}
