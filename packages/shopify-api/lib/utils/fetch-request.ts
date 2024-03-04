import {logger} from '../logger';
import {LogSeverity} from '../types';
import {abstractFetch} from '../../runtime';
import {ConfigInterface} from '../base-types';

export function fetchRequestFactory(config: ConfigInterface) {
  return async function fetchRequest(
    url: string,
    options?: RequestInit,
  ): Promise<Response> {
    const log = logger(config);
    const doLog =
      config.logger.httpRequests && config.logger.level === LogSeverity.Debug;

    if (doLog) {
      log.debug('Making HTTP request', {
        method: options?.method || 'GET',
        url,
        ...(options?.body && {body: options?.body}),
      });
    }

    const response = await abstractFetch(url, options);

    if (doLog) {
      log.debug('HTTP request completed', {
        method: options?.method || 'GET',
        url,
        status: response.status,
      });
    }

    return response;
  };
}
