import {NormalizedResponse} from '../../../runtime/http';
import {GetRequestParams, PostRequestParams} from '../types';

export type TestRequest = (GetRequestParams | PostRequestParams) & {
  method: string;
  retryTimeoutTimer?: number;
};

export interface TestResponse extends NormalizedResponse {
  errorType?: string;
  errorMessage?: string;
  expectRequestId?: string;
}

export interface TestConfig {
  testRequest: TestRequest;
  expectedResponse: TestResponse;
}

export function initTestRequest(options?: Partial<TestRequest>): TestRequest {
  const defaults = {
    method: 'get',
    path: '/url/path',
    extraHeaders: {},
  };
  return {
    ...defaults,
    ...options,
  };
}

export function initTestResponse(
  options?: Partial<TestResponse>,
): TestResponse {
  const defaults = {
    statusCode: 200,
    statusText: 'OK',
    headers: {},
    body: JSON.stringify({message: 'Your HTTP request was successful!'}),
  };

  return {
    ...defaults,
    ...options,
  };
}
