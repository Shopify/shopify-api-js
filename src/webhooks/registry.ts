import {createHmac} from 'crypto';
import http from 'http';

import {StatusCode} from '@shopify/network';

import {GraphqlClient} from '../clients/graphql/graphql_client';
import {ShopifyHeader} from '../base_types';
import ShopifyUtilities from '../utils';
import {Context} from '../context';
import * as ShopifyErrors from '../error';

import {
  DeliveryMethod,
  RegisterOptions,
  RegisterReturn,
  WebhookRegistryEntry,
  WebhookCheckResponse,
} from './types';

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

function isSuccess(result: any, deliveryMethod: DeliveryMethod, webhookId?: string): boolean {
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      if (webhookId) {
        return Boolean(
          result.data &&
            result.data.webhookSubscriptionUpdate &&
            result.data.webhookSubscriptionUpdate.webhookSubscription,
        );
      } else {
        return Boolean(
          result.data &&
            result.data.webhookSubscriptionCreate &&
            result.data.webhookSubscriptionCreate.webhookSubscription,
        );
      }
    case DeliveryMethod.EventBridge:
      if (webhookId) {
        return Boolean(
          result.data &&
            result.data.eventBridgeWebhookSubscriptionUpdate &&
            result.data.eventBridgeWebhookSubscriptionUpdate.webhookSubscription,
        );
      } else {
        return Boolean(
          result.data &&
            result.data.eventBridgeWebhookSubscriptionCreate &&
            result.data.eventBridgeWebhookSubscriptionCreate.webhookSubscription,
        );
      }
    default:
      return false;
  }
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
          }
        }
      }
    }
  }`;
}

function buildQuery(
  topic: string,
  address: string,
  deliveryMethod: DeliveryMethod,
  webhookId?: string,
): string {
  let identifier: string;
  if (webhookId) {
    identifier = `id: "${webhookId}"`;
  } else {
    identifier = `topic: ${topic}`;
  }

  let mutationName: string;
  let webhookSubscriptionArgs: string;
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      mutationName = webhookId ? 'webhookSubscriptionUpdate' : 'webhookSubscriptionCreate';
      webhookSubscriptionArgs = `{callbackUrl: "${address}"}`;
      break;
    case DeliveryMethod.EventBridge:
      mutationName = webhookId ? 'eventBridgeWebhookSubscriptionUpdate' : 'eventBridgeWebhookSubscriptionCreate';
      webhookSubscriptionArgs = `{arn: "${address}"}`;
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
    const address = deliveryMethod === DeliveryMethod.EventBridge
      ? path
      : `https://${Context.HOST_NAME}${path}`;
    const checkResult = await client.query({
      data: buildCheckQuery(topic),
    });
    const checkBody = checkResult.body as WebhookCheckResponse;

    let webhookId: string | undefined;
    let mustRegister = true;
    if (checkBody.data.webhookSubscriptions.edges.length) {
      const {id, endpoint} = checkBody.data.webhookSubscriptions.edges[0].node;
      const endpointAddress = endpoint.__typename === 'WebhookHttpEndpoint' ? endpoint.callbackUrl : endpoint.arn;
      webhookId = id;
      if (endpointAddress === address) {
        mustRegister = false;
      }
    }

    let success: boolean;
    let body: unknown;
    if (mustRegister) {
      const result = await client.query({
        data: buildQuery(topic, address, deliveryMethod, webhookId),
      });

      success = isSuccess(result.body, deliveryMethod, webhookId);
      body = result.body;
    } else {
      success = true;
      body = {};
    }

    if (success) {
      // Remove this topic from the registry if it is already there
      WebhooksRegistry.webhookRegistry = WebhooksRegistry.webhookRegistry.filter((item) => item.topic !== topic);
      WebhooksRegistry.webhookRegistry.push({path, topic, webhookHandler});
    }

    return {success, result: body};
  },

  async process(request: http.IncomingMessage, response: http.ServerResponse): Promise<void> {
    let reqBody = '';

    const promise: Promise<void> = new Promise((resolve, reject) => {
      request.on('data', (chunk) => {
        reqBody += chunk;
      });

      request.on('end', async () => {
        if (!reqBody.length) {
          response.writeHead(StatusCode.BadRequest);
          response.end();
          return reject(new ShopifyErrors.InvalidWebhookError('No body was received when processing webhook'));
        }

        let hmac: string | string [] | undefined;
        let topic: string | string [] | undefined;
        let domain: string | string [] | undefined;
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
          return reject(new ShopifyErrors.InvalidWebhookError(
            `Missing one or more of the required HTTP headers to process webhooks: [${missingHeaders.join(', ')}]`,
          ));
        }

        let statusCode: StatusCode | undefined;
        let responseError: Error | undefined;
        const headers = {};

        const generatedHash = createHmac('sha256', Context.API_SECRET_KEY)
          .update(reqBody, 'utf8')
          .digest('base64');

        if (ShopifyUtilities.safeCompare(generatedHash, hmac as string)) {
          const graphqlTopic = (topic as string).toUpperCase().replace(/\//g, '_');
          const webhookEntry = WebhooksRegistry.webhookRegistry.find((entry) => entry.topic === graphqlTopic);

          if (webhookEntry) {
            try {
              await webhookEntry.webhookHandler(graphqlTopic, domain as string, reqBody);
              statusCode = StatusCode.Ok;
            } catch (error) {
              statusCode = StatusCode.InternalServerError;
              responseError = error;
            }
          } else {
            statusCode = StatusCode.Forbidden;
            responseError = new ShopifyErrors.InvalidWebhookError(`No webhook is registered for topic ${topic}`);
          }
        } else {
          statusCode = StatusCode.Forbidden;
          responseError = new ShopifyErrors.InvalidWebhookError(`Could not validate request for topic ${topic}`);
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
    return Boolean(WebhooksRegistry.webhookRegistry.find((entry) => entry.path === path));
  },
};

export {WebhooksRegistry, RegistryInterface};
