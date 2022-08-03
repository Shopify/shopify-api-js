import {Context} from '../../context';
import loadOfflineSession from '../load-offline-session';
import {Session} from '../../auth/session/session';
import OAuth from '../../auth/oauth';

describe('loadOfflineSession', () => {
  const shop = 'some-shop.myshopify.com';

  it('returns undefined if no session is found', async () => {
    await expect(loadOfflineSession(shop)).resolves.toBeUndefined();
  });

  it('loads offline sessions by shop', async () => {
    const offlineId = OAuth.getOfflineSessionId(shop);
    const offlineSession = new Session(offlineId, shop, 'state', false);
    Context.SESSION_STORAGE.storeSession(offlineSession);

    expect(await loadOfflineSession(shop)).toBe(offlineSession);
  });

  it('returns undefined for expired sessions by default', async () => {
    const offlineId = OAuth.getOfflineSessionId(shop);
    const offlineSession = new Session(offlineId, shop, 'state', false);
    offlineSession.expires = new Date('2020-01-01');
    Context.SESSION_STORAGE.storeSession(offlineSession);

    await expect(loadOfflineSession(shop)).resolves.toBeUndefined();
  });

  it('returns expired sessions when includeExpired is true', async () => {
    const offlineId = OAuth.getOfflineSessionId(shop);
    const offlineSession = new Session(offlineId, shop, 'state', false);
    offlineSession.expires = new Date('2020-01-01');
    Context.SESSION_STORAGE.storeSession(offlineSession);

    await expect(loadOfflineSession(shop, true)).resolves.toBe(offlineSession);
  });
});
