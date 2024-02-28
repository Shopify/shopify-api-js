import {abstractConvertRequest, getHeader} from '../../runtime/http';
import {HashFormat} from '../../runtime/crypto/types';
import {ConfigInterface} from '../base-types';
import {logger} from '../logger';
import {ShopifyHeader} from '../types';
import {validateHmacString} from '../utils/hmac-validator';

import {
  FulfillmentServiceErrorReason,
  FulfillmentServiceInvalid,
  FulfillmentServiceParams,
  FulfillmentServiceValid,
} from './types';

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: FulfillmentServiceParams): Promise<
    FulfillmentServiceInvalid | FulfillmentServiceValid
  > {
    const request = await abstractConvertRequest(adapterArgs);

    if (!rawBody.length) {
      return fail(FulfillmentServiceErrorReason.MissingBody, config);
    }

    const hmac = getHeader(request.headers, ShopifyHeader.Hmac);

    if (!hmac) {
      return fail(FulfillmentServiceErrorReason.MissingHmac, config);
    }

    if (await validateHmacString(config, rawBody, hmac, HashFormat.Base64)) {
      return succeed(config);
    }

    return fail(FulfillmentServiceErrorReason.InvalidHmac, config);
  };
}

async function fail(
  reason: FulfillmentServiceErrorReason,
  config: ConfigInterface,
): Promise<FulfillmentServiceInvalid> {
  const log = logger(config);
  await log.debug('Fulfillment service request is not valid', {reason});

  return {
    valid: false,
    reason,
  };
}

async function succeed(
  config: ConfigInterface,
): Promise<FulfillmentServiceValid> {
  const log = logger(config);
  await log.debug('Fulfillment service request is valid');

  return {
    valid: true,
  };
}
