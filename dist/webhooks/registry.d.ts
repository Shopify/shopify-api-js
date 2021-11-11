/// <reference types="node" />
import http from 'http';
import { DeliveryMethod, RegisterOptions, RegisterReturn, WebhookRegistryEntry, ShortenedRegisterOptions } from './types';
interface AddHandlersProps {
    [topic: string]: WebhookRegistryEntry;
}
interface RegistryInterface {
    webhookRegistry: {
        [topic: string]: WebhookRegistryEntry;
    };
    /**
     * Sets the handler for the given topic. If a handler was previously set for the same topic, it will be overridden.
     *
     * @param topic String used to add a handler
     * @param options Paramters to add a handler which are path and webHookHandler
     */
    addHandler(topic: string, options: WebhookRegistryEntry): void;
    /**
     * Sets a list of handlers for the given topics using the `addHandler` function
     *
     * @param handlers Object in format {topic: WebhookRegistryEntry}
     */
    addHandlers(handlers: AddHandlersProps): void;
    /**
     * Fetches the handler for the given topic. Returns null if no handler was registered.
     *
     * @param topic The topic to check
     */
    getHandler(topic: string): WebhookRegistryEntry | null;
    /**
     * Gets all topics
     */
    getTopics(): string[];
    /**
     * Registers a Webhook Handler function for a given topic.
     *
     * @param options Parameters to register a handler, including topic, listening address, delivery method
     */
    register(options: RegisterOptions): Promise<RegisterReturn>;
    /**
     * Registers multiple Webhook Handler functions.
     *
     * @param options Parameters to register a handler, including topic, listening address, delivery method
     */
    registerAll(options: ShortenedRegisterOptions): Promise<RegisterReturn>;
    /**
     * Processes the webhook request received from the Shopify API
     *
     * @param request HTTP request received from Shopify
     * @param response HTTP response to the request
     */
    process(request: http.IncomingMessage, response: http.ServerResponse): Promise<void>;
    /**
     * Confirms that the given path is a webhook path
     *
     * @param string path component of a URI
     */
    isWebhookPath(path: string): boolean;
}
declare function buildCheckQuery(topic: string): string;
declare function buildQuery(topic: string, address: string, deliveryMethod?: DeliveryMethod, webhookId?: string): string;
declare const WebhooksRegistry: RegistryInterface;
export { WebhooksRegistry, RegistryInterface, buildCheckQuery, buildQuery };
//# sourceMappingURL=registry.d.ts.map