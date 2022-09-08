import {NormalizedRequest, NormalizedResponse} from '../../runtime/http';

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

export const mockTestRequests: MockedAdapter = {
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
        if (!request.body && !matchingRequest.body) {
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
