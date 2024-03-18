import {ValidationErrorReason, ValidationInvalid} from '../utils/types';
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
  subTopic?: string,
  context?: any,
) => Promise<void>;

interface BaseWebhookHandler {
  id?: string;
  includeFields?: string[];
  metafieldNamespaces?: string[];
  subTopic?: string;
  context?: any;
}

export interface HttpWebhookHandler extends BaseWebhookHandler {
  deliveryMethod: DeliveryMethod.Http;
  callbackUrl: string;
}
export interface HttpWebhookHandlerWithCallback extends HttpWebhookHandler {
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
  | HttpWebhookHandlerWithCallback
  | EventBridgeWebhookHandler
  | PubSubWebhookHandler;

// See https://shopify.dev/docs/api/admin-graphql/latest/enums/webhooksubscriptiontopic for available topics
export type WebhookRegistry<Handler extends WebhookHandler = WebhookHandler> =
  Record<string, Handler[]>;

// eslint-disable-next-line no-warning-comments
// TODO Rethink the wording for this enum - the operations we're doing are actually "subscribing" and "unsubscribing"
// Consider changing the values when releasing v9.0.0 when it can be safely deprecated
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
  operation: WebhookOperation;
}

export type RegisterReturn = Record<string, RegisterResult[]>;

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
  } & T;
}

export interface WebhookCheckResponse<T = WebhookCheckResponseNode> {
  webhookSubscriptions: {
    edges: T[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
}

export type AddHandlersParams = Record<
  string,
  WebhookHandler | WebhookHandler[]
>;

export interface WebhookProcessParams extends AdapterArgs {
  rawBody: string;
  context?: any;
}

export interface WebhookValidateParams extends WebhookProcessParams {}

export const WebhookValidationErrorReason = {
  ...ValidationErrorReason,
  MissingHeaders: 'missing_headers',
} as const;

export type WebhookValidationErrorReasonType =
  (typeof WebhookValidationErrorReason)[keyof typeof WebhookValidationErrorReason];

export interface WebhookFields {
  webhookId: string;
  apiVersion: string;
  domain: string;
  hmac: string;
  topic: string;
  subTopic?: string;
}

export interface WebhookValidationInvalid
  extends Omit<ValidationInvalid, 'reason'> {
  valid: false;
  reason: WebhookValidationErrorReasonType;
}

export interface WebhookValidationMissingHeaders
  extends WebhookValidationInvalid {
  reason: typeof WebhookValidationErrorReason.MissingHeaders;
  missingHeaders: string[];
}

export interface WebhookValidationValid extends WebhookFields {
  valid: true;
}

export type WebhookValidation =
  | WebhookValidationValid
  | WebhookValidationInvalid
  | WebhookValidationMissingHeaders;
