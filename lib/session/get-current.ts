import {ConfigInterface} from '../base-types';
import {abstractConvertRequest} from '../../runtime/http';

import {SessionGetCurrentParams} from './types';
import {Session} from './session';
import {createGetCurrentSessionId} from './session-utils';

export function createGetCurrent(config: ConfigInterface) {
  return async ({
    isOnline,
    ...adapterArgs
  }: SessionGetCurrentParams): Promise<Session | undefined> => {
    const request = await abstractConvertRequest(adapterArgs);
    const sessionId = await createGetCurrentSessionId(config)({
      request,
      isOnline,
    });
    if (!sessionId) {
      return Promise.resolve(undefined);
    }

    return config.sessionStorage.loadSession(sessionId);
  };
}
