export declare enum DeliveryMethod {
    Http = "http",
    EventBridge = "eventbridge",
    PubSub = "pubsub"
}
declare type WebhookHandlerFunction = (topic: string, shop_domain: string, body: string) => Promise<void>;
export interface RegisterOptions {
    topic: string;
    path: string;
    shop: string;
    accessToken: string;
    deliveryMethod?: DeliveryMethod;
}
export interface ShortenedRegisterOptions {
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
interface WebhookCheckResponseNode<T = {
    endpoint: {
        __typename: 'WebhookHttpEndpoint';
        callbackUrl: string;
    } | {
        __typename: 'WebhookEventBridgeEndpoint';
        arn: string;
    } | {
        __typename: 'WebhookPubSubEndpoint';
        pubSubProject: string;
        pubSubTopic: string;
    };
}> {
    node: {
        id: string;
    } & T;
}
declare type WebhookCheckLegacyResponseNode = WebhookCheckResponseNode<{
    callbackUrl: string;
}>;
export interface WebhookCheckResponse<T = WebhookCheckResponseNode> {
    data: {
        webhookSubscriptions: {
            edges: T[];
        };
    };
}
export declare type WebhookCheckResponseLegacy = WebhookCheckResponse<WebhookCheckLegacyResponseNode>;
export {};
//# sourceMappingURL=types.d.ts.map