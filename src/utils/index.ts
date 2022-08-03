import decodeSessionToken from './decode-session-token';
import deleteCurrentSession from './delete-current-session';
import deleteOfflineSession from './delete-offline-session';
import loadCurrentSession from './load-current-session';
import loadOfflineSession from './load-offline-session';
import nonce from './nonce';
import graphqlProxy from './graphql_proxy';
import safeCompare from './safe-compare';
import storeSession from './store-session';
import validateHmac from './hmac-validator';
import {sanitizeShop, sanitizeHost} from './shop-validator';
import versionCompatible from './version-compatible';
import withSession from './with-session';
import getEmbeddedAppUrl from './get-embedded-app-url';

const ShopifyUtils = {
  decodeSessionToken,
  deleteCurrentSession,
  deleteOfflineSession,
  loadCurrentSession,
  loadOfflineSession,
  nonce,
  graphqlProxy,
  safeCompare,
  storeSession,
  validateHmac,
  sanitizeShop,
  sanitizeHost,
  versionCompatible,
  withSession,
  getEmbeddedAppUrl,
};

export default ShopifyUtils;
