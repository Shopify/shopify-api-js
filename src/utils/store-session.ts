import {config, throwIfConfigNotSet} from '../config';
import {Session} from '../auth/session';

/**
 * Stores the current user's session.
 *
 * @param Session Session object
 */
export default async function storeSession(session: Session): Promise<boolean> {
  throwIfConfigNotSet();

  return config.sessionStorage.storeSession(session);
}
