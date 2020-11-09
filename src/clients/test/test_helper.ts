import querystring, { ParsedUrlQueryInput } from 'querystring';

import axios from 'axios';
jest.mock('axios');
export const axiosMock = axios as jest.Mocked<typeof axios>;

export function buildHttpResponse(data: unknown): Promise<unknown> {
  return Promise.resolve({
    status: 200,
    data: data,
  });
}

export function assertHttpRequest(
  method: string,
  domain: string,
  url: string,
  headers: Record<string, unknown> = {},
  data: ParsedUrlQueryInput | null = null
): void {
  expect(axiosMock.request).toBeCalledWith(expect.objectContaining({
    method: method,
    baseURL: `https://${domain}`,
    url: url,
    headers: expect.objectContaining(headers),
    data: data ? querystring.stringify(data) : null,
  }));
}
