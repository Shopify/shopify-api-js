import type {
  Headers as ShopifyHeaders,
  AdapterArgs,
  NormalizedResponse,
  NormalizedRequest,
} from '../../runtime';
import {addHeader, canonicalizeHeaders, flatHeaders} from '../../runtime';

interface WebApiAdapterArgs extends AdapterArgs {
  rawRequest: Request;
}

export async function webApiConvertRequest(
  adapterArgs: WebApiAdapterArgs,
): Promise<NormalizedRequest> {
  const request = adapterArgs.rawRequest;
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    addHeader(headers, key, value);
  }

  return {
    headers,
    method: request.method ?? 'GET',
    url: new URL(request.url).toString(),
  };
}

export async function webApiConvertHeaders(
  headers: ShopifyHeaders,
  _adapterArgs: WebApiAdapterArgs,
): Promise<Headers> {
  const remixHeaders = new Headers();
  flatHeaders(headers ?? {}).forEach(([key, value]) =>
    remixHeaders.append(key, value),
  );
  return Promise.resolve(remixHeaders);
}

export async function webApiConvertResponse(
  resp: NormalizedResponse,
  adapterArgs: WebApiAdapterArgs,
): Promise<Response> {
  return new Response(resp.body, {
    status: resp.statusCode,
    statusText: resp.statusText,
    headers: await webApiConvertHeaders(resp.headers ?? {}, adapterArgs),
  });
}

export async function webApiFetch({
  headers,
  method,
  url,
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  const resp = await fetch(url, {
    method,
    headers: flatHeaders(headers),
    body,
  });
  const respBody = await resp.text();
  return {
    statusCode: resp.status,
    statusText: resp.statusText,
    body: respBody,
    headers: canonicalizeHeaders(Object.fromEntries(resp.headers.entries())),
  };
}

export function webApiRuntimeString(): string {
  return 'Web API';
}
