import {
  ValidationErrorReason,
  ValidationInvalid,
  ValidationValid,
} from '../utils/types';
import {AdapterArgs} from '../../runtime/types';

export interface FulfillmentServiceParams extends AdapterArgs {
  /**
   * The raw body of the request.
   */
  rawBody: string;
}

export const FulfillmentServiceValidationErrorReason = {
  ...ValidationErrorReason,
} as const;

export type FulfillmentServiceValidationErrorReasonType =
  (typeof FulfillmentServiceValidationErrorReason)[keyof typeof FulfillmentServiceValidationErrorReason];

export interface FulfillmentServiceValidationInvalid
  extends Omit<ValidationInvalid, 'reason'> {
  /**
   * The reason why the request is not valid.
   */
  reason: FulfillmentServiceValidationErrorReasonType;
}

export interface FulfillmentServiceValidationValid extends ValidationValid {}
