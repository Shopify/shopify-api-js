import {createGraphqlClientClass} from '../clients/graphql/graphql_client';
import {InvalidDeliveryMethodError, ShopifyError} from '../error';
import {ConfigInterface, gdprTopics} from '../base-types';

import {
  addHostToCallbackUrl,
  createGetHandlers,
  handlerIdentifier,
} from './registry';
import {queryTemplate} from './query-template';
import {
  WebhookRegistry,
  RegisterParams,
  RegisterReturn,
  WebhookHandler,
  WebhookCheckResponse,
  DeliveryMethod,
  WebhookCheckResponseNode,
  WebhookOperation,
  RegisterResult,
} from './types';

interface RegisterTopicParams {
  config: ConfigInterface;
  shop: string;
  accessToken: string;
  topic: string;
  existingHandlers: WebhookHandler[];
  handlers: WebhookHandler[];
}

interface RunMutationsParams {
  config: ConfigInterface;
  client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
  topic: string;
  handlers: WebhookHandler[];
  operation: WebhookOperation;
}

interface RunMutationParams {
  config: ConfigInterface;
  client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
  topic: string;
  handler: WebhookHandler;
  operation: WebhookOperation;
}

export function createRegister(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry,
) {
  return async function register({
    accessToken,
    shop,
  }: RegisterParams): Promise<RegisterReturn> {
    const registerReturn: RegisterReturn = Object.keys(webhookRegistry).reduce(
      (acc: RegisterReturn, topic) => {
        acc[topic] = [];
        return acc;
      },
      {},
    );

    const existingHandlers = await getExistingHandlers(
      config,
      shop,
      accessToken,
    );

    for (const topic in webhookRegistry) {
      if (!Object.prototype.hasOwnProperty.call(webhookRegistry, topic)) {
        continue;
      }

      if (gdprTopics.includes(topic)) {
        continue;
      }

      registerReturn[topic] = await registerTopic({
        config,
        topic,
        shop,
        accessToken,
        existingHandlers: existingHandlers[topic] || [],
        handlers: createGetHandlers(webhookRegistry)(topic),
      });
    }

    return registerReturn;
  };
}

async function getExistingHandlers(
  config: ConfigInterface,
  shop: string,
  accessToken: string | undefined,
): Promise<WebhookRegistry> {
  const GraphqlClient = createGraphqlClientClass({config});
  const client = new GraphqlClient({domain: shop, accessToken});

  const existingHandlers: WebhookRegistry = {};

  let hasNextPage: boolean;
  let endCursor: string | null = null;
  do {
    const query = buildCheckQuery(endCursor);

    const response = await client.query<WebhookCheckResponse>({
      data: query,
    });

    response.body.data.webhookSubscriptions.edges.forEach((edge) => {
      const handler = buildHandlerFromNode(edge);

      if (!existingHandlers[edge.node.topic]) {
        existingHandlers[edge.node.topic] = [];
      }

      existingHandlers[edge.node.topic].push(handler);
    });

    endCursor = response.body.data.webhookSubscriptions.pageInfo.endCursor;
    hasNextPage = response.body.data.webhookSubscriptions.pageInfo.hasNextPage;
  } while (hasNextPage);

  return existingHandlers;
}

function buildCheckQuery(endCursor: string | null) {
  return queryTemplate(TEMPLATE_GET_HANDLERS, {
    END_CURSOR: JSON.stringify(endCursor),
  });
}

function buildHandlerFromNode(edge: WebhookCheckResponseNode): WebhookHandler {
  const endpoint = edge.node.endpoint;

  let handler: WebhookHandler;

  switch (endpoint.__typename) {
    case 'WebhookHttpEndpoint':
      handler = {
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: endpoint.callbackUrl,
        // This is a dummy for now because we don't really care about it
        callback: async () => {},
      };
      break;
    case 'WebhookEventBridgeEndpoint':
      handler = {
        deliveryMethod: DeliveryMethod.EventBridge,
        arn: endpoint.arn,
      };
      break;
    case 'WebhookPubSubEndpoint':
      handler = {
        deliveryMethod: DeliveryMethod.PubSub,
        pubSubProject: endpoint.pubSubProject,
        pubSubTopic: endpoint.pubSubTopic,
      };
      break;
  }

  // Set common fields
  handler.id = edge.node.id;
  handler.includeFields = edge.node.includeFields;
  handler.metafieldNamespaces = edge.node.metafieldNamespaces;
  handler.privateMetafieldNamespaces = edge.node.privateMetafieldNamespaces;

  return handler;
}

async function registerTopic({
  config,
  shop,
  accessToken,
  topic,
  existingHandlers,
  handlers,
}: RegisterTopicParams): Promise<RegisterResult[]> {
  let registerResults: RegisterResult[] = [];

  const {toCreate, toUpdate, toDelete} = categorizeHandlers(
    config,
    existingHandlers,
    handlers,
  );

  const GraphqlClient = createGraphqlClientClass({config});
  const client = new GraphqlClient({domain: shop, accessToken});

  let operation = WebhookOperation.Create;
  registerResults = registerResults.concat(
    await runMutations({config, client, topic, operation, handlers: toCreate}),
  );

  operation = WebhookOperation.Update;
  registerResults = registerResults.concat(
    await runMutations({config, client, topic, operation, handlers: toUpdate}),
  );

  operation = WebhookOperation.Delete;
  registerResults = registerResults.concat(
    await runMutations({config, client, topic, operation, handlers: toDelete}),
  );

  return registerResults;
}

interface HandlersByKey {
  [key: string]: WebhookHandler;
}

function categorizeHandlers(
  config: ConfigInterface,
  existingHandlers: WebhookHandler[],
  handlers: WebhookHandler[],
) {
  // We pre-sort the optional array fields to make them cheaper to compare, so we can minimize the number of update
  // requests we make
  const handlersByKey = handlers.reduce((acc: HandlersByKey, value) => {
    value.includeFields?.sort();
    value.metafieldNamespaces?.sort();
    value.privateMetafieldNamespaces?.sort();

    acc[handlerIdentifier(config, value)] = value;
    return acc;
  }, {});
  const existingHandlersByKey = existingHandlers.reduce(
    (acc: HandlersByKey, value) => {
      value.includeFields?.sort();
      value.metafieldNamespaces?.sort();
      value.privateMetafieldNamespaces?.sort();

      acc[handlerIdentifier(config, value)] = value;
      return acc;
    },
    {},
  );

  const toCreate: HandlersByKey = {...handlersByKey};
  const toUpdate: HandlersByKey = {};
  const toDelete: HandlersByKey = {};
  for (const existingKey in existingHandlersByKey) {
    if (
      !Object.prototype.hasOwnProperty.call(existingHandlersByKey, existingKey)
    ) {
      continue;
    }

    const existingHandler = existingHandlersByKey[existingKey];
    const handler = handlersByKey[existingKey];

    if (existingKey in handlersByKey) {
      delete toCreate[existingKey];

      if (!areHandlerFieldsEqual(existingHandler, handler)) {
        toUpdate[existingKey] = handler;
        toUpdate[existingKey].id = existingHandler.id;
      }
    } else {
      toDelete[existingKey] = existingHandler;
    }
  }

  return {
    toCreate: Object.values(toCreate),
    toUpdate: Object.values(toUpdate),
    toDelete: Object.values(toDelete),
  };
}
function areHandlerFieldsEqual(
  arr1: WebhookHandler,
  arr2: WebhookHandler,
): boolean {
  return (
    arraysEqual(arr1.includeFields || [], arr2.includeFields || []) &&
    arraysEqual(
      arr1.metafieldNamespaces || [],
      arr2.metafieldNamespaces || [],
    ) &&
    arraysEqual(
      arr1.privateMetafieldNamespaces || [],
      arr2.privateMetafieldNamespaces || [],
    )
  );
}

function arraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0, len = arr1.length; i < len; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }

  return true;
}

async function runMutations({
  config,
  client,
  topic,
  handlers,
  operation,
}: RunMutationsParams): Promise<RegisterResult[]> {
  const registerResults: RegisterResult[] = [];

  for (const handler of handlers) {
    registerResults.push(
      await runMutation({config, client, topic, handler, operation}),
    );
  }

  return registerResults;
}

async function runMutation({
  config,
  client,
  topic,
  handler,
  operation,
}: RunMutationParams): Promise<RegisterResult> {
  let registerResult: RegisterResult;

  try {
    const query = buildMutation(config, topic, handler, operation);

    const result = await client.query({data: query});

    registerResult = {
      deliveryMethod: handler.deliveryMethod,
      success: isSuccess(result.body, handler, operation),
      result: result.body,
    };
  } catch (error) {
    if (error instanceof InvalidDeliveryMethodError) {
      registerResult = {
        deliveryMethod: handler.deliveryMethod,
        success: false,
        result: {message: error.message},
      };
    } else {
      throw error;
    }
  }

  return registerResult;
}

function buildMutation(
  config: ConfigInterface,
  topic: string,
  handler: WebhookHandler,
  operation: WebhookOperation,
): string {
  const params: {[key: string]: string} = {};

  if (handler.id) {
    params.id = `"${handler.id}"`;
  } else {
    params.topic = topic;
  }

  if (operation !== WebhookOperation.Delete) {
    switch (handler.deliveryMethod) {
      case DeliveryMethod.Http:
        params.callbackUrl = `"${addHostToCallbackUrl(
          config,
          handler.callbackUrl,
        )}"`;
        break;
      case DeliveryMethod.EventBridge:
        params.arn = `"${handler.arn}"`;
        break;
      case DeliveryMethod.PubSub:
        params.pubSubProject = `"${handler.pubSubProject}"`;
        params.pubSubTopic = `"${handler.pubSubTopic}"`;
        break;
      default:
        throw new InvalidDeliveryMethodError(
          `Unrecognized delivery method '${(handler as any).deliveryMethod}'`,
        );
    }
  }

  if (handler.includeFields) {
    params.includeFields = JSON.stringify(handler.includeFields);
  }
  if (handler.metafieldNamespaces) {
    params.metafieldNamespaces = JSON.stringify(handler.metafieldNamespaces);
  }
  if (handler.privateMetafieldNamespaces) {
    params.privateMetafieldNamespaces = JSON.stringify(
      handler.privateMetafieldNamespaces,
    );
  }

  const paramsString = Object.entries(params)
    .map(([key, value]) => `${key}: ${value}`)
    .join(',\n      ');

  return queryTemplate(TEMPLATE_MUTATION, {
    MUTATION_NAME: getMutationName(handler, operation),
    MUTATION_PARAMS: paramsString,
  });
}

function getMutationName(
  handler: WebhookHandler,
  operation: WebhookOperation,
): string {
  switch (operation) {
    case WebhookOperation.Create:
      return `${getEndpoint(handler)}Create`;
    case WebhookOperation.Update:
      return `${getEndpoint(handler)}Update`;
    case WebhookOperation.Delete:
      return 'webhookSubscriptionDelete';
    default:
      throw new ShopifyError(`Unrecognized operation '${operation}'`);
  }
}

function getEndpoint(handler: WebhookHandler): string {
  switch (handler.deliveryMethod) {
    case DeliveryMethod.Http:
      return 'webhookSubscription';
    case DeliveryMethod.EventBridge:
      return 'eventBridgeWebhookSubscription';
    case DeliveryMethod.PubSub:
      return 'pubSubWebhookSubscription';
    default:
      throw new ShopifyError(
        `Unrecognized delivery method '${(handler as any).deliveryMethod}'`,
      );
  }
}

function isSuccess(
  result: any,
  handler: WebhookHandler,
  operation: WebhookOperation,
): boolean {
  const mutationName = getMutationName(handler, operation);

  return Boolean(
    result.data &&
      result.data[mutationName] &&
      result.data[mutationName].userErrors.length === 0,
  );
}

export const TEMPLATE_GET_HANDLERS = `{
  webhookSubscriptions(
    first: 250,
    after: {{END_CURSOR}},
  ) {
    edges {
      node {
        id
        topic
        includeFields
        metafieldNamespaces
        privateMetafieldNamespaces
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
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}`;

export const TEMPLATE_MUTATION = `
  mutation webhookSubscription {
    {{MUTATION_NAME}}(
      {{MUTATION_PARAMS}}
    ) {
      userErrors {
        field
        message
      }
    }
  }
`;
