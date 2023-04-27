import {AdapterArgs} from '../../runtime/types';
import {Session} from '../session/session';

export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
  PubSub = 'pubsub',
}

export type WebhookHandlerFunction = (
  topic: string,
  shop_domain: string,
  body: string,
  webhookId: string,
  apiVersion?: string,
) => Promise<void>;

interface BaseWebhookHandler {
  id?: string;
  includeFields?: string[];
  metafieldNamespaces?: string[];
}

export interface HttpWebhookHandler extends BaseWebhookHandler {
  deliveryMethod: DeliveryMethod;
  privateMetafieldNamespaces?: string[];
  callbackUrl: string;
  callback: WebhookHandlerFunction;
}

export interface EventBridgeWebhookHandler extends BaseWebhookHandler {
  deliveryMethod: DeliveryMethod;
  arn: string;
}

export interface PubSubWebhookHandler extends BaseWebhookHandler {
  deliveryMethod: DeliveryMethod;
  pubSubProject: string;
  pubSubTopic: string;
}

export type WebhookHandler =
  | HttpWebhookHandler
  | EventBridgeWebhookHandler
  | PubSubWebhookHandler;

export interface WebhookRegistry {
  // See https://shopify.dev/docs/api/admin-graphql/latest/enums/webhooksubscriptiontopic for available topics
  [topic: string]: WebhookHandler[];
}

export enum WebhookOperation {
  Create = 'create',
  Update = 'update',
  Delete = 'delete',
}

export interface RegisterParams {
  session: Session;
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
