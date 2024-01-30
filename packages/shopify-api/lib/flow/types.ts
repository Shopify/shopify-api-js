import {AdapterArgs} from '../../runtime/types';

export interface FlowValidateParams extends AdapterArgs {
  /**
   * The raw body of the request.
   */
  rawBody: string;
}

export enum FlowValidationErrorReason {
  MissingBody = 'missing_body',
  MissingHmac = 'missing_hmac',
  InvalidHmac = 'invalid_hmac',
}

export interface FlowValidationInvalid {
  /**
   * Whether the request is a valid Flow request from Shopify.
   */
  valid: false;
  /**
   * The reason why the request is not valid.
   */
  reason: FlowValidationErrorReason;
}

export interface FlowValidationValid {
  /**
   * Whether the request is a valid Flow request from Shopify.
   */
  valid: true;
}
