import {createAndSaveDummySession, shopify} from '../../__tests__/test-helper';
import {createGetOfflineId} from '../session-utils';

describe('deleteOfflineSession', () => {
  const shop = 'some-shop.myshopify.com';

  beforeEach(async () => {
    await createAndSaveDummySession({
      sessionId: createGetOfflineId(shopify.config)(shop),
      isOnline: false,
    });
  });

  it('deletes offline sessions by shop', async () => {
    await expect(shopify.session.deleteOffline({shop})).resolves.toBe(true);
    await expect(shopify.session.getOffline({shop})).resolves.toBeUndefined();
    await expect(shopify.session.deleteOffline({shop})).resolves.toBe(true);
  });
});
