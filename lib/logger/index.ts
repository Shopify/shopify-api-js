import {ConfigInterface, LogSeverity} from '../base-types';

import {createLog} from './log';
import {LogContext} from './types';

export function logger(config: ConfigInterface) {
  const log = createLog(config);

  return {
    log,
    debug: async (message: string, context: LogContext = {}) =>
      log(LogSeverity.Debug, message, context),
    info: async (message: string, context: LogContext = {}) =>
      log(LogSeverity.Info, message, context),
    warning: async (message: string, context: LogContext = {}) =>
      log(LogSeverity.Warning, message, context),
    error: async (message: string, context: LogContext = {}) =>
      log(LogSeverity.Error, message, context),
  };
}

export type ShopifyLogger = ReturnType<typeof logger>;
