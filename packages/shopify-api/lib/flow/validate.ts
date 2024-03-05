import {
  HmacValidationType,
  ValidationInvalid,
  ValidationValid,
  ValidateParams,
} from '../utils/types';
import {validateHmacFromRequestFactory} from '../utils/hmac-validator';
import {ConfigInterface} from '../base-types';

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: ValidateParams): Promise<ValidationInvalid | ValidationValid> {
    return validateHmacFromRequestFactory(config)({
      type: HmacValidationType.Flow,
      rawBody,
      ...adapterArgs,
    });
  };
}
