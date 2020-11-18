import fetchMock from 'jest-fetch-mock';

export function assertHttpRequest(
  method: string,
  domain: string,
  path: string,
  headers: Record<string, unknown> = {},
  data: string | null = null
): void {
  expect(fetchMock).toBeCalledWith(
    `https://${domain}${path}`,
    expect.objectContaining({
      method: method,
      headers: expect.objectContaining(headers),
      body: data,
    })
  );
}
