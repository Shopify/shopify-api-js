import {AdapterArgs} from '../../runtime/types';

export interface FulfillmentServiceParams extends AdapterArgs {
  /**
   * The raw body of the request.
   */
  rawBody: string;
}

export enum FulfillmentServiceErrorReason {
  MissingBody = 'missing_body',
  MissingHmac = 'missing_hmac',
  InvalidHmac = 'invalid_hmac',
}

export interface FulfillmentServiceInvalid {
  /**
   * Whether the request is a valid fulfillment service request from Shopify.
   */
  valid: false;
  /**
   * The reason why the request is not valid.
   */
  reason: FulfillmentServiceErrorReason;
}

export interface FulfillmentServiceValid {
  /**
   * Whether the request is a valid fulfillment service request from Shopify.
   */
  valid: true;
}
