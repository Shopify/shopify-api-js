import fetchMock from 'jest-fetch-mock';

let currentCall = 0;
beforeEach(() => {
  currentCall = 0;
});

export function assertHttpRequest(
  method: string,
  domain: string,
  path: string,
  headers: Record<string, unknown> = {},
  data: string | null = null,
  tries = 1,
): void {
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
