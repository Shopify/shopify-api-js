import {compare} from 'compare-versions';

import {LogSeverity} from '../types';
import {ConfigInterface} from '../base-types';
import {FeatureDeprecatedError} from '../error';
import {SHOPIFY_API_LIBRARY_VERSION} from '../version';

import {log, LoggerFunction} from './log';
import {LogContext} from './types';

export function logger(config: ConfigInterface) {
  const logFunction = log(config);

  return {
    log: logFunction,
    debug: async (message: string, context: LogContext = {}) =>
      logFunction(LogSeverity.Debug, message, context),
    info: async (message: string, context: LogContext = {}) =>
      logFunction(LogSeverity.Info, message, context),
    warning: async (message: string, context: LogContext = {}) =>
      logFunction(LogSeverity.Warning, message, context),
    error: async (message: string, context: LogContext = {}) =>
      logFunction(LogSeverity.Error, message, context),
    deprecated: deprecated(logFunction),
  };
}

export type ShopifyLogger = ReturnType<typeof logger>;

function deprecated(logFunction: LoggerFunction) {
  return function (version: string, message: string): void {
    if (compare(SHOPIFY_API_LIBRARY_VERSION, version, '>=')) {
      throw new FeatureDeprecatedError(
        `Feature was deprecated in version ${version}`,
      );
    }

    return logFunction(
      LogSeverity.Warning,
      `[Deprecated | ${version}] ${message}`,
    );
  };
}
