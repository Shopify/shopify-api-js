export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
}

type WebhookHandlerFunction = (
  topic: string,
  shop_domain: string,
  body: string
) => Promise<void>;

export type RegisterOptions = {
  // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics
  topic: string;
  path: string;
  shop: string;
  accessToken: string;
  deliveryMethod?: DeliveryMethod.Http;
  webhookHandler: WebhookHandlerFunction;
} | {
  topic: string;
  path?: string;
  shop: string;
  accessToken: string;
  deliveryMethod: DeliveryMethod.EventBridge;
  webhookHandler: WebhookHandlerFunction;
};

export interface RegisterReturn {
  success: boolean;
  result: unknown;
}

export interface WebhookRegistryEntry {
  path: string;
  topic: string;
  webhookHandler: WebhookHandlerFunction;
}

interface WebhookCheckResponseNode {
  node: {
    id: string;
    endpoint: {
      __typename: 'WebhookHttpEndpoint';
      callbackUrl: string;
    } | {
      __typename: 'WebhookEventBridgeEndpoint';
      arn: string;
    };
  };
}

export interface WebhookCheckResponse {
  data: {
    webhookSubscriptions: {
      edges: WebhookCheckResponseNode[];
    };
  };
}
