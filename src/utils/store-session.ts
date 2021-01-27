import {Context} from '../context';
import {Session} from '../auth/session';

/**
 * Stores the current user's session.
 *
 * @param Session Session object
 */
export default async function storeSession(session: Session): Promise<boolean> {
  Context.throwIfUninitialized();

  return Context.SESSION_STORAGE.storeSession(session);
}
