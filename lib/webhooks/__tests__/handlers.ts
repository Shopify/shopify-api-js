import {
  DeliveryMethod,
  HttpWebhookHandler,
  EventBridgeWebhookHandler,
  PubSubWebhookHandler,
} from '../types';

export const HTTP_HANDLER: HttpWebhookHandler = {
  deliveryMethod: DeliveryMethod.Http,
  callbackUrl: '/webhooks',
  handler: jest.fn(),
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
