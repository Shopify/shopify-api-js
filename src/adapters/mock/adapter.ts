import {MemorySessionStorage} from '../../session/storage/memory';
import {
  AdapterArgs,
  canonicalizeHeaders,
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

export async function mockFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  canonicalizeHeaders(headers);
  const matchingRequest = mockTestRequests.findRequest({
    url,
    method,
    headers,
    body,
  });
  if (matchingRequest === undefined) {
    mockTestRequests.requestList.push({
      url,
      method,
      headers,
      body,
      attempts: 1,
    });
  } else {
    matchingRequest.attempts++;
  }

  const next = mockTestRequests.responseList.shift()!;
  if (next instanceof Error) {
    throw next;
  }
  return next;
}

export function mockCreateDefaultStorage() {
  return new MemorySessionStorage();
}
