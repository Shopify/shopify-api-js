import {ChildProcess} from 'child_process';

import {NormalizedRequest, NormalizedResponse} from '../../runtime/http';
import {DataType} from '../../lib/clients/types';

export enum TestType {
  Rest = 'rest',
  Graphql = 'graphql',
}
export interface RestTestRequest extends NormalizedRequest {
  type: TestType.Rest;
  bodyType?: DataType;
  tries?: number;
  query?: string;
  retryTimeoutTimer?: number;
}
export interface GraphqlTestRequest extends NormalizedRequest {
  type: TestType.Graphql;
  method: 'post';
  retries?: number;
}
export type TestRequest = RestTestRequest | GraphqlTestRequest;
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
  if (options?.type === TestType.Graphql) {
    return {
      headers: {},
      url: '/admin/api/graphql.json',
      method: 'post',
      body: 'testOperation',
      ...options,
      type: TestType.Graphql,
    };
  } else {
    return {
      method: 'get',
      url: '/url/path',
      headers: {},
      ...options,
      type: TestType.Rest,
    };
  }
}

export function initTestResponse(
  options?: Partial<TestResponse>,
): TestResponse {
  const defaults: TestResponse = {
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
