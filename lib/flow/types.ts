import {AdapterArgs} from '../../runtime/types';

export interface FlowValidateParams extends AdapterArgs {
  rawBody: string;
}

export enum FlowValidationErrorReason {
  MissingBody = 'missing_body',
  MissingHmac = 'missing_hmac',
  InvalidHmac = 'invalid_hmac',
}

export interface FlowValidationInvalid {
  valid: false;
  reason: FlowValidationErrorReason;
}

export interface FlowValidationValid {
  valid: true;
}
