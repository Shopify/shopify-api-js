import {Request, Response} from '../../../../../adapters/abstract-http';
import {DataType} from '../../../types'

export interface TestRequest extends Request {
  bodyType?: DataType;
}
export interface ExpectedResponse extends Response {};

export interface TestConfig {
  testRequest: TestRequest;
  expectedResponse: ExpectedResponse;
}