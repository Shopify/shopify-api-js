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
import {ConfigInterface, ShopifyHeader} from '../base-types';
import {safeCompare} from '../auth/oauth/safe-compare';
import * as ShopifyErrors from '../error';

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
    const {webhookOk, hmac, topic, domain} = webhookCheck;
    let {errorMessage} = webhookCheck;

    if (webhookOk) {
      const generatedHash = await createSHA256HMAC(
        config.apiSecretKey,
        rawBody,
        HashFormat.Base64,
      );

      if (safeCompare(generatedHash, hmac)) {
        const graphqlTopic = topicForStorage(topic);
        const handlers = webhookRegistry[graphqlTopic] || [];

        let found = false;
        for (const handler of handlers) {
          if (handler.deliveryMethod !== DeliveryMethod.Http) {
            continue;
          }
          found = true;

          try {
            await handler.handler(graphqlTopic, domain, rawBody);
            response.statusCode = StatusCode.Ok;
          } catch (error) {
            response.statusCode = StatusCode.InternalServerError;
            errorMessage = error.message;
          }
        }

        if (!found) {
          response.statusCode = StatusCode.NotFound;
          errorMessage = `No HTTP webhooks registered for topic ${topic}`;
        }
      } else {
        response.statusCode = StatusCode.Unauthorized;
        errorMessage = `Could not validate request for topic ${topic}`;
      }
    } else {
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
} {
  const retVal = {
    webhookOk: true,
    errorMessage: '',
    hmac: '',
    topic: '',
    domain: '',
  };

  if (rawBody.length) {
    const hmac = getHeader(headers, ShopifyHeader.Hmac);
    const topic = getHeader(headers, ShopifyHeader.Topic);
    const domain = getHeader(headers, ShopifyHeader.Domain);

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

    if (missingHeaders.length) {
      retVal.webhookOk = false;
      retVal.errorMessage = `Missing one or more of the required HTTP headers to process webhowebhookOks: [${missingHeaders.join(
        ', ',
      )}]`;
    } else {
      retVal.hmac = hmac as string;
      retVal.topic = topic as string;
      retVal.domain = domain as string;
    }
  } else {
    retVal.webhookOk = false;
    retVal.errorMessage = 'No body was received when processing webhook';
  }

  return retVal;
}
