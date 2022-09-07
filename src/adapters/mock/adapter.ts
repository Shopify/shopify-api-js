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

export async function mockFetch({
  url,
  method,
  headers = {},
  body,
}: NormalizedRequest): Promise<NormalizedResponse> {
  canonicalizeHeaders(headers);
  const matchingRequest = mockAdapter.findRequest({
    url,
    method,
    headers,
    body,
  });
  if (typeof matchingRequest === 'undefined') {
    mockAdapter.requestList.push({url, method, headers, body, attempts: 1});
  } else {
    matchingRequest.attempts++;
  }

  const next = mockAdapter.responseList.shift()!;
  if (next instanceof Error) {
    throw next;
  }
  return next;
}

type RequestListEntry = NormalizedRequest & {attempts: number};
type ResponseListEntry = NormalizedResponse | Error;

interface MockedAdapter {
  requestList: RequestListEntry[];
  responseList: ResponseListEntry[];
  getOldestRequest: () => NormalizedRequest;
  getMostRecentRequest: () => NormalizedRequest;
  queueResponse: (response: NormalizedResponse) => void;
  queueError: (error: Error) => void;
  findRequest: (request: NormalizedRequest) => RequestListEntry | undefined;
  reset: () => void;
}

export const mockAdapter: MockedAdapter = {
  requestList: [],
  responseList: [],

  getOldestRequest(): NormalizedRequest {
    if (this.requestList.length === 0) {
      throw new Error('No requests have been made');
    }
    return this.requestList.shift()!;
  },

  getMostRecentRequest(): NormalizedRequest {
    if (this.requestList.length === 0) {
      throw new Error('No requests have been made');
    }
    return this.requestList.pop()!;
  },

  queueResponse(response: NormalizedResponse): void {
    this.responseList.push(response);
  },

  queueError(error: Error): void {
    this.responseList.push(error);
  },

  findRequest(request: NormalizedRequest): RequestListEntry | undefined {
    for (const matchingRequest of this.requestList) {
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
  },

  reset() {
    this.requestList = [];
    this.responseList = [];
  },
};

export function mockCreateDefaultStorage() {
  return new MemorySessionStorage();
}
