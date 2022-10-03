import {ConfigInterface} from '../base-types';

import {HttpWebhookRegistry} from './types';
import {
  createAddHttpHandler,
  createAddHttpHandlers,
  createGetHttpHandler,
  createGetTopicsAdded,
  createHttpWebhookRegistryKeys,
  createProcess,
  createRegister,
  createRegisterAllHttp,
  createResetHttpWebhookRegistry,
  createTopicInHttpWebhookRegistry,
} from './registry';

export function shopifyWebhooks(config: ConfigInterface) {
  const httpWebhookRegistry: HttpWebhookRegistry = {};

  return {
    addHttpHandler: createAddHttpHandler(httpWebhookRegistry),
    addHttpHandlers: createAddHttpHandlers(httpWebhookRegistry),
    getHttpHandler: createGetHttpHandler(httpWebhookRegistry),
    getTopicsAdded: createGetTopicsAdded(httpWebhookRegistry),
    process: createProcess(config, httpWebhookRegistry),
    register: createRegister(config),
    registerAllHttp: createRegisterAllHttp(config, httpWebhookRegistry),
    testing: {
      topicInHttpWebhookRegistry:
        createTopicInHttpWebhookRegistry(httpWebhookRegistry),
      httpWebhookRegistryKeys:
        createHttpWebhookRegistryKeys(httpWebhookRegistry),
      resetHttpWebhookRegistry:
        createResetHttpWebhookRegistry(httpWebhookRegistry),
    },
  };
}
