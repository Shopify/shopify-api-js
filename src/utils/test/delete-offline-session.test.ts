import '../../test/test_helper';

import deleteOfflineSession from '../delete-offline-session';
import Session from '../../auth/session/';
import OAuth from '../../auth/oauth';
import { Context } from '../../context';
import loadOfflineSession from '../load-offline-session';

describe('deleteOfflineSession', () => {
  const shop = 'some-shop.myshopify.com';
  const offlineId = OAuth.getOfflineSessionId(shop);

  beforeEach(() => {
    const offlineSession = new Session.Session(offlineId);
    Context.storeSession(offlineSession);
  });

  it('deletes offline sessions by shop', async () => {
    await expect(deleteOfflineSession(shop)).resolves.toBe(true);
    await expect(loadOfflineSession(shop)).resolves.toBeUndefined();
  });
});
