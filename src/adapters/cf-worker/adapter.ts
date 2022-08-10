import {
  canonicalizeHeaders,
  flatHeaders,
  AdapterArgs,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';

interface WorkerAdapterArgs extends AdapterArgs {
  rawRequest: Request;
}

export async function workerConvertRequest(
  adapterArgs: WorkerAdapterArgs,
): Promise<NormalizedRequest> {
  const req = adapterArgs.rawRequest;
  const body = await req.text();
  return {
    headers: canonicalizeHeaders(req.headers as any),
    method: req.method ?? 'GET',
    url: req.url!,
    body,
  };
}

export async function workerConvertResponse(
  resp: NormalizedResponse,
): Promise<Response> {
  return new Response(resp.body, {
    status: resp.statusCode,
    statusText: resp.statusText,
    headers: flatHeaders(resp.headers ?? {}),
  });
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
