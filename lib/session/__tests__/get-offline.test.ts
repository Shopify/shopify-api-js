import {createAndSaveDummySession, shopify} from '../../__tests__/test-helper';
import {createGetOfflineId} from '../session-utils';

describe('createGetOffline', () => {
  const shop = 'some-shop.myshopify.com';

  it('returns undefined if no session is found', async () => {
    await expect(shopify.session.getOffline({shop})).resolves.toBeUndefined();
  });

  it('loads offline sessions by shop', async () => {
    const offlineSession = await createAndSaveDummySession({
      sessionId: createGetOfflineId(shopify.config)(shop),
      isOnline: false,
      shop,
    });

    expect(await shopify.session.getOffline({shop})).toBe(offlineSession);
  });

  it('returns undefined for expired sessions by default', async () => {
    await createAndSaveDummySession({
      sessionId: createGetOfflineId(shopify.config)(shop),
      isOnline: false,
      shop,
      expires: new Date('2020-01-01'),
    });

    await expect(shopify.session.getOffline({shop})).resolves.toBeUndefined();
  });

  it('returns expired sessions when includeExpired is true', async () => {
    const offlineSession = await createAndSaveDummySession({
      sessionId: createGetOfflineId(shopify.config)(shop),
      isOnline: false,
      shop,
      expires: new Date('2020-01-01'),
    });

    await expect(
      shopify.session.getOffline({shop, includeExpired: true}),
    ).resolves.toBe(offlineSession);
  });
});
