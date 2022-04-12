import {Request, Response} from '../../../adapters/abstract-http';
import {DataType} from '../../../types';

export interface TestRequest extends Request {
  bodyType?: DataType;
  tries?: number;
  query?: string;
  retryTimeoutTimer?: number;
}
export interface TestResponse extends Response {
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
