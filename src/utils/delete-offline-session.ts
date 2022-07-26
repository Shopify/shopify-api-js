import {Context} from '../context';
import OAuth from '../auth/oauth';

import {sanitizeShop} from './shop-validator';

/**
 * Helper method to find and delete offline sessions by shop url.
 *
 * @param shop the shop url to find and delete a session for
 */
export default async function deleteOfflineSession(
  shop: string,
): Promise<boolean> {
  Context.throwIfUninitialized();
  const cleanShop = sanitizeShop(shop, true)!;

  const sessionId = OAuth.getOfflineSessionId(cleanShop);

  return Context.SESSION_STORAGE.deleteSession(sessionId);
}
