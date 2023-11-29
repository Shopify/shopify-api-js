import {
  abstractConvertRequest,
  getHeader,
  Headers,
  NormalizedRequest,
} from '../../runtime/http';
import {createSHA256HMAC} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';
import {ShopifyHeader} from '../types';
import {ConfigInterface} from '../base-types';
import {safeCompare} from '../auth/oauth/safe-compare';
import {logger} from '../logger';

import {
  WebhookFields,
  WebhookValidateParams,
  WebhookValidation,
  WebhookValidationErrorReason,
} from './types';
import {topicForStorage} from './registry';

const HANDLER_PROPERTIES = {
  apiVersion: ShopifyHeader.ApiVersion,
  domain: ShopifyHeader.Domain,
  hmac: ShopifyHeader.Hmac,
  topic: ShopifyHeader.Topic,
  webhookId: ShopifyHeader.WebhookId,
};

export function validateFactory(config: ConfigInterface) {
  return async function validate({
    rawBody,
    ...adapterArgs
  }: WebhookValidateParams): Promise<WebhookValidation> {
    const request: NormalizedRequest = await abstractConvertRequest(
      adapterArgs,
    );

    const log = logger(config);

    const webhookCheck = checkWebhookRequest(rawBody, request.headers);
    if (!webhookCheck.valid) {
      await log.debug('Received malformed webhook request', webhookCheck);
      return webhookCheck;
    }

    const {hmac, valid: _valid, ...loggingContext} = webhookCheck;
    await log.debug('Webhook request is well formed', loggingContext);

    if (await checkWebhookHmac(config.apiSecretKey, rawBody, hmac)) {
      await log.debug('Webhook request is valid', loggingContext);
      return webhookCheck;
    } else {
      await log.debug(
        "Webhook HMAC validation failed. Please note that events manually triggered from a store's Notifications settings will fail this validation. To test this, please use the CLI or trigger the actual event in a development store.",
      );
      return {
        valid: false,
        reason: WebhookValidationErrorReason.InvalidHmac,
      };
    }
  };
}

function checkWebhookRequest(
  rawBody: string,
  headers: Headers,
): WebhookValidation {
  if (!rawBody.length) {
    return {
      valid: false,
      reason: WebhookValidationErrorReason.MissingBody,
    };
  }

  const missingHeaders: ShopifyHeader[] = [];
  const entries = Object.entries(HANDLER_PROPERTIES) as [
    keyof WebhookFields,
    ShopifyHeader,
  ][];
  const headerValues = entries.reduce((acc, [property, headerName]) => {
    const headerValue = getHeader(headers, headerName);
    if (headerValue) {
      acc[property] = headerValue;
    } else {
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
      topic: topicForStorage(headerValues.topic),
    };
  }
}

async function checkWebhookHmac(
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
