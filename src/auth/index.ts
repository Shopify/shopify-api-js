import {ConfigInterface} from '../base-types';

import {createBegin, createCallback} from './oauth/oauth';
import {
  createGetEmbeddedAppUrl,
  createBuildEmbeddedAppUrl,
} from './get-embedded-app-url';

export function shopifyAuth(config: ConfigInterface) {
  return {
    begin: createBegin(config),
    callback: createCallback(config),
    getEmbeddedAppUrl: createGetEmbeddedAppUrl(config),
    buildEmbeddedAppUrl: createBuildEmbeddedAppUrl(config),
  };
}
