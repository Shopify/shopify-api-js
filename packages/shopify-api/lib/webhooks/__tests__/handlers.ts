import {
  DeliveryMethod,
  EventBridgeWebhookHandler,
  HttpWebhookHandler,
  HttpWebhookHandlerWithCallback,
  PubSubWebhookHandler,
} from '../types';

export const HTTP_HANDLER: HttpWebhookHandlerWithCallback = {
  deliveryMethod: DeliveryMethod.Http,
  callbackUrl: '/webhooks',
  callback: jest.fn(),
};

export const HTTP_HANDLER_WITH_SUBTOPIC: HttpWebhookHandlerWithCallback = {
  deliveryMethod: DeliveryMethod.Http,
  callbackUrl: '/webhooks',
  callback: jest.fn(),
  subTopic: 'example:topic',
};

export const HTTP_HANDLER_WITHOUT_CALLBACK: HttpWebhookHandler = {
  deliveryMethod: DeliveryMethod.Http,
  callbackUrl: '/webhooks',
};

export const EVENT_BRIDGE_HANDLER: EventBridgeWebhookHandler = {
  deliveryMethod: DeliveryMethod.EventBridge,
  arn: 'arn:test',
};

export const PUB_SUB_HANDLER: PubSubWebhookHandler = {
  deliveryMethod: DeliveryMethod.PubSub,
  pubSubProject: 'my-project-id',
  pubSubTopic: 'my-topic-id',
};
