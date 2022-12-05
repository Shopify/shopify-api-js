import {LogSeverity} from '../types';
import {ConfigInterface} from '../base-types';

import {log} from './log';
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
  };
}

export type ShopifyLogger = ReturnType<typeof logger>;
