import {logger} from '../logger';
import {validateHmacFromRequestFactory} from '../utils/hmac-validator';
import {HmacValidationType, ValidationErrorReason} from '../utils/types';
import {
  abstractConvertRequest,
  getHeader,
  Headers,
  NormalizedRequest,
} from '../../runtime/http';
import {ShopifyHeader} from '../types';
import {ConfigInterface} from '../base-types';

import {
  WebhookFields,
  WebhookValidateParams,
  WebhookValidation,
  WebhookValidationErrorReason,
  WebhookValidationMissingHeaders,
  WebhookValidationValid,
} from './types';
import {topicForStorage} from './registry';

const OPTIONAL_HANDLER_PROPERTIES = {
  subTopic: ShopifyHeader.SubTopic,
};

const HANDLER_PROPERTIES = {
  apiVersion: ShopifyHeader.ApiVersion,
  domain: ShopifyHeader.Domain,
  hmac: ShopifyHeader.Hmac,
  topic: ShopifyHeader.Topic,
  webhookId: ShopifyHeader.WebhookId,
  ...OPTIONAL_HANDLER_PROPERTIES,
};

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: WebhookValidateParams): Promise<WebhookValidation> {
    const request: NormalizedRequest =
      await abstractConvertRequest(adapterArgs);

    const validHmacResult = await validateHmacFromRequestFactory(config)({
      type: HmacValidationType.Webhook,
      rawBody,
      ...adapterArgs,
    });

    if (!validHmacResult.valid) {
      // Deprecated: this is for backwards compatibility with the old HMAC validation
      // This will be removed in the next major version, and missing_hmac will be returned instead of missing_header when the hmac is missing
      if (validHmacResult.reason === ValidationErrorReason.MissingHmac) {
        return {
          valid: false,
          reason: WebhookValidationErrorReason.MissingHeaders,
          missingHeaders: [ShopifyHeader.Hmac],
        };
      }
      if (validHmacResult.reason === ValidationErrorReason.InvalidHmac) {
        const log = logger(config);
        await log.debug(
          "Webhook HMAC validation failed. Please note that events manually triggered from a store's Notifications settings will fail this validation. To test this, please use the CLI or trigger the actual event in a development store.",
        );
      }
      return validHmacResult;
    }

    return checkWebhookHeaders(request.headers);
  };
}

function checkWebhookHeaders(
  headers: Headers,
): WebhookValidationMissingHeaders | WebhookValidationValid {
  const missingHeaders: ShopifyHeader[] = [];
  const entries = Object.entries(HANDLER_PROPERTIES) as [
    keyof WebhookFields,
    ShopifyHeader,
  ][];
  const headerValues = entries.reduce((acc, [property, headerName]) => {
    const headerValue = getHeader(headers, headerName);
    if (headerValue) {
      acc[property] = headerValue;
    } else if (!(property in OPTIONAL_HANDLER_PROPERTIES)) {
      missingHeaders.push(headerName);
    }

    return acc;
  }, {} as WebhookFields);

  if (missingHeaders.length) {
    return {
      valid: false,
      reason: WebhookValidationErrorReason.MissingHeaders,
      missingHeaders,
    };
  } else {
    return {
      valid: true,
      ...headerValues,
      ...(headerValues.subTopic ? {subTopic: headerValues.subTopic} : {}),
      topic: topicForStorage(headerValues.topic),
    };
  }
}
