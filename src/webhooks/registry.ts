import {StatusCode} from '@shopify/network';

import {
  abstractConvertRequest,
  abstractConvertResponse,
  AdapterArgs,
  AdapterResponse,
  getHeader,
  Headers,
  isOK,
  NormalizedRequest,
  NormalizedResponse,
} from '../runtime/http';
import {createGraphqlClientClass} from '../clients/graphql/graphql_client';
import {ConfigInterface, gdprTopics, ShopifyHeader} from '../base-types';
import {safeCompare} from '../auth/oauth/safe-compare';
import * as ShopifyErrors from '../error';
import {createSHA256HMAC} from '../runtime/crypto';
import {HashFormat} from '../runtime/crypto/types';

import {
  AddHandlerParams,
  AddHandlersProps,
  BuildCheckQueryParams,
  BuildQueryParams,
  DeliveryMethod,
  RegisterParams,
  RegisterReturn,
  WebhookRegistryEntry,
  WebhookCheckResponse,
  ShortenedRegisterParams,
} from './types';

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

export function buildCheckQuery({topic}: BuildCheckQueryParams): string {
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

export function buildQuery({
  topic,
  address,
  deliveryMethod = DeliveryMethod.Http,
  webhookId,
}: BuildQueryParams): string {
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

function topicForStorage(topic: string): string {
  return topic.toUpperCase().replace(/\//g, '_');
}

export const webhookRegistry: {[topic: string]: WebhookRegistryEntry} = {};

export function resetWebhookRegistry() {
  for (const key in webhookRegistry) {
    if ({}.hasOwnProperty.call(webhookRegistry, key)) {
      delete webhookRegistry[key];
    }
  }
}

export function addHandler(params: AddHandlerParams) {
  const {topic, ...rest} = params;
  webhookRegistry[topicForStorage(topic)] = rest as WebhookRegistryEntry;
}

export function addHandlers(handlers: AddHandlersProps): void {
  Object.entries(handlers).forEach(
    ([topic, registryEntry]: [string, WebhookRegistryEntry]) => {
      addHandler({topic, ...registryEntry});
    },
  );
}

export function getHandler(topic: string): WebhookRegistryEntry | null {
  return webhookRegistry[topicForStorage(topic)] ?? null;
}

export function getTopics(): string[] {
  return Object.keys(webhookRegistry);
}

export function createRegister(config: ConfigInterface) {
  const GraphqlClient = createGraphqlClientClass({config});

  return async function register({
    path,
    topic,
    accessToken,
    shop,
    deliveryMethod = DeliveryMethod.Http,
  }: RegisterParams): Promise<RegisterReturn> {
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
    const client = new GraphqlClient({domain: shop, accessToken});
    const address =
      deliveryMethod === DeliveryMethod.Http
        ? `${config.hostScheme}://${config.hostName}${path}`
        : path;

    let checkResult;
    try {
      checkResult = await client.query<WebhookCheckResponse>({
        data: buildCheckQuery({topic}),
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
        data: buildQuery({topic, address, deliveryMethod, webhookId}),
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
  };
}

export function createRegisterAll(config: ConfigInterface) {
  const register = createRegister(config);

  return async function registerAll({
    accessToken,
    shop,
    deliveryMethod = DeliveryMethod.Http,
  }: ShortenedRegisterParams): Promise<RegisterReturn> {
    let registerReturn = {};
    const topics = getTopics();

    for (const topic of topics) {
      const handler = getHandler(topic);
      if (handler) {
        const {path} = handler;
        const webhook: RegisterParams = {
          path,
          topic,
          accessToken,
          shop,
          deliveryMethod,
        };
        const returnedRegister = await register(webhook);
        registerReturn = {...registerReturn, ...returnedRegister};
      }
    }
    return registerReturn;
  };
}
export interface WebhookProcessParams extends AdapterArgs {
  rawBody: string;
}

const statusTextLookup: {[key: string]: string} = {
  [StatusCode.Ok]: 'OK',
  [StatusCode.BadRequest]: 'Bad Request',
  [StatusCode.Unauthorized]: 'Unauthorized',
  [StatusCode.NotFound]: 'Not Found',
  [StatusCode.InternalServerError]: 'Internal Server Error',
};

function checkWebhookRequest(
  rawBody: string,
  headers: Headers,
): {
  webhookOk: boolean;
  errorMessage: string;
  hmac: string;
  topic: string;
  domain: string;
} {
  const retVal = {
    webhookOk: true,
    errorMessage: '',
    hmac: '',
    topic: '',
    domain: '',
  };

  if (rawBody.length) {
    const hmac = getHeader(headers, ShopifyHeader.Hmac);
    const topic = getHeader(headers, ShopifyHeader.Topic);
    const domain = getHeader(headers, ShopifyHeader.Domain);

    const missingHeaders: ShopifyHeader[] = [];
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
      retVal.webhookOk = false;
      retVal.errorMessage = `Missing one or more of the required HTTP headers to process webhowebhookOks: [${missingHeaders.join(
        ', ',
      )}]`;
    } else {
      retVal.hmac = hmac as string;
      retVal.topic = topic as string;
      retVal.domain = domain as string;
    }
  } else {
    retVal.webhookOk = false;
    retVal.errorMessage = 'No body was received when processing webhook';
  }

  return retVal;
}

export function createProcess(config: ConfigInterface) {
  return async function process({
    rawBody,
    ...adapterArgs
  }: WebhookProcessParams): Promise<AdapterResponse> {
    const request: NormalizedRequest = await abstractConvertRequest(
      adapterArgs,
    );
    const response: NormalizedResponse = {
      statusCode: StatusCode.Ok,
      statusText: statusTextLookup[StatusCode.Ok],
      headers: {},
    };

    const webhookCheck = checkWebhookRequest(rawBody, request.headers);
    const {webhookOk, hmac, topic, domain} = webhookCheck;
    let {errorMessage} = webhookCheck;

    if (webhookOk) {
      const generatedHash = await createSHA256HMAC(
        config.apiSecretKey,
        rawBody,
        HashFormat.Base64,
      );

      if (safeCompare(generatedHash, hmac)) {
        const graphqlTopic = topicForStorage(topic);
        const webhookEntry = getHandler(graphqlTopic);

        if (webhookEntry) {
          try {
            webhookEntry.webhookHandler(graphqlTopic, domain, rawBody);
            response.statusCode = StatusCode.Ok;
          } catch (error) {
            response.statusCode = StatusCode.InternalServerError;
            errorMessage = error.message;
          }
        } else {
          response.statusCode = StatusCode.NotFound;
          errorMessage = `No webhook is registered for topic ${topic}`;
        }
      } else {
        response.statusCode = StatusCode.Unauthorized;
        errorMessage = `Could not validate request for topic ${topic}`;
      }
    } else {
      response.statusCode = StatusCode.BadRequest;
    }

    response.statusText = statusTextLookup[response.statusCode];
    const returnResponse = await abstractConvertResponse(response, adapterArgs);
    if (!isOK(response)) {
      throw new ShopifyErrors.InvalidWebhookError({
        message: errorMessage,
        response: returnResponse,
      });
    }

    return Promise.resolve(returnResponse);
  };
}

export function isWebhookPath(path: string): boolean {
  for (const key in webhookRegistry) {
    if (webhookRegistry[key].path === path) {
      return true;
    }
  }
  return false;
}
