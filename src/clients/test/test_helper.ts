import fetchMock from 'jest-fetch-mock';

export function assertHttpRequest(
  method: string,
  domain: string,
  path: string,
  headers: Record<string, unknown> = {},
  data: string | null = null,
  retries: number | null = null,
): void {
  const expectResult = expect(fetchMock);
  expectResult.toBeCalledWith(
    `https://${domain}${path}`,
    expect.objectContaining({
      method,
      headers: expect.objectContaining(headers),
      body: data,
    }),
  );

  if (retries !== null) {
    expectResult.toHaveBeenCalledTimes(retries);
  }
}
