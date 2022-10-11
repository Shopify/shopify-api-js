import {ChildProcess} from 'child_process';

import {NormalizedRequest, NormalizedResponse} from '../../runtime/http';
import {DataType} from '../../lib/clients/http_client/types';

export interface TestRequest extends NormalizedRequest {
  bodyType?: DataType;
  tries?: number;
  query?: string;
  retryTimeoutTimer?: number;
}
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
    url: '/url/path',
    headers: {},
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

export interface E2eTestEnvironment {
  name: string;
  domain: string;
  dummyServerPort: string;
  process: ChildProcess;
  testable: boolean;
  ready: boolean;
}
