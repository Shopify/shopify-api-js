// import fetch from 'node-fetch';
import { StatusCode } from '@shopify/network';
import { GraphqlClient } from '../clients/graphql/graphql_client';
import { ShopifyHeader, ApiVersion } from '../types';
import { createHmac } from 'crypto';
import ShopifyUtilities from '../utils';
import {Context} from '../context';
import * as ShopifyErrors from '../error';

import {
  DeliveryMethod,
  RegisterOptions,
  RegisterReturn,
  WebhookRegistryEntry,
  WebhookCheckResponse,
  ShortenedRegisterOptions,
} from './types';

export type webhookHandlerFunction = (topic: string, shop_domain: string, body: Buffer) => void;

export interface RegisterOptions {
  /** See https://shopify.dev/docs/admin-api/graphql/reference/events/webhooksubscriptiontopic for available topics */
  topic: string;
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
   * @param options Parameters to register a handler, including topic, listening address, delivery method
   */
  register(options: RegisterOptions): Promise<RegisterReturn>;

  /**
   * Registers multiple Webhook Handler functions.
   *
   * @param options Parameters to register a handler, including topic, listening address, delivery method
   */
  register(options: RegisterOptions): Promise<RegisterReturn>,

  /**
   * Processes the webhook request received from the Shopify API
   *
   * @param request HTTP request received from Shopify
   * @param response HTTP response to the request
   */
  process(options: ProcessOptions): ProcessReturn,

  /**
   * Confirms that the given path is a webhook path
   *
   * @param string path component of a URI
   */
  isWebhookPath(path: string): boolean;
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
  address: string,
  deliveryMethod: DeliveryMethod = DeliveryMethod.Http,
  webhookId?: string,
): string {
  validateDeliveryMethod(deliveryMethod);
  let identifier: string;
  if (webhookId) {
    identifier = `id: "${webhookId}"`;
  } else {
    identifier = `topic: ${topic}`;
  }

  let mutationName: string;
  let webhookSubscriptionArgs: string;
  let pubSubProject: string;
  let pubSubTopic: string;
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      mutationName = webhookId
        ? 'webhookSubscriptionUpdate'
        : 'webhookSubscriptionCreate';
      webhookSubscriptionArgs = `{callbackUrl: "${address}"}`;
      break;
    case DeliveryMethod.EventBridge:
      mutationName = webhookId
        ? 'eventBridgeWebhookSubscriptionUpdate'
        : 'eventBridgeWebhookSubscriptionCreate';
      webhookSubscriptionArgs = `{arn: "${address}"}`;
      break;
    case DeliveryMethod.PubSub:
      mutationName = webhookId
        ? 'pubSubWebhookSubscriptionUpdate'
        : 'pubSubWebhookSubscriptionCreate';
      [pubSubProject, pubSubTopic] = address
        .replace(/^pubsub:\/\//, '')
        .split(':');
      webhookSubscriptionArgs = `{pubSubProject: "${pubSubProject}",
                                  pubSubTopic: "${pubSubTopic}"}`;
      break;
  }

  return `
    mutation webhookSubscription {
      ${mutationName}(${identifier}, webhookSubscription: ${webhookSubscriptionArgs}) {
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

const gdprTopics: string[] = [
  'CUSTOMERS_DATA_REQUEST',
  'CUSTOMERS_REDACT',
  'SHOP_REDACT',
];

const WebhooksRegistry: RegistryInterface = {
  webhookRegistry: {},

  addHandler(
    topic: string,
    {path, webhookHandler}: WebhookRegistryEntry,
  ): void {
    WebhooksRegistry.webhookRegistry[topic] = {path, webhookHandler};
  },

  addHandlers(handlers: AddHandlersProps): void {
    for (const topic in handlers) {
      if ({}.hasOwnProperty.call(handlers, topic)) {
        WebhooksRegistry.addHandler(topic, handlers[topic]);
      }
    }
  },

  getHandler(topic: string): WebhookRegistryEntry | null {
    return WebhooksRegistry.webhookRegistry[topic] ?? null;
  },

  getTopics(): string[] {
    return Object.keys(WebhooksRegistry.webhookRegistry);
  },

  async register({
    path,
    topic,
    accessToken,
    shop,
    deliveryMethod = DeliveryMethod.Http,
    webhookHandler
  }: RegisterOptions): Promise<RegisterReturn> {
    const registerReturn: RegisterReturn = {};

    if (gdprTopics.includes(topic)) {
      registerReturn[topic] = {
        success: false,
        result: {
          errors: [
            {
              message: `GDPR topic '${topic}' cannot be registered here. Please set the appropriate webhook endpoint in the 'GDPR mandatory webhooks' section of 'App setup' in the Partners Dashboard`,
            },
          ],
        },
      };

      return registerReturn;
    }

    validateDeliveryMethod(deliveryMethod);
    const client = new GraphqlClient(shop, accessToken);
    const address =
      deliveryMethod === DeliveryMethod.Http
        ? `${Context.HOST_SCHEME}://${Context.HOST_NAME}${path}`
        : path;

    let checkResult;
    try {
      checkResult = await client.query<WebhookCheckResponse>({
        data: buildCheckQuery(topic),
      });
    } catch (error) {
      const result =
        error instanceof ShopifyErrors.GraphqlQueryError ? error.response : {};
      registerReturn[topic] = {success: false, result};
      return registerReturn;
    }

    let webhookId: string | undefined;
    let mustRegister = true;

    if (checkResult.body.data.webhookSubscriptions.edges.length) {
      const {node} = checkResult.body.data.webhookSubscriptions.edges[0];
      let endpointAddress = '';
      if (node.endpoint.__typename === 'WebhookHttpEndpoint') {
        endpointAddress = node.endpoint.callbackUrl;
      } else if (node.endpoint.__typename === 'WebhookEventBridgeEndpoint') {
        endpointAddress = node.endpoint.arn;
      }

      webhookId = node.id;
      if (endpointAddress === address) {
        mustRegister = false;
      }
    }

    if (mustRegister) {
      const result = await client.query({
        data: buildQuery(topic, address, deliveryMethod, webhookId),
      });
      registerReturn[topic] = {
        success: isSuccess(result.body, deliveryMethod, webhookId),
        result: result.body,
      };
    } else {
      registerReturn[topic] = {
        success: true,
        result: {},
      };
    }
    return registerReturn;
  },

  async registerAll({
    accessToken,
    shop,
    deliveryMethod = DeliveryMethod.Http,
  }: ShortenedRegisterOptions): Promise<RegisterReturn> {
    let registerReturn = {};
    const topics = WebhooksRegistry.getTopics();

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
        if (!webhookId) {
          missingHeaders.push(ShopifyHeader.WebhookId);
        }

    if (missingHeaders.length) {
      throw new ShopifyErrors.InvalidWebhookError(
        `Missing one or more of the required HTTP headers to process webhooks: [${missingHeaders.join(', ')}]`
      );
    }

    const result: ProcessReturn = { statusCode: StatusCode.Forbidden, headers: {} };

        const generatedHash = createHmac('sha256', Context.API_SECRET_KEY)
          .update(reqBody, 'utf8')
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
