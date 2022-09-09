import {ConfigInterface} from '../base-types';

import {createBegin, createCallback} from './oauth/oauth';

export function shopifyAuth(config: ConfigInterface) {
  return {
    begin: createBegin(config),
    callback: createCallback(config),
  };
}
