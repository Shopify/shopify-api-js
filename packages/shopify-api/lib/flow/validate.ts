import {abstractConvertRequest, getHeader} from '../../runtime/http';
import {HashFormat} from '../../runtime/crypto/types';
import {ConfigInterface} from '../base-types';
import {logger} from '../logger';
import {ShopifyHeader} from '../types';
import {validateHmacString} from '../utils/hmac-validator';

import {
  FlowValidateParams,
  FlowValidationInvalid,
  FlowValidationValid,
  FlowValidationErrorReason,
} from './types';

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: FlowValidateParams): Promise<FlowValidationInvalid | FlowValidationValid> {
    const request = await abstractConvertRequest(adapterArgs);

    if (!rawBody.length) {
      return fail(FlowValidationErrorReason.MissingBody, config);
    }

    const hmac = getHeader(request.headers, ShopifyHeader.Hmac);

    if (!hmac) {
      return fail(FlowValidationErrorReason.MissingHmac, config);
    }

    if (await validateHmacString(config, rawBody, hmac, HashFormat.Base64)) {
      return succeed(config);
    }

    return fail(FlowValidationErrorReason.InvalidHmac, config);
  };
}

async function fail(
  reason: FlowValidationErrorReason,
  config: ConfigInterface,
): Promise<FlowValidationInvalid> {
  const log = logger(config);
  await log.debug('Flow request is not valid', {reason});

  return {
    valid: false,
    reason,
  };
}

async function succeed(config: ConfigInterface): Promise<FlowValidationValid> {
  const log = logger(config);
  await log.debug('Flow request is valid');

  return {
    valid: true,
  };
}
