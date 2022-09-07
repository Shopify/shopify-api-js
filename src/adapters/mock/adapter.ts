import {MemorySessionStorage} from '../../session/storage/memory';
import {
  AdapterArgs,
  canonicalizeHeaders,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';

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

type RequestListEntry = NormalizedRequest & {attempts: number};
type ResponseListEntry = NormalizedResponse | Error;
let requestList: RequestListEntry[] = [];
let responseList: ResponseListEntry[] = [];

export function getOldestRequest(): NormalizedRequest {
  if (requestList.length === 0) {
    throw new Error('No requests have been made');
  }
  return requestList.shift()!;
}

export function getMostRecentRequest(): NormalizedRequest {
  if (requestList.length === 0) {
    throw new Error('No requests have been made');
  }
  return requestList.pop()!;
}

export function queueResponse(response: NormalizedResponse): void {
  responseList.push(response);
}

export function queueError(error: Error): void {
  responseList.push(error);
}

export async function mockFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  canonicalizeHeaders(headers);
  const matchingRequest = findRequest({url, method, headers, body});
  if (typeof matchingRequest === 'undefined') {
    requestList.push({url, method, headers, body, attempts: 1});
  } else {
    matchingRequest.attempts++;
  }

  const next = responseList.shift()!;
  if (next instanceof Error) {
    throw next;
  }
  return next;
}

export function findRequest(
  request: NormalizedRequest,
): RequestListEntry | undefined {
  for (const matchingRequest of requestList) {
    if (
      matchingRequest.url === request.url &&
      matchingRequest.method === request.method
    ) {
      if (request.body === undefined || request.body === null) {
        return matchingRequest;
      } else if (matchingRequest.body === request.body) {
        return matchingRequest;
      }
    }
  }
  return undefined;
}

export function reset() {
  requestList = [];
  responseList = [];
}

export function mockCreateDefaultStorage() {
  return new MemorySessionStorage();
}
