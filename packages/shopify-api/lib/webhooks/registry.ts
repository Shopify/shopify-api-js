import {InvalidDeliveryMethodError} from '../error';
import {ConfigInterface} from '../base-types';
import {logger} from '../logger';

import {
  AddHandlersParams,
  DeliveryMethod,
  WebhookHandler,
  WebhookRegistry,
} from './types';

export function registry(): WebhookRegistry {
  return {};
}

export function topicForStorage(topic: string): string {
  return topic.toUpperCase().replace(/\/|\./g, '_');
}

export function addHandlers(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry,
) {
  return function addHandlers(handlersToAdd: AddHandlersParams) {
    for (const [topic, handlers] of Object.entries(handlersToAdd)) {
      const topicKey = topicForStorage(topic);

      if (Array.isArray(handlers)) {
        for (const handler of handlers) {
          mergeOrAddHandler(config, webhookRegistry, topicKey, handler);
        }
      } else {
        mergeOrAddHandler(config, webhookRegistry, topicKey, handlers);
      }
    }
  };
}

export function getTopicsAdded(webhookRegistry: WebhookRegistry) {
  return function getTopicsAdded(): string[] {
    return Object.keys(webhookRegistry);
  };
}

export function getHandlers(webhookRegistry: WebhookRegistry) {
  return function getHandlers(topic: string): WebhookHandler[] {
    return webhookRegistry[topicForStorage(topic)] || [];
  };
}

export function handlerIdentifier(
  config: ConfigInterface,
  handler: WebhookHandler,
): string {
  const prefix = handler.deliveryMethod;

  switch (handler.deliveryMethod) {
    case DeliveryMethod.Http:
      return `${prefix}_${addHostToCallbackUrl(config, handler.callbackUrl)}`;
    case DeliveryMethod.EventBridge:
      return `${prefix}_${handler.arn}`;
    case DeliveryMethod.PubSub:
      return `${prefix}_${handler.pubSubProject}:${handler.pubSubTopic}`;
    default:
      throw new InvalidDeliveryMethodError(
        `Unrecognized delivery method '${(handler as any).deliveryMethod}'`,
      );
  }
}

export function addHostToCallbackUrl(
  config: ConfigInterface,
  callbackUrl: string,
): string {
  if (callbackUrl.startsWith('/')) {
    return `${config.hostScheme}://${config.hostName}${callbackUrl}`;
  } else {
    return callbackUrl;
  }
}

function mergeOrAddHandler(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry,
  topic: string,
  handler: WebhookHandler,
) {
  const log = logger(config);

  handler.includeFields?.sort();
  handler.metafieldNamespaces?.sort();

  if (!(topic in webhookRegistry)) {
    webhookRegistry[topic] = [handler];
    return;
  }

  const identifier = handlerIdentifier(config, handler);

  for (const index in webhookRegistry[topic]) {
    if (!Object.prototype.hasOwnProperty.call(webhookRegistry[topic], index)) {
      continue;
    }

    const existingHandler = webhookRegistry[topic][index];
    const existingIdentifier = handlerIdentifier(config, existingHandler);

    if (identifier !== existingIdentifier) {
      continue;
    }

    if (handler.deliveryMethod === DeliveryMethod.Http) {
      log.info(
        `Detected multiple handlers for '${topic}', webhooks.process will call them sequentially`,
      );
      break;
    } else {
      throw new InvalidDeliveryMethodError(
        `Can only add multiple handlers for a topic when deliveryMethod is Http. Please be sure that you used addHandler method once after creating ShopifyApi instance in your app.  Invalid handler: ${JSON.stringify(
          handler,
        )}`,
      );
    }
  }

  webhookRegistry[topic].push(handler);
}
