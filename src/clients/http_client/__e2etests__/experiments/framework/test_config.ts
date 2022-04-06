import {Request, Response} from '../../../../../adapters/abstract-http';
import {DataType} from '../../../types'

export interface TestRequest extends Request {
  bodyType?: DataType;
  tries?: number;
  query?: string;
}
export interface ExpectedResponse extends Response {
  errorType?: string;
  errorMessage?: string;
  expectRequestId?: string;
};

export interface TestConfig {
  testRequest: TestRequest;
  expectedResponse: ExpectedResponse;
}