import {AdapterArgs} from '../../runtime';

import type {shopifyWebhooks} from '.';

export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
  PubSub = 'pubsub',
}

export type WebhookHandlerFunction = (
  topic: string,
  shop_domain: string,
  body: string,
) => Promise<void>;

interface BaseWebhookHandler {
  id?: string;
  includeFields?: string[];
  metafieldNamespaces?: string[];
}

export interface HttpWebhookHandler extends BaseWebhookHandler {
  deliveryMethod: DeliveryMethod.Http;
  privateMetafieldNamespaces?: string[];
  callbackUrl: string;
  callback: WebhookHandlerFunction;
}

export interface EventBridgeWebhookHandler extends BaseWebhookHandler {
  deliveryMethod: DeliveryMethod.EventBridge;
  arn: string;
}

export interface PubSubWebhookHandler extends BaseWebhookHandler {
  deliveryMethod: DeliveryMethod.PubSub;
  pubSubProject: string;
  pubSubTopic: string;
}

export type WebhookHandler =
  | HttpWebhookHandler
  | EventBridgeWebhookHandler
  | PubSubWebhookHandler;

export interface WebhookRegistry {
  // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics
  [topic: string]: WebhookHandler[];
}

export enum WebhookOperation {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export interface RegisterResult {
  success: boolean;
  deliveryMethod: DeliveryMethod;
  result: unknown;
}

export interface RegisterReturn {
  [topic: string]: RegisterResult[];
}

export interface WebhookCheckResponseNode<
  T = {
    endpoint:
      | {
          __typename: 'WebhookHttpEndpoint';
          callbackUrl: string;
        }
      | {
          __typename: 'WebhookEventBridgeEndpoint';
          arn: string;
        }
      | {
          __typename: 'WebhookPubSubEndpoint';
          pubSubProject: string;
          pubSubTopic: string;
        };
  },
> {
  node: {
    id: string;
    topic: string;
    includeFields: string[];
    metafieldNamespaces: string[];
    privateMetafieldNamespaces: string[];
  } & T;
}

export interface WebhookCheckResponse<T = WebhookCheckResponseNode> {
  data: {
    webhookSubscriptions: {
      edges: T[];
      pageInfo: {
        endCursor: string;
        hasNextPage: boolean;
      };
    };
  };
}

export interface AddHandlersParams {
  [topic: string]: WebhookHandler | WebhookHandler[];
}

export interface WebhookProcessParams extends AdapterArgs {
  rawBody: string;
}

export type ShopifyWebhooks = ReturnType<typeof shopifyWebhooks>;
