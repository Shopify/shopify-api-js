import {ConfigInterface} from '../base-types';

import {begin, callback} from './oauth/oauth';
import {nonce} from './oauth/nonce';
import {safeCompare} from './oauth/safe-compare';
import {getEmbeddedAppUrl, buildEmbeddedAppUrl} from './get-embedded-app-url';

export function shopifyAuth(config: ConfigInterface) {
  return {
    begin: begin(config),
    callback: callback(config),
    nonce,
    safeCompare,
    getEmbeddedAppUrl: getEmbeddedAppUrl(config),
    buildEmbeddedAppUrl: buildEmbeddedAppUrl(config),
  };
}

export type ShopifyAuth = ReturnType<typeof shopifyAuth>;
