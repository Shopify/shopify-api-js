import {
  HTTPResponseLog,
  HTTPRetryLog,
  LogContent,
} from '@shopify/graphql-client';

import {LIBRARY_NAME} from '../types';
import {ConfigInterface} from '../base-types';
import {SHOPIFY_API_LIBRARY_VERSION} from '../version';
import {abstractRuntimeString} from '../../runtime';
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
