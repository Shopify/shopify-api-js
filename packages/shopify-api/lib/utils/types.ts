export enum HmacValidationType {
  Flow = 'flow',
  Webhook = 'webhook',
}

export enum ValidationType {
  Flow = 'flow',
  Webhook = 'webhook',
}

export const ValidationErrorReason = {
  MissingBody: 'missing_body',
  InvalidHmac: 'invalid_hmac',
  MissingHmac: 'missing_hmac',
} as const;

export type ValidationErrorReasonType =
  (typeof ValidationErrorReason)[keyof typeof ValidationErrorReason];

export interface ValidationInvalid {
  /**
   * Whether the request is a valid Flow request from Shopify.
   */
  valid: false;
  /**
   * The reason why the request is not valid.
   */
  reason: ValidationErrorReasonType;
}

export interface ValidationValid {
  /**
   * Whether the request is a valid request from Shopify.
   */
  valid: true;
}
