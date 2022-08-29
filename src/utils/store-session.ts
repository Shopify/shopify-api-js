import {SessionInterface} from '../auth/session/types';
import {ConfigInterface} from '../base-types';

export function createStoreSession(config: ConfigInterface) {
  return async (session: SessionInterface): Promise<boolean> => {
    return config.sessionStorage.storeSession(session);
  };
}
