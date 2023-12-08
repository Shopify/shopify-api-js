import {
  Headers as FetchHeaders,
  Request,
  RequestInit,
  Response,
} from 'node-fetch';

import {
  AbstractFetchFunc,
  AdapterArgs,
  AdapterHeaders,
  canonicalizeHeaders,
  Headers,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';

import {mockTestRequests} from './mock_test_requests';

interface MockAdapterArgs extends AdapterArgs {
  rawRequest: NormalizedRequest;
}

export async function mockConvertRequest(
  adapterArgs: MockAdapterArgs,
): Promise<NormalizedRequest> {
  return Promise.resolve(adapterArgs.rawRequest);
}

export async function mockConvertResponse(
  response: NormalizedResponse,
  _adapterArgs: MockAdapterArgs,
): Promise<NormalizedResponse> {
  return Promise.resolve(response);
}

export async function mockConvertHeaders(
  headers: Headers,
  _adapterArgs: MockAdapterArgs,
): Promise<AdapterHeaders> {
  return Promise.resolve(headers);
}

export const mockFetch: AbstractFetchFunc = async (url, init) => {
  const mockInit = init as RequestInit;

  const request = new Request(url as string, mockInit);
  const headers = Object.fromEntries(
    new FetchHeaders(mockInit?.headers).entries(),
  );

  mockTestRequests.requestList.push({
    url: request.url,
    method: request.method,
    headers: canonicalizeHeaders(headers),
    body: await request.text(),
  });

  const next = mockTestRequests.responseList.shift()!;
  if (!next) {
    throw new Error(
      `Missing mock for ${request.method} to ${url}, have you queued all required responses?`,
    );
  }
  if (next instanceof Error) {
    throw next;
  }

  const responseHeaders = new FetchHeaders();
  Object.entries(next.headers ?? {}).forEach(([key, value]) => {
    responseHeaders.set(
      key,
      typeof value === 'string' ? value : value.join(', '),
    );
  });

  return new Response(next.body, {
    status: next.statusCode,
    statusText: next.statusText,
    headers: responseHeaders as any,
  }) as any;
};

export function mockRuntimeString() {
  return 'Mock adapter';
}
