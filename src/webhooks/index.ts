import {ConfigInterface} from '../base-types';

import {
  addHttpHandler,
  addHttpHandlers,
  createProcess,
  createRegister,
  createRegisterAll,
  getHttpHandler,
  getTopics,
} from './registry';

export function shopifyWebhooks(config: ConfigInterface) {
  return {
    addHttpHandler,
    addHttpHandlers,
    getHttpHandler,
    getTopics,
    process: createProcess(config),
    register: createRegister(config),
    registerAll: createRegisterAll(config),
  };
}
