import type {MatcherFunction} from 'expect';

export interface ExpectResponseParams {
  url?: string;
  method?: string;
  status?: number;
  body?: string | {[key: string]: any};
  headers?: {[key: string]: any};
}

export const toMatchResponse: MatcherFunction<[ExpectResponseParams]> = (
  response: Response,
  {url, body, headers, status},
) => {
  expect(response.status).toEqual(status ?? 200);

  if (url) {
    expect(response.url).toEqual(url);
  }
  if (body) {
    if (typeof body === 'string') {
      expect(response.text()).resolves.toEqual(body);
    } else {
      expect(response.json()).resolves.toEqual(body);
    }
  }
  if (headers) {
    const responseHeaders = Object.fromEntries(
      new Headers(response.headers).entries(),
    );

    expect(responseHeaders).toMatchObject(headers ?? {});
  }

  return {
    message: () => `expected to have seen the right HTTP response`,
    pass: true,
  };
};
