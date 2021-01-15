import ShopifyOAuth from './oauth';
import * as Session from './session';

const ShopifyAuth = {
  // Not entirely satisfied with this as we can't export more objects from the oauth module
  OAuth: ShopifyOAuth,
  Session,
};

export default ShopifyAuth;
