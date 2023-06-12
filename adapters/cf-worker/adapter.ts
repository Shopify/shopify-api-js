import {ShopifyError} from '../../lib/error';
import {
  canonicalizeHeaders,
  flatHeaders,
  AdapterArgs,
  NormalizedRequest,
  NormalizedResponse,
  Headers,
  addHeader,
} from '../../runtime/http';

interface WorkerAdapterArgs extends AdapterArgs {
  rawRequest: Request;
}

type WorkerHeaders = [string, string][];

export async function workerConvertRequest(
  adapterArgs: WorkerAdapterArgs,
): Promise<NormalizedRequest> {
  const request = adapterArgs.rawRequest;
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    addHeader(headers, key, value);
  }

  const url = new URL(request.url!);
  return {
    headers,
    method: request.method ?? 'GET',
    url: `${url.pathname}${url.search}${url.hash}`,
  };
}

export async function workerConvertResponse(
  resp: NormalizedResponse,
  adapterArgs: WorkerAdapterArgs,
): Promise<Response> {
  return new Response(resp.body, {
    status: resp.statusCode,
    statusText: resp.statusText,
    headers: await workerConvertHeaders(resp.headers ?? {}, adapterArgs),
  });
}

export async function workerConvertHeaders(
  headers: Headers,
  _adapterArgs: WorkerAdapterArgs,
): Promise<WorkerHeaders> {
  return Promise.resolve(flatHeaders(headers ?? {}));
}

export async function workerFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  const resp = await fetch(url, {method, headers: flatHeaders(headers), body});
  const respBody = await resp.text();
  return {
    statusCode: resp.status,
    statusText: resp.statusText,
    body: respBody,
    headers: canonicalizeHeaders(Object.fromEntries(resp.headers.entries())),
  };
}

export function workerCreateDefaultStorage(): never {
  throw new ShopifyError(
    'You must specify a session storage implementation for CloudFlare workers',
  );
}

export function workerRuntimeString(): string {
  return 'Cloudflare worker';
}
