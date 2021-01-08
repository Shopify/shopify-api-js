import {createHmac} from 'crypto';

import {StatusCode} from '@shopify/network';

import {GraphqlClient} from '../clients/graphql/graphql_client';
import {ShopifyHeader, ApiVersion} from '../types';
import ShopifyUtilities from '../utils';
import {Context} from '../context';
import * as ShopifyErrors from '../error';

export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
}

export type WebhookHandlerFunction = (
  topic: string,
  shop_domain: string,
  body: Buffer
) => void;

export interface RegisterOptions {

  /** See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics */
  topic: string;
  path: string;
  shop: string;
  accessToken: string;
  apiVersion: ApiVersion;
  deliveryMethod?: DeliveryMethod;
  webhookHandler: WebhookHandlerFunction;
}

export interface RegisterReturn {
  success: boolean;
  result: unknown;
}

interface WebhookRegistryEntry {
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

interface RegistryInterface {
  webhookRegistry: WebhookRegistryEntry[];

  /**
   * Registers a Webhook Handler function for a given topic.
   *
   * @param options Parameters to register a handler, including topic, listening address, handler function
   */
  register(options: RegisterOptions): Promise<RegisterReturn>;

  /**
   * Processes the webhook request received from the Shopify API
   *
   * @param options Parameters required to process a webhook message, including headers and message body
   */
  process(options: ProcessOptions): ProcessReturn;

  /**
   * Confirms that the given path is a webhook path
   *
   * @param string path component of a URI
   */
  isWebhookPath(path: string): boolean;
}

function isSuccess(result: any, deliveryMethod: DeliveryMethod): boolean {
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      return Boolean(
        result.data &&
          result.data.webhookSubscriptionCreate &&
          result.data.webhookSubscriptionCreate.webhookSubscription,
      );
    case DeliveryMethod.EventBridge:
      return Boolean(
        result.data &&
          result.data.eventBridgeWebhookSubscriptionCreate &&
          result.data.eventBridgeWebhookSubscriptionCreate.webhookSubscription,
      );
    default:
      return false;
  }
}

function buildQuery(
  topic: string,
  path: string,
  deliveryMethod: DeliveryMethod,
): string {
  const address = `https://${Context.HOST_NAME}${path}`;
  let mutationName: string;
  let webhookSubscriptionArgs: string;
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      mutationName = 'webhookSubscriptionCreate';
      webhookSubscriptionArgs = `{callbackUrl: "${address}"}`;
      break;
    case DeliveryMethod.EventBridge:
      mutationName = 'eventBridgeWebhookSubscriptionCreate';
      webhookSubscriptionArgs = `{arn: "${address}"}`;
      break;
  }
  return `
    mutation webhookSubscriptionCreate {
      ${mutationName}(topic: ${topic}, webhookSubscription: ${webhookSubscriptionArgs}) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;
}

const WebhooksRegistry: RegistryInterface = {
  webhookRegistry: [],

  async register({
    path,
    topic,
    accessToken,
    shop,
    deliveryMethod = DeliveryMethod.Http,
    webhookHandler,
  }: RegisterOptions): Promise<RegisterReturn> {
    const client = new GraphqlClient(shop, accessToken);
    const result = await client.query({
      data: buildQuery(topic, path, deliveryMethod),
    });

    const success = isSuccess(result.body, deliveryMethod);
    if (success) {
      this.webhookRegistry.push({path, topic, webhookHandler});
    }
    return {success, result: result.body};
  },

  process({headers, body}: ProcessOptions): ProcessReturn {
    let hmac: string | undefined;
    let topic: string | undefined;
    let domain: string | undefined;
    for (const header in headers) {
      if (header) {
        switch (header.toLowerCase()) {
          case ShopifyHeader.Hmac.toLowerCase():
            hmac = headers[header];
            break;
          case ShopifyHeader.Topic.toLowerCase():
            topic = headers[header];
            break;
          case ShopifyHeader.Domain.toLowerCase():
            domain = headers[header];
            break;
        }
      }
    }

    const missingHeaders = [];
    if (!hmac) {
      missingHeaders.push(ShopifyHeader.Hmac);
    }
    if (!topic) {
      missingHeaders.push(ShopifyHeader.Topic);
    }
    if (!domain) {
      missingHeaders.push(ShopifyHeader.Domain);
    }

    if (missingHeaders.length) {
      throw new ShopifyErrors.InvalidWebhookError(
        `Missing one or more of the required HTTP headers to process webhooks: [${missingHeaders.join(
          ', ',
        )}]`,
      );
    }

    const result: ProcessReturn = {
      statusCode: StatusCode.Forbidden,
      headers: {},
    };

    const generatedHash = createHmac('sha256', Context.API_SECRET_KEY)
      .update(body.toString('utf-8'), 'utf8')
      .digest('base64');

    if (ShopifyUtilities.safeCompare(generatedHash, hmac as string)) {
      const graphqlTopic = (topic as string).toUpperCase().replace(/\//g, '_');
      const webhookEntry = this.webhookRegistry.find(
        (entry) => entry.topic === graphqlTopic,
      );

      if (webhookEntry) {
        webhookEntry.webhookHandler(graphqlTopic, domain as string, body);
        result.statusCode = StatusCode.Ok;
        result.headers = {};
      }
    }
    return result;
  },

  isWebhookPath(path: string): boolean {
    return Boolean(this.webhookRegistry.find((entry) => entry.path === path));
  },
};

export {WebhooksRegistry, RegistryInterface};
