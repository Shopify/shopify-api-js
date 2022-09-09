import {ConfigInterface} from '../base-types';
import * as ShopifyErrors from '../error';
import {abstractConvertRequest} from '../runtime/http';

import {SessionDeleteCurrentParams} from './types';
import {createGetCurrentSessionId} from './session-utils';

export function createDeleteCurrent(config: ConfigInterface) {
  return async ({
    isOnline,
    ...adapterArgs
  }: SessionDeleteCurrentParams): Promise<boolean> => {
    const request = await abstractConvertRequest(adapterArgs);
    const sessionId = await createGetCurrentSessionId(config)({
      request,
      isOnline,
    });
    if (!sessionId) {
      throw new ShopifyErrors.SessionNotFound('No active session found.');
    }

    return config.sessionStorage.deleteSession(sessionId);
  };
}
