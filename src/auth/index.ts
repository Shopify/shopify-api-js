import {ConfigInterface} from '../base-types';

import {createBegin, createCallback} from './oauth/oauth';
import {nonce} from './oauth/nonce';
import {safeCompare} from './oauth/safe-compare';
import {
  createGetEmbeddedAppUrl,
  createBuildEmbeddedAppUrl,
} from './get-embedded-app-url';

export function shopifyAuth(config: ConfigInterface) {
  return {
    begin: createBegin(config),
    callback: createCallback(config),
    nonce,
    safeCompare,
    getEmbeddedAppUrl: createGetEmbeddedAppUrl(config),
    buildEmbeddedAppUrl: createBuildEmbeddedAppUrl(config),
  };
}
