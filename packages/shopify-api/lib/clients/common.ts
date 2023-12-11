import {
  HTTPResponseLog,
  HTTPRetryLog,
  LogContent,
} from '@shopify/admin-api-client';
import {StatusCode} from '@shopify/network';

import * as ShopifyErrors from '../error';
import {LIBRARY_NAME} from '../types';
import {ConfigInterface} from '../base-types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../version';
import {
  NormalizedResponse,
  abstractRuntimeString,
  getHeader,
} from '../../runtime';
import {logger} from '../logger';

export function getUserAgent(config: ConfigInterface): string {
  let userAgentPrefix = `${LIBRARY_NAME} v${SHOPIFY_API_LIBRARY_VERSION} | ${abstractRuntimeString()}`;
  if (config.userAgentPrefix) {
    userAgentPrefix = `${config.userAgentPrefix} | ${userAgentPrefix}`;
  }

  return userAgentPrefix;
}

export function clientLoggerFactory(config: ConfigInterface) {
  return (logContent: LogContent) => {
    if (config.logger.httpRequests) {
      switch (logContent.type) {
        case 'HTTP-Response': {
          const responseLog: HTTPResponseLog['content'] = logContent.content;
          logger(config).debug('Received response for HTTP request', {
            requestParams: JSON.stringify(responseLog.requestParams),
            response: JSON.stringify(responseLog.response),
          });
          break;
        }
        case 'HTTP-Retry': {
          const responseLog: HTTPRetryLog['content'] = logContent.content;
          logger(config).debug('Retrying HTTP request', {
            requestParams: JSON.stringify(responseLog.requestParams),
            retryAttempt: responseLog.retryAttempt,
            maxRetries: responseLog.maxRetries,
            response: JSON.stringify(responseLog.lastResponse),
          });
          break;
        }
        default: {
          logger(config).debug(`HTTP request event: ${logContent.content}`);
          break;
        }
      }
    }
  };
}

export function throwFailedRequest(
  body: any,
  response: NormalizedResponse,
  retry = true,
): never {
  const errorMessages: string[] = [];
  if (body.errors) {
    errorMessages.push(JSON.stringify(body.errors, null, 2));
  }
  const xRequestId = getHeader(response.headers, 'x-request-id');
  if (xRequestId) {
    errorMessages.push(
      `If you report this error, please include this id: ${xRequestId}`,
    );
  }

  const errorMessage = errorMessages.length
    ? `:\n${errorMessages.join('\n')}`
    : '';
  const headers = response.headers ? response.headers : {};
  const code = response.statusCode;
  const statusText = response.statusText;

  switch (true) {
    case response.statusCode === StatusCode.TooManyRequests: {
      if (retry) {
        const retryAfter = getHeader(response.headers, 'Retry-After');
        throw new ShopifyErrors.HttpThrottlingError({
          message: `Shopify is throttling requests${errorMessage}`,
          code,
          statusText,
          body,
          headers,
          retryAfter: retryAfter ? parseFloat(retryAfter) : undefined,
        });
      } else {
        throw new ShopifyErrors.HttpMaxRetriesError(
          'Attempted the maximum number of retries for HTTP request.',
        );
      }
    }
    case response.statusCode >= StatusCode.InternalServerError:
      throw new ShopifyErrors.HttpInternalError({
        message: `Shopify internal error${errorMessage}`,
        code,
        statusText,
        body,
        headers,
      });
    default:
      throw new ShopifyErrors.HttpResponseError({
        message: `Received an error response (${response.statusCode} ${response.statusText}) from Shopify${errorMessage}`,
        code,
        statusText,
        body,
        headers,
      });
  }
}
