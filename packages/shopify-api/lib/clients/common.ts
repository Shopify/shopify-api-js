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
  abstractRuntimeString,
  canonicalizeHeaders,
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
  atMaxRetries: boolean,
  response?: Response,
): never {
  if (typeof response === 'undefined') {
    const message = body?.errors?.message ?? '';
    throw new ShopifyErrors.HttpRequestError(
      `Http request error, no response available: ${message}`,
    );
  }

  const responseHeaders = canonicalizeHeaders(
    Object.fromEntries(response.headers.entries() ?? []),
  );

  if (response.status === StatusCode.Ok && body.errors.graphQLErrors) {
    throw new ShopifyErrors.GraphqlQueryError({
      message:
        body.errors.graphQLErrors?.[0].message ?? 'GraphQL operation failed',
      response: response as Record<string, any>,
      headers: responseHeaders,
      body: body as Record<string, any>,
    });
  }

  const errorMessages: string[] = [];
  if (body.errors) {
    errorMessages.push(JSON.stringify(body.errors, null, 2));
  }
  const xRequestId = getHeader(responseHeaders, 'x-request-id');
  if (xRequestId) {
    errorMessages.push(
      `If you report this error, please include this id: ${xRequestId}`,
    );
  }

  const errorMessage = errorMessages.length
    ? `:\n${errorMessages.join('\n')}`
    : '';
  const code = response.status;
  const statusText = response.statusText;

  switch (true) {
    case response.status === StatusCode.TooManyRequests: {
      if (atMaxRetries) {
        throw new ShopifyErrors.HttpMaxRetriesError(
          'Attempted the maximum number of retries for HTTP request.',
        );
      } else {
        const retryAfter = getHeader(responseHeaders, 'Retry-After');
        throw new ShopifyErrors.HttpThrottlingError({
          message: `Shopify is throttling requests ${errorMessage}`,
          code,
          statusText,
          body,
          headers: responseHeaders,
          retryAfter: retryAfter ? parseFloat(retryAfter) : undefined,
        });
      }
    }
    case response.status >= StatusCode.InternalServerError:
      if (atMaxRetries) {
        throw new ShopifyErrors.HttpMaxRetriesError(
          'Attempted the maximum number of retries for HTTP request.',
        );
      } else {
        throw new ShopifyErrors.HttpInternalError({
          message: `Shopify internal error${errorMessage}`,
          code,
          statusText,
          body,
          headers: responseHeaders,
        });
      }
    default:
      throw new ShopifyErrors.HttpResponseError({
        message: `Received an error response (${response.status} ${response.statusText}) from Shopify${errorMessage}`,
        code,
        statusText,
        body,
        headers: responseHeaders,
      });
  }
}
