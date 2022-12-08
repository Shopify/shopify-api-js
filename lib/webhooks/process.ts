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

export function process(
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
    const {webhookOk, apiVersion, domain, hmac, topic, webhookId} =
      webhookCheck;
    let {errorMessage} = webhookCheck;
    const loggingContext = {apiVersion, domain, topic, webhookId};

    const log = logger(config);
    log.info('Processing webhook request', loggingContext);

    if (webhookOk) {
      log.debug('Webhook request is well formed', loggingContext);

      if (await validateOkWebhook(config.apiSecretKey, rawBody, hmac)) {
        log.debug('Webhook request is valid', loggingContext);

        const graphqlTopic = topicForStorage(topic);
        const handlers = webhookRegistry[graphqlTopic] || [];

        let found = false;
        for (const handler of handlers) {
          if (handler.deliveryMethod !== DeliveryMethod.Http) {
            continue;
          }
          found = true;

          log.debug('Found HTTP handler, triggering it', loggingContext);

          try {
            await handler.callback(
              graphqlTopic,
              domain,
              rawBody,
              webhookId,
              apiVersion,
            );
            response.statusCode = StatusCode.Ok;
          } catch (error) {
            response.statusCode = StatusCode.InternalServerError;
            errorMessage = error.message;
          }
        }

        if (!found) {
          log.debug('No HTTP handlers found', loggingContext);

          response.statusCode = StatusCode.NotFound;
          errorMessage = `No HTTP webhooks registered for topic ${topic}`;
        }
      } else {
        log.debug('Webhook validation failed', loggingContext);

        response.statusCode = StatusCode.Unauthorized;
        errorMessage = `Could not validate request for topic ${topic}`;
      }
    } else {
      log.debug('Webhook request is malformed', loggingContext);

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

const headerProperties: {property: string; headerName: ShopifyHeader}[] = [
  {
    property: 'apiVersion',
    headerName: ShopifyHeader.ApiVersion,
  },
  {
    property: 'domain',
    headerName: ShopifyHeader.Domain,
  },
  {
    property: 'hmac',
    headerName: ShopifyHeader.Hmac,
  },
  {
    property: 'topic',
    headerName: ShopifyHeader.Topic,
  },
  {
    property: 'webhookId',
    headerName: ShopifyHeader.WebhookId,
  },
];

function checkWebhookRequest(
  rawBody: string,
  headers: Headers,
): {
  webhookOk: boolean;
  errorMessage: string;
  apiVersion: string;
  domain: string;
  hmac: string;
  topic: string;
  webhookId: string;
} {
  let retVal = {
    webhookOk: true,
    errorMessage: '',
    apiVersion: '',
    domain: '',
    hmac: '',
    topic: '',
    webhookId: '',
  };

  if (rawBody.length) {
    const missingHeaders: ShopifyHeader[] = [];
    const headerValues: {[property: string]: string} = {};
    headerProperties.forEach(({property, headerName}) => {
      const headerValue = getHeader(headers, headerName);
      if (headerValue) {
        headerValues[property] = headerValue;
      } else {
        missingHeaders.push(headerName);
      }
    });

    if (missingHeaders.length) {
      retVal.webhookOk = false;
      retVal.errorMessage = `Missing one or more of the required HTTP headers to process webhooks: [${missingHeaders.join(
        ', ',
      )}]`;
    } else {
      retVal = {
        ...retVal,
        ...headerValues,
      };
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
