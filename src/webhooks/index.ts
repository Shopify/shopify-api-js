import {ConfigInterface} from '../base-types';

import {
  addHttpHandler,
  addHttpHandlers,
  createProcess,
  createRegister,
  createRegisterAllHttp,
  getHttpHandler,
  getTopicsAdded,
} from './registry';

export function shopifyWebhooks(config: ConfigInterface) {
  return {
    addHttpHandler,
    addHttpHandlers,
    getHttpHandler,
    getTopicsAdded,
    process: createProcess(config),
    register: createRegister(config),
    registerAllHttp: createRegisterAllHttp(config),
  };
}
