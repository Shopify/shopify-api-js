import {StatusCode} from '@shopify/network';

export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
}

type WebhookHandlerFunction = (
  topic: string,
  shop_domain: string,
  body: Buffer
) => void;

export interface RegisterOptions {
  // See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics
  topic: string;
  path: string;
  shop: string;
  accessToken: string;
  deliveryMethod?: DeliveryMethod;
  webhookHandler: WebhookHandlerFunction;
}

export interface RegisterReturn {
  success: boolean;
  result: unknown;
}

export interface WebhookRegistryEntry {
  path: string;
  topic: string;
  webhookHandler: WebhookHandlerFunction;
}

export interface ProcessOptions {
  headers: Record<string, string>;
  body: Buffer;
}

export interface ProcessReturn {
  statusCode: StatusCode;
  headers: Record<string, string>;
}

interface WebhookCheckResponseNode {
  node: {
    id: string;
    callbackUrl: string;
  };
}

export interface WebhookCheckResponse {
  data: {
    webhookSubscriptions: {
      edges: WebhookCheckResponseNode[];
    };
  };
}
