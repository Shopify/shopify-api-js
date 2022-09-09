import {ConfigInterface} from '../base-types';

import {gdprTopics, webhooksRegistry} from './registry';

export function shopifyWebhooks(config: ConfigInterface) {
  return {
    registry: webhooksRegistry(config),
    gdprTopics,
  };
}
