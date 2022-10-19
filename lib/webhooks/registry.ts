import {InvalidDeliveryMethodError} from '../error';
import {ConfigInterface, LogSeverity} from '../base-types';

import {
  AddHandlersParams,
  DeliveryMethod,
  HttpWebhookHandler,
  WebhookHandler,
  WebhookRegistry,
} from './types';

export function createRegistry(): WebhookRegistry {
  return {};
}

export function topicForStorage(topic: string): string {
  return topic.toUpperCase().replace(/\//g, '_');
}

export function createAddHandlers(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry,
) {
  return function addHandlers(handlersToAdd: AddHandlersParams) {
    Object.entries(handlersToAdd).forEach(([topic, handlers]) => {
      const topicKey = topicForStorage(topic);

      if (Array.isArray(handlers)) {
        for (const handler of handlers) {
          mergeOrAddHandler(config, webhookRegistry, topicKey, handler);
        }
      } else {
        mergeOrAddHandler(config, webhookRegistry, topicKey, handlers);
      }
    });
  };
}

export function createGetTopicsAdded(webhookRegistry: WebhookRegistry) {
  return function getTopicsAdded(): string[] {
    return Object.keys(webhookRegistry);
  };
}

export function createGetHandlers(webhookRegistry: WebhookRegistry) {
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
  if (!(topic in webhookRegistry)) {
    webhookRegistry[topic] = [handler];
    return;
  }

  const identifier = handlerIdentifier(config, handler);

  let merged = false;
  for (const index in webhookRegistry[topic]) {
    if (!Object.prototype.hasOwnProperty.call(webhookRegistry[topic], index)) {
      continue;
    }

    const existingHandler = webhookRegistry[topic][index];
    const existingIdentifier = handlerIdentifier(config, existingHandler);

    if (identifier !== existingIdentifier) {
      continue;
    }

    // We can merge HTTP handlers because we'll just chain the calls locally. We log this to inform callers that it's
    // happening.
    if (handler.deliveryMethod === DeliveryMethod.Http) {
      config.logFunction(
        LogSeverity.Info,
        `Detected multiple handlers for '${topic}', webhooks.process will call them sequentially`,
      );

      const currentHandler = (existingHandler as HttpWebhookHandler).handler;
      const newHandler = handler.handler;
      handler.handler = async (topic, shop, body) => {
        await currentHandler(topic, shop, body);
        await newHandler(topic, shop, body);
      };

      webhookRegistry[topic][index] = handler;
      merged = true;
      break;
    } else {
      throw new InvalidDeliveryMethodError(
        `Can only add multiple handlers when deliveryMethod is Http. Invalid handler: ${JSON.stringify(
          handler,
        )}`,
      );
    }
  }

  if (!merged) {
    webhookRegistry[topic].push(handler);
  }
}
