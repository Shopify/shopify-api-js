import {ConfigInterface} from '../base-types';

import {createDecodeSessionToken} from './decode-session-token';
import {createDeleteCurrent} from './delete-current';
import {createGetCurrent} from './get-current';
import {createDeleteOffline} from './delete-offline';
import {createGetOffline} from './get-offline';
import {createWithSession} from './with-session';

export function shopifySession(config: ConfigInterface) {
  return {
    decodeSessionToken: createDecodeSessionToken(config),
    getCurrent: createGetCurrent(config),
    deleteCurrent: createDeleteCurrent(config),
    getOffline: createGetOffline(config),
    deleteOffline: createDeleteOffline(config),
    withSession: createWithSession(config),
  };
}
