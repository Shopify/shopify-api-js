import { validateHmac } from './hmac-validator';
import validateShop from './shop-validator';
import safeCompare from './safe-compare';

const ShopifyUtilities = {
  validateHmac,
  validateShop,
  safeCompare,
};

export default ShopifyUtilities;
export { validateHmac, validateShop, safeCompare };
