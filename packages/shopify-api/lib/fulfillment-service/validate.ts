import {ConfigInterface} from '../base-types';
import {validateHmacFromRequestFactory} from '../utils/hmac-validator';
import {
  HmacValidationType,
  ValidationInvalid,
  ValidationValid,
} from '../utils/types';

import {FulfillmentServiceParams} from './types';

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: FulfillmentServiceParams): Promise<ValidationInvalid | ValidationValid> {
    return validateHmacFromRequestFactory(config)({
      type: HmacValidationType.FulfillmentService,
      rawBody,
      ...adapterArgs,
    });
  };
}
