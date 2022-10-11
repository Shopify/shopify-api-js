import {NormalizedRequest, NormalizedResponse} from '../../runtime/http';

type RequestListEntry = NormalizedRequest;
type ResponseListEntry = NormalizedResponse | Error;

interface MockedAdapter {
  requestList: RequestListEntry[];
  responseList: ResponseListEntry[];
  queueResponse: (response: NormalizedResponse) => void;
  queueError: (error: Error) => void;
  getRequest: () => RequestListEntry | undefined;
  getResponses: () => ResponseListEntry[];
  reset: () => void;
}

export const mockTestRequests: MockedAdapter = {
  requestList: [],
  responseList: [],

  queueResponse(response: NormalizedResponse): void {
    this.responseList.push(response);
  },

  queueError(error: Error): void {
    this.responseList.push(error);
  },

  getRequest(): RequestListEntry | undefined {
    return this.requestList.shift();
  },

  getResponses(): ResponseListEntry[] {
    return this.responseList;
  },

  reset() {
    this.requestList = [];
    this.responseList = [];
  },
};
