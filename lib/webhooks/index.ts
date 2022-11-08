import {ConfigInterface} from '../base-types';

import {
  createAddHandlers,
  createGetTopicsAdded,
  createGetHandlers,
  createRegistry,
} from './registry';
import {createRegister} from './register';
import {createProcess} from './process';

export function shopifyWebhooks(config: ConfigInterface) {
  const webhookRegistry = createRegistry();

  return {
    addHandlers: createAddHandlers(config, webhookRegistry),
    getTopicsAdded: createGetTopicsAdded(webhookRegistry),
    getHandlers: createGetHandlers(webhookRegistry),
    register: createRegister(config, webhookRegistry),
    process: createProcess(config, webhookRegistry),
  };
}

export type ShopifyWebhooks = ReturnType<typeof shopifyWebhooks>;
