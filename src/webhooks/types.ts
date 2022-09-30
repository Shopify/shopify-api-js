import {AdapterArgs} from '../runtime';

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

export interface ShortenedRegisterParams {
  path: string;
  shop: string;
  accessToken: string;
}

export interface RegisterParams extends ShortenedRegisterParams {
  // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics
  topic: string;
  deliveryMethod?: DeliveryMethod;
}

export interface RegisterReturn {
  [topic: string]: {
    success: boolean;
    result: unknown;
  };
}

interface WebhookCheckResponseNode<
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
  } & T;
}

export interface WebhookCheckResponse<T = WebhookCheckResponseNode> {
  data: {
    webhookSubscriptions: {
      edges: T[];
    };
  };
}

export interface BuildCheckQueryParams {
  topic: string;
}

export interface BuildQueryParams {
  topic: string;
  address: string;
  deliveryMethod: DeliveryMethod;
  webhookId?: string;
}

export interface AddHandlerParams {
  topic: string;
  handler: WebhookHandlerFunction;
}

export interface WebhookProcessParams extends AdapterArgs {
  rawBody: string;
}

export type ShopifyWebhooks = ReturnType<typeof shopifyWebhooks>;
