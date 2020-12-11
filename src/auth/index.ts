import ShopifyOAuth from './oauth';
import * as Session from './session';

const ShopifyAuth = {
  OAuth: ShopifyOAuth, // Not entirely satisfied with this as we can't export more objects from the oauth module
  Session: Session,
};

export default ShopifyAuth;
