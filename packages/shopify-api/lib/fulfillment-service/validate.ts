import {ConfigInterface} from '../base-types';
import {validateHmacFromRequestFactory} from '../utils/hmac-validator';
import {
  HmacValidationType,
  ValidateParams,
  ValidationInvalid,
  ValidationValid,
} from '../utils/types';

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: ValidateParams): Promise<ValidationInvalid | ValidationValid> {
    return validateHmacFromRequestFactory(config)({
      type: HmacValidationType.FulfillmentService,
      rawBody,
      ...adapterArgs,
    });
  };
}
