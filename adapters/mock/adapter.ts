import {MemorySessionStorage} from '../../session-storage/memory';
import {
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

export async function mockFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  mockTestRequests.requestList.push({
    url,
    method,
    headers: canonicalizeHeaders(headers),
    body,
  });

  const next = mockTestRequests.responseList.shift()!;
  if (next instanceof Error) {
    throw next;
  }
  return next;
}

export function mockCreateDefaultStorage() {
  return new MemorySessionStorage();
}

export function mockRuntimeString() {
  return 'Mock adapter';
}
