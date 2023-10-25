import {abstractConvertRequest, getHeader} from '../../runtime/http';
import {createSHA256HMAC} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';
import {ConfigInterface} from '../base-types';
import {safeCompare} from '../auth/oauth/safe-compare';
import {logger} from '../logger';

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
      fail(FlowValidationErrorReason.MissingBody, config);
    }

    const hmac = getHeader(request.headers, 'x-shopify-hmac-sha256');

    if (!hmac) {
      return fail(FlowValidationErrorReason.MissingHmac, config);
    }

    if (await hmacIsValid(config.apiSecretKey, rawBody, hmac)) {
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
  await log.debug('Flow request is not valid');

  return {
    valid: false,
    reason,
  };
}

async function succeed(config: ConfigInterface): Promise<FlowValidationValid> {
  const log = logger(config);
  await log.debug('Flow request is not valid');

  return {
    valid: true,
  };
}

async function hmacIsValid(
  secret: string,
  rawBody: string,
  hmac: string,
): Promise<boolean> {
  const generatedHash = await createSHA256HMAC(
    secret,
    rawBody,
    HashFormat.Base64,
  );

  return safeCompare(generatedHash, hmac);
}
