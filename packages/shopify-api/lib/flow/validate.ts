import {
  HmacValidationType,
  ValidationInvalid,
  ValidationValid,
} from '../utils/types';
import {validateHmacFromRequestFactory} from '../utils/hmac-validator';
import {ConfigInterface} from '../base-types';

import {FlowValidateParams} from './types';

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: FlowValidateParams): Promise<ValidationInvalid | ValidationValid> {
    return validateHmacFromRequestFactory(config)({
      type: HmacValidationType.Flow,
      rawBody,
      ...adapterArgs,
    });
  };
}
