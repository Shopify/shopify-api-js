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

export interface RegisterOptions {
  shop: string;
  accessToken: string;
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
  deliveryMethod?: DeliveryMethod;
}

export interface WebhookRegistry {
  // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics
  [topic: string]: WebhookRegistryEntry;
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

type WebhookCheckLegacyResponseNode = WebhookCheckResponseNode<{
  callbackUrl: string;
}>;

export interface WebhookCheckResponse<T = WebhookCheckResponseNode> {
  data: {
    webhookSubscriptions: {
      edges: T[];
    };
  };
}

export type WebhookCheckResponseLegacy =
  WebhookCheckResponse<WebhookCheckLegacyResponseNode>;
