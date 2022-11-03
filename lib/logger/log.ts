import {ConfigInterface, LogSeverity} from '../base-types';

import {LogContext} from './types';

export type LoggerFunction = (
  severity: LogSeverity,
  message: string,
  context?: {[key: string]: any},
) => Promise<void>;

export function createLog(config: ConfigInterface): LoggerFunction {
  return async function (
    severity: LogSeverity,
    message: string,
    context: LogContext = {},
  ): Promise<void> {
    if (severity > config.logger.level) {
      return;
    }

    const prefix: string[] = [];

    if (config.logger.timestamps) {
      prefix.push(`${new Date().toISOString().slice(0, -5)}Z`);
    }

    prefix.push(context.package || 'ShopifyAPI');
    delete context.package;

    switch (severity) {
      case LogSeverity.Debug:
        prefix.push('DEBUG');
        break;
      case LogSeverity.Info:
        prefix.push('INFO');
        break;
      case LogSeverity.Warning:
        prefix.push('WARNING');
        break;
      case LogSeverity.Error:
        prefix.push('ERROR');
        break;
    }

    const contextParts: string[] = [];
    Object.entries(context).forEach(([key, value]) => {
      contextParts.push(`${key}: ${value}`);
    });

    if (contextParts.length > 0) {
      prefix.push(`${contextParts.join(' | ')}`);
    }

    await config.logger.log(severity, `[${prefix.join('][')}]: ${message}`);
  };
}
