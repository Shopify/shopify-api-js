import {
  canonicalizeHeaders,
  flatHeaders,
  Request as AbstractRequest,
  Response as AbstractResponse,
  addHeader,
} from './abstract-http';

export async function convertRequest(req: Request): Promise<AbstractRequest> {
  const body = await new Response(req.body).text();
  const headers = {};
  for (const [key, value] of req.headers.entries()) {
    addHeader(headers, key, value);
  }
  return {
    headers,
    method: req.method ?? 'GET',
    url: req.url!,
    body,
  };
}

export async function convertResponse(
  resp: AbstractResponse,
): Promise<Response> {
  return new Response(resp.body, {
    status: resp.statusCode,
    statusText: resp.statusText,
    headers: flatHeaders(resp.headers ?? {}),
  });
}

export async function abstractFetch({
  url,
  method,
  headers = {},
  body,
}: AbstractRequest): Promise<AbstractResponse> {
  const resp = await fetch(url, {method, headers: flatHeaders(headers), body});
  const respBody = await resp.text();
  return {
    statusCode: resp.status,
    statusText: resp.statusText,
    body: respBody,
    headers: canonicalizeHeaders(Object.fromEntries(resp.headers.entries())),
  };
}
