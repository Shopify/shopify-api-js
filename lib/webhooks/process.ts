import {StatusCode} from '@shopify/network';

import {
  abstractConvertRequest,
  abstractConvertResponse,
  AdapterResponse,
  getHeader,
  Headers,
  isOK,
  NormalizedRequest,
  NormalizedResponse,
} from '../../runtime/http';
import {createSHA256HMAC} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';
import {ShopifyHeader} from '../types';
import {ConfigInterface} from '../base-types';
import {safeCompare} from '../auth/oauth/safe-compare';
import * as ShopifyErrors from '../error';
import {logger} from '../logger';

import {WebhookRegistry, WebhookProcessParams, DeliveryMethod} from './types';
import {topicForStorage} from './registry';

export function createProcess(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry,
) {
  return async function process({
    rawBody,
    ...adapterArgs
  }: WebhookProcessParams): Promise<AdapterResponse> {
    const request: NormalizedRequest = await abstractConvertRequest(
      adapterArgs,
    );
    const response: NormalizedResponse = {
      statusCode: StatusCode.Ok,
      statusText: statusTextLookup[StatusCode.Ok],
      headers: {},
    };

    const webhookCheck = checkWebhookRequest(rawBody, request.headers);
    const {webhookOk, hmac, topic, domain, webhookId} = webhookCheck;
    let {errorMessage} = webhookCheck;

    const log = logger(config);
    log.info('Processing webhook request', {topic, domain, webhookId});

    if (webhookOk) {
      log.debug('Webhook request is well formed', {topic, domain, webhookId});

      if (await validateOkWebhook(config.apiSecretKey, rawBody, hmac)) {
        log.debug('Webhook request is valid', {topic, domain, webhookId});

        const graphqlTopic = topicForStorage(topic);
        const handlers = webhookRegistry[graphqlTopic] || [];

        let found = false;
        for (const handler of handlers) {
          if (
            handler.deliveryMethod !== DeliveryMethod.Http ||
            handler.callbackUrl !== request.url
          ) {
            continue;
          }
          found = true;

          log.debug('Found HTTP handler, triggering it', {
            topic,
            domain,
            webhookId,
          });

          try {
            await handler.callback(graphqlTopic, domain, rawBody, webhookId);
            response.statusCode = StatusCode.Ok;
          } catch (error) {
            response.statusCode = StatusCode.InternalServerError;
            errorMessage = error.message;
          }
        }

        if (!found) {
          log.debug('No HTTP handlers found', {topic, domain, webhookId});

          response.statusCode = StatusCode.NotFound;
          errorMessage = `No HTTP webhooks registered for topic ${topic}`;
        }
      } else {
        log.debug('Webhook validation failed', {topic, domain, webhookId});

        response.statusCode = StatusCode.Unauthorized;
        errorMessage = `Could not validate request for topic ${topic}`;
      }
    } else {
      log.debug('Webhook request is malformed', {topic, domain, webhookId});

      response.statusCode = StatusCode.BadRequest;
    }

    response.statusText = statusTextLookup[response.statusCode];
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

const statusTextLookup: {[key: string]: string} = {
  [StatusCode.Ok]: 'OK',
  [StatusCode.BadRequest]: 'Bad Request',
  [StatusCode.Unauthorized]: 'Unauthorized',
  [StatusCode.NotFound]: 'Not Found',
  [StatusCode.InternalServerError]: 'Internal Server Error',
};

function checkWebhookRequest(
  rawBody: string,
  headers: Headers,
): {
  webhookOk: boolean;
  errorMessage: string;
  hmac: string;
  topic: string;
  domain: string;
  webhookId: string;
} {
  const retVal = {
    webhookOk: true,
    errorMessage: '',
    hmac: '',
    topic: '',
    domain: '',
    webhookId: '',
  };

  if (rawBody.length) {
    const hmac = getHeader(headers, ShopifyHeader.Hmac);
    const topic = getHeader(headers, ShopifyHeader.Topic);
    const domain = getHeader(headers, ShopifyHeader.Domain);
    const webhookId = getHeader(headers, ShopifyHeader.WebhookId);

    const missingHeaders: ShopifyHeader[] = [];
    if (!hmac) {
      missingHeaders.push(ShopifyHeader.Hmac);
    }
    if (!topic) {
      missingHeaders.push(ShopifyHeader.Topic);
    }
    if (!domain) {
      missingHeaders.push(ShopifyHeader.Domain);
    }
    if (!webhookId) {
      missingHeaders.push(ShopifyHeader.WebhookId);
    }

    if (missingHeaders.length) {
      retVal.webhookOk = false;
      retVal.errorMessage = `Missing one or more of the required HTTP headers to process webhowebhookOks: [${missingHeaders.join(
        ', ',
      )}]`;
    } else {
      retVal.hmac = hmac as string;
      retVal.topic = topic as string;
      retVal.domain = domain as string;
      retVal.webhookId = webhookId as string;
    }
  } else {
    retVal.webhookOk = false;
    retVal.errorMessage = 'No body was received when processing webhook';
  }

  return retVal;
}

async function validateOkWebhook(
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
