import {ConfigInterface} from '../base-types';

import {addHandlers, getTopicsAdded, getHandlers, registry} from './registry';
import {register} from './register';
import {process} from './process';
import {validate} from './validate';

export function shopifyWebhooks(config: ConfigInterface) {
  const webhookRegistry = registry();

  return {
    addHandlers: addHandlers(config, webhookRegistry),
    getTopicsAdded: getTopicsAdded(webhookRegistry),
    getHandlers: getHandlers(webhookRegistry),
    register: register(config, webhookRegistry),
    process: process(config, webhookRegistry),
    validate: validate(config),
  };
}

export type ShopifyWebhooks = ReturnType<typeof shopifyWebhooks>;
