// import fetch from 'node-fetch';
import { StatusCode } from '@shopify/network';
import { DataType, HttpClient } from '../clients/http_client';
import { ShopifyHeader, ApiVersion } from '../types';
import { Topic } from './types';
import { createHmac } from 'crypto';
import ShopifyUtilities from '../utils';
import { Context } from '../context';
import * as ShopifyErrors from '../error';

export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
}

export type webhookHandlerFunction = (topic: string, shop_domain: string, body: Buffer) => void;

export interface RegisterOptions {
  topic: Topic;
  path: string;
  shop: string;
  accessToken: string;
  apiVersion: ApiVersion;
  deliveryMethod?: DeliveryMethod;
  webhookHandler: webhookHandlerFunction;
}

export type RegisterReturn = {
  success: boolean,
  result: unknown
}

type WebhookRegistryEntry = {
  path: string,
  topic: string,
  webhookHandler: webhookHandlerFunction;
}

export interface ProcessOptions {
  headers: Record<string, string>;
  body: Buffer
}

export type ProcessReturn = {
  statusCode: StatusCode,
  headers: Record<string, string>
}

interface RegistryInterface {
  webhookRegistry: WebhookRegistryEntry[],

  /**
   * Registers a Webhook Handler function for a given topic.
   *
   * @param options Parameters to register a handler, including topic, listening address, handler function
   */
  register(options: RegisterOptions): Promise<RegisterReturn>,

  /**
   * Processes the webhook request received from the Shopify API
   *
   * @param options Parameters required to process a webhook message, including headers and message body
   */
  process(options: ProcessOptions): ProcessReturn,

  /**
   * Confirms that the given path is a webhook path
   *
   * @param string path component of a URI
   */
  isWebhookPath(path: string): boolean,
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isSuccess(result: any, deliveryMethod: DeliveryMethod): boolean {
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      return Boolean(
        result.data &&
        result.data.webhookSubscriptionCreate &&
        result.data.webhookSubscriptionCreate.webhookSubscription
      );
    case DeliveryMethod.EventBridge:
      return Boolean(
        result.data &&
        result.data.eventBridgeWebhookSubscriptionCreate &&
        result.data.eventBridgeWebhookSubscriptionCreate.webhookSubscription
      );
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
    apiVersion,
    deliveryMethod = DeliveryMethod.Http,
    webhookHandler
  }: RegisterOptions): Promise<RegisterReturn> {
    // TODO - refactor to use the GraphQL client when it's ready
    const client = new HttpClient(shop);
    const result = await client.post({
      path: `/admin/api/${apiVersion}/graphql.json`,
      type: DataType.GraphQL,
      data: buildQuery(topic, path, deliveryMethod),
      extraHeaders: {
        [ShopifyHeader.AccessToken]: accessToken,
      }
    });

    const success = isSuccess(result.body, deliveryMethod);
    if (success) {
      this.webhookRegistry.push({ path: path, topic: topic, webhookHandler: webhookHandler });
    }
    return { success: success, result: result.body };
  },

  process({ headers, body }: ProcessOptions): ProcessReturn {
    let hmac: string | undefined;
    let topic: string | undefined;
    let domain: string | undefined;
    for (const header in headers) {
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
        `Missing one or more of the required HTTP headers to process webhooks: [${missingHeaders.join(', ')}]`
      );
    }

    const result: ProcessReturn = { statusCode: StatusCode.Forbidden, headers: {} };

    const generatedHash = createHmac('sha256', Context.API_SECRET_KEY)
      .update(body.toString('utf-8'), 'utf8')
      .digest('base64');

    if (ShopifyUtilities.safeCompare(generatedHash, (hmac as string))) {
      const graphqlTopic = (topic as string).toUpperCase().replace(/\//g, '_');
      const webhookEntry = this.webhookRegistry.find(e => e.topic === graphqlTopic);

      if (webhookEntry) {
        webhookEntry.webhookHandler(graphqlTopic, (domain as string), body);
        result.statusCode = StatusCode.Ok
        result.headers = {};
      }
    }
    return result;
  },

  isWebhookPath(path: string): boolean {
    return Boolean(this.webhookRegistry.find(e => e.path === path));
  }
};

export { WebhooksRegistry, RegistryInterface };
