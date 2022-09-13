import type {shopifyWebhooks} from '.';

export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
  PubSub = 'pubsub',
}

type WebhookHandlerFunction = (
  topic: string,
  shop_domain: string,
  body: string,
) => Promise<void>;

export interface RegisterParams {
  // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics
  topic: string;
  path: string;
  shop: string;
  accessToken: string;
  deliveryMethod?: DeliveryMethod;
}

export interface ShortenedRegisterParams {
  // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics
  shop: string;
  accessToken: string;
  deliveryMethod?: DeliveryMethod;
}

export interface RegisterReturn {
  [topic: string]: {
    success: boolean;
    result: unknown;
  };
}

export interface WebhookRegistryEntry {
  path: string;
  webhookHandler: WebhookHandlerFunction;
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

export interface AddHandlersProps {
  [topic: string]: WebhookRegistryEntry;
}

export interface AddHandlerParams {
  topic: string;
  registryEntry: WebhookRegistryEntry;
}

export interface GetHandlerParams {
  topic: string;
}

export type ShopifyWebhooks = ReturnType<typeof shopifyWebhooks>;
