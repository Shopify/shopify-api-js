import validateHmac from './hmac-validator';
import validateShop from './shop-validator';
import safeCompare from './safe-compare';
import loadCurrentSession from './load-current-session';
import nonce from './nonce';

const ShopifyUtilities = {
  validateHmac,
  validateShop,
  safeCompare,
  loadCurrentSession,
  nonce,
};

export default ShopifyUtilities;
export { validateHmac, validateShop, safeCompare, loadCurrentSession, nonce };
