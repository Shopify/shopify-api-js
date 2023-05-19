import {StatusCode} from '@shopify/network';

import {
  abstractConvertResponse,
  AdapterResponse,
  isOK,
  NormalizedResponse,
} from '../../runtime/http';
import {ConfigInterface} from '../base-types';
import * as ShopifyErrors from '../error';
import {logger} from '../logger';

import {
  DeliveryMethod,
  HttpWebhookHandlerWithCallback,
  WebhookProcessParams,
  WebhookRegistry,
  WebhookValidationErrorReason,
  WebhookValidationInvalid,
  WebhookValidationMissingHeaders,
  WebhookValidationValid,
} from './types';
import {validateFactory} from './validate';

interface HandlerCallResult {
  statusCode: StatusCode;
  errorMessage?: string;
}

interface ErrorCallResult {
  statusCode: StatusCode;
  errorMessage: string;
}

const STATUS_TEXT_LOOKUP: {[key: string]: string} = {
  [StatusCode.Ok]: 'OK',
  [StatusCode.BadRequest]: 'Bad Request',
  [StatusCode.Unauthorized]: 'Unauthorized',
  [StatusCode.NotFound]: 'Not Found',
  [StatusCode.InternalServerError]: 'Internal Server Error',
};

export function process(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry<HttpWebhookHandlerWithCallback>,
) {
  return async function process({
    rawBody,
    ...adapterArgs
  }: WebhookProcessParams): Promise<AdapterResponse> {
    const response: NormalizedResponse = {
      statusCode: StatusCode.Ok,
      statusText: STATUS_TEXT_LOOKUP[StatusCode.Ok],
      headers: {},
    };

    await logger(config).info('Receiving webhook request');

    const webhookCheck = await validateFactory(config)({
      rawBody,
      ...adapterArgs,
    });

    let errorMessage = 'Unknown error while handling webhook';
    if (webhookCheck.valid) {
      const handlerResult = await callWebhookHandlers(
        config,
        webhookRegistry,
        webhookCheck,
        rawBody,
      );

      response.statusCode = handlerResult.statusCode;
      if (!isOK(response)) {
        errorMessage = handlerResult.errorMessage || errorMessage;
      }
    } else {
      const errorResult = await handleInvalidWebhook(config, webhookCheck);

      response.statusCode = errorResult.statusCode;
      response.statusText = STATUS_TEXT_LOOKUP[response.statusCode];
      errorMessage = errorResult.errorMessage;
    }

    const returnResponse = await abstractConvertResponse(response, adapterArgs);
    if (!isOK(response)) {
      throw new ShopifyErrors.InvalidWebhookError({
        message: errorMessage,
        response: returnResponse,
      });
    }

    return Promise.resolve(returnResponse);
  };
}

async function callWebhookHandlers(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry<HttpWebhookHandlerWithCallback>,
  webhookCheck: WebhookValidationValid,
  rawBody: string,
): Promise<HandlerCallResult> {
  const log = logger(config);
  const {hmac: _hmac, valid: _valid, ...loggingContext} = webhookCheck;

  await log.debug(
    'Webhook request is valid, looking for HTTP handlers to call',
    loggingContext,
  );

  const handlers = webhookRegistry[webhookCheck.topic] || [];

  const response: HandlerCallResult = {statusCode: StatusCode.Ok};

  let found = false;
  for (const handler of handlers) {
    if (handler.deliveryMethod !== DeliveryMethod.Http) {
      continue;
    }
    if (!handler.callback) {
      response.statusCode = StatusCode.InternalServerError;
      response.errorMessage =
        "Cannot call webhooks.process with a webhook handler that doesn't have a callback";

      throw new ShopifyErrors.MissingWebhookCallbackError({
        message: response.errorMessage,
        response,
      });
    }

    found = true;

    await log.debug('Found HTTP handler, triggering it', loggingContext);

    try {
      await handler.callback(
        webhookCheck.topic,
        webhookCheck.domain,
        rawBody,
        webhookCheck.webhookId,
        webhookCheck.apiVersion,
      );
    } catch (error) {
      response.statusCode = StatusCode.InternalServerError;
      response.errorMessage = error.message;
    }
  }

  if (!found) {
    await log.debug('No HTTP handlers found', loggingContext);

    response.statusCode = StatusCode.NotFound;
    response.errorMessage = `No HTTP webhooks registered for topic ${webhookCheck.topic}`;
  }

  return response;
}

async function handleInvalidWebhook(
  config: ConfigInterface,
  webhookCheck: WebhookValidationInvalid,
): Promise<ErrorCallResult> {
  const response: ErrorCallResult = {
    statusCode: StatusCode.InternalServerError,
    errorMessage: 'Unknown error while handling webhook',
  };

  switch (webhookCheck.reason) {
    case WebhookValidationErrorReason.MissingHeaders:
      response.statusCode = StatusCode.BadRequest;
      response.errorMessage = `Missing one or more of the required HTTP headers to process webhooks: [${(
        webhookCheck as WebhookValidationMissingHeaders
      ).missingHeaders.join(', ')}]`;
      break;
    case WebhookValidationErrorReason.MissingBody:
      response.statusCode = StatusCode.BadRequest;
      response.errorMessage = 'No body was received when processing webhook';
      break;
    case WebhookValidationErrorReason.InvalidHmac:
      response.statusCode = StatusCode.Unauthorized;
      response.errorMessage = `Could not validate request HMAC`;
      break;
  }

  await logger(config).debug(
    `Webhook request is invalid, returning ${response.statusCode}: ${response.errorMessage}`,
  );

  return response;
}
