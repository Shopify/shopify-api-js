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

    let packageString = context.package || 'shopify-api';
    delete context.package;

    switch (severity) {
      case LogSeverity.Debug:
        packageString = `${packageString}/DEBUG`;
        break;
      case LogSeverity.Info:
        packageString = `${packageString}/INFO`;
        break;
      case LogSeverity.Warning:
        packageString = `${packageString}/WARNING`;
        break;
      case LogSeverity.Error:
        packageString = `${packageString}/ERROR`;
        break;
    }

    prefix.push(packageString);

    const contextParts: string[] = [];
    Object.entries(context).forEach(([key, value]) => {
      contextParts.push(`${key}: ${value}`);
    });

    let suffix = '';
    if (contextParts.length > 0) {
      suffix = ` | {${contextParts.join(', ')}}`;
    }

    await config.logger.log(
      severity,
      `[${prefix.join('] [')}] ${message}${suffix}`,
    );
  };
}
