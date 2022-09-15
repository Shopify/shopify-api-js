import {ConfigInterface} from '../base-types';

import {
  addHandler,
  addHandlers,
  createProcess,
  createRegister,
  createRegisterAll,
  getHandler,
  getTopics,
  isWebhookPath,
} from './registry';

export function shopifyWebhooks(config: ConfigInterface) {
  return {
    addHandler,
    addHandlers,
    getHandler,
    getTopics,
    isWebhookPath,
    process: createProcess(config),
    register: createRegister(config),
    registerAll: createRegisterAll(config),
  };
}
