import {ConfigInterface} from '../base-types';

import {
  addHttpHandler,
  addHttpHandlers,
  createProcess,
  createRegister,
  createRegisterAllHttp,
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
    registerAllHttp: createRegisterAllHttp(config),
  };
}
