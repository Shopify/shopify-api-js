import {
  ValidationErrorReason,
  ValidationInvalid,
  ValidationValid,
} from '../utils/types';
import {AdapterArgs} from '../../runtime/types';

export interface FlowValidateParams extends AdapterArgs {
  /**
   * The raw body of the request.
   */
  rawBody: string;
}

export const FlowValidationErrorReason = {
  ...ValidationErrorReason,
} as const;

export type FlowValidationErrorReasonType =
  (typeof FlowValidationErrorReason)[keyof typeof FlowValidationErrorReason];

export interface FlowValidationInvalid
  extends Omit<ValidationInvalid, 'reason'> {
  /**
   * The reason why the request is not valid.
   */
  reason: FlowValidationErrorReasonType;
}

export interface FlowValidationValid extends ValidationValid {}
