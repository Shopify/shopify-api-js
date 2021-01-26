import validateHmac from './hmac-validator';
import validateShop from './shop-validator';
import safeCompare from './safe-compare';
import loadCurrentSession from './load-current-session';
import loadOfflineSession from './load-offline-session';
import deleteCurrentSession from './delete-current-session';
import deleteOfflineSession from './delete-offline-session';
import storeSession from './store-session';
import decodeSessionToken from './decode-session-token';
import nonce from './nonce';

const ShopifyUtils = {
  validateHmac,
  validateShop,
  safeCompare,
  loadCurrentSession,
  loadOfflineSession,
  deleteCurrentSession,
  deleteOfflineSession,
  storeSession,
  decodeSessionToken,
  nonce,
};

export default ShopifyUtils;
