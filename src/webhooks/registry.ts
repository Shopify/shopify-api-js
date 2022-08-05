import {createHmac} from 'crypto';
import http from 'http';

import {StatusCode} from '@shopify/network';

import {GraphqlClient} from '../clients/graphql/graphql_client';
import {ShopifyHeader} from '../base-types';
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

interface AddHandlersProps {
  [topic: string]: WebhookRegistryEntry;
}

interface RegistryInterface {
  webhookRegistry: {[topic: string]: WebhookRegistryEntry};

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
  process(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ): Promise<void>;

  /**
   * Confirms that the given path is a webhook path
   *
   * @param string path component of a URI
   */
  isWebhookPath(path: string): boolean;
}

function isSuccess(
  result: any,
  deliveryMethod: DeliveryMethod,
  webhookId?: string,
): boolean {
  let endpoint;
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      endpoint = 'webhookSubscription';
      break;
    case DeliveryMethod.EventBridge:
      endpoint = 'eventBridgeWebhookSubscription';
      break;
    case DeliveryMethod.PubSub:
      endpoint = 'pubSubWebhookSubscription';
      break;
    default:
      return false;
  }
  endpoint += webhookId ? 'Update' : 'Create';
  return Boolean(
    result.data &&
      result.data[endpoint] &&
      result.data[endpoint].webhookSubscription,
  );
}

function validateDeliveryMethod(_deliveryMethod: DeliveryMethod) {
  return true;
}

function buildCheckQuery(topic: string): string {
  return `{
    webhookSubscriptions(first: 1, topics: ${topic}) {
      edges {
        node {
          id
          endpoint {
            __typename
            ... on WebhookHttpEndpoint {
              callbackUrl
            }
            ... on WebhookEventBridgeEndpoint {
              arn
            }
            ... on WebhookPubSubEndpoint {
              pubSubProject
              pubSubTopic
            }
          }
        }
      }
    }
  }`;
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

    for (const topic of topics) {
      const handler = WebhooksRegistry.getHandler(topic);
      if (handler) {
        const {path} = handler;
        const webhook: RegisterOptions = {
          path,
          topic,
          accessToken,
          shop,
          deliveryMethod,
        };
        const returnedRegister = await WebhooksRegistry.register(webhook);
        registerReturn = {...registerReturn, ...returnedRegister};
      }
    }
    return registerReturn;
  },

  async process(
    request: http.IncomingMessage,
    response: http.ServerResponse,
  ): Promise<void> {
    let reqBody = '';

    const promise: Promise<void> = new Promise((resolve, reject) => {
      request.on('data', (chunk) => {
        reqBody += chunk;
      });

      request.on('end', async () => {
        if (!reqBody.length) {
          response.writeHead(StatusCode.BadRequest);
          response.end();
          return reject(
            new ShopifyErrors.InvalidWebhookError(
              'No body was received when processing webhook',
            ),
          );
        }

        let hmac: string | string[] | undefined;
        let topic: string | string[] | undefined;
        let domain: string | string[] | undefined;
        Object.entries(request.headers).map(([header, value]) => {
          switch (header.toLowerCase()) {
            case ShopifyHeader.Hmac.toLowerCase():
              hmac = value;
              break;
            case ShopifyHeader.Topic.toLowerCase():
              topic = value;
              break;
            case ShopifyHeader.Domain.toLowerCase():
              domain = value;
              break;
          }
        });

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
          response.writeHead(StatusCode.BadRequest);
          response.end();
          return reject(
            new ShopifyErrors.InvalidWebhookError(
              `Missing one or more of the required HTTP headers to process webhooks: [${missingHeaders.join(
                ', ',
              )}]`,
            ),
          );
        }

        let statusCode: StatusCode | undefined;
        let responseError: Error | undefined;
        const headers = {};

        const generatedHash = createHmac('sha256', Context.API_SECRET_KEY)
          .update(reqBody, 'utf8')
          .digest('base64');

        if (ShopifyUtilities.safeCompare(generatedHash, hmac as string)) {
          const graphqlTopic = (topic as string)
            .toUpperCase()
            .replace(/\//g, '_');
          const webhookEntry = WebhooksRegistry.getHandler(graphqlTopic);

          if (webhookEntry) {
            try {
              await webhookEntry.webhookHandler(
                graphqlTopic,
                domain as string,
                reqBody,
              );
              statusCode = StatusCode.Ok;
            } catch (error) {
              statusCode = StatusCode.InternalServerError;
              responseError = error;
            }
          } else {
            statusCode = StatusCode.NotFound;
            responseError = new ShopifyErrors.InvalidWebhookError(
              `No webhook is registered for topic ${topic}`,
            );
          }
        } else {
          statusCode = StatusCode.Unauthorized;
          responseError = new ShopifyErrors.InvalidWebhookError(
            `Could not validate request for topic ${topic}`,
          );
        }

        response.writeHead(statusCode, headers);
        response.end();
        if (responseError) {
          return reject(responseError);
        } else {
          return resolve();
        }
      });
    });

    return promise;
  },

  isWebhookPath(path: string): boolean {
    for (const key in WebhooksRegistry.webhookRegistry) {
      if (WebhooksRegistry.webhookRegistry[key].path === path) {
        return true;
      }
    }
    return false;
  },
};

export {
  WebhooksRegistry,
  RegistryInterface,
  buildCheckQuery,
  buildQuery,
  gdprTopics,
};
