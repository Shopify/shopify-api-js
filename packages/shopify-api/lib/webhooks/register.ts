import {versionCompatible, versionPriorTo} from '../utils/version-compatible';
import {
  graphqlClientClass,
  GraphqlClient,
} from '../clients/graphql/graphql_client';
import {InvalidDeliveryMethodError, ShopifyError} from '../error';
import {logger} from '../logger';
import {ApiVersion, gdprTopics} from '../types';
import {ConfigInterface} from '../base-types';
import {Session} from '../session/session';

import {addHostToCallbackUrl, getHandlers, handlerIdentifier} from './registry';
import {queryTemplate} from './query-template';
import {
  WebhookRegistry,
  RegisterReturn,
  WebhookHandler,
  WebhookCheckResponse,
  DeliveryMethod,
  WebhookCheckResponseNode,
  WebhookOperation,
  RegisterResult,
  RegisterParams,
} from './types';

interface RegisterTopicParams {
  config: ConfigInterface;
  session: Session;
  topic: string;
  existingHandlers: WebhookHandler[];
  handlers: WebhookHandler[];
}

interface RunMutationsParams {
  config: ConfigInterface;
  client: GraphqlClient;
  topic: string;
  handlers: WebhookHandler[];
  operation: WebhookOperation;
}

interface RunMutationParams {
  config: ConfigInterface;
  client: GraphqlClient;
  topic: string;
  handler: WebhookHandler;
  operation: WebhookOperation;
}

export function register(
  config: ConfigInterface,
  webhookRegistry: WebhookRegistry,
) {
  return async function register({
    session,
  }: RegisterParams): Promise<RegisterReturn> {
    const log = logger(config);
    log.info('Registering webhooks', {shop: session.shop});

    const registerReturn: RegisterReturn = Object.keys(webhookRegistry).reduce(
      (acc: RegisterReturn, topic) => {
        acc[topic] = [];
        return acc;
      },
      {},
    );

    const existingHandlers = await getExistingHandlers(config, session);

    log.debug(
      `Existing topics: [${Object.keys(existingHandlers).join(', ')}]`,
      {shop: session.shop},
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
        session,
        topic,
        existingHandlers: existingHandlers[topic] || [],
        handlers: getHandlers(webhookRegistry)(topic),
      });

      // Remove this topic from the list of existing handlers so we have a list of leftovers
      delete existingHandlers[topic];
    }

    // Delete any leftover handlers
    for (const topic in existingHandlers) {
      if (!Object.prototype.hasOwnProperty.call(existingHandlers, topic)) {
        continue;
      }

      const GraphqlClient = graphqlClientClass({config});
      const client = new GraphqlClient({session});

      registerReturn[topic] = await runMutations({
        config,
        client,
        topic,
        handlers: existingHandlers[topic],
        operation: WebhookOperation.Delete,
      });
    }

    return registerReturn;
  };
}

async function getExistingHandlers(
  config: ConfigInterface,
  session: Session,
): Promise<WebhookRegistry> {
  const GraphqlClient = graphqlClientClass({config});
  const client = new GraphqlClient({session});

  const existingHandlers: WebhookRegistry = {};

  let hasNextPage: boolean;
  let endCursor: string | null = null;
  do {
    const query = buildCheckQuery(config, endCursor);

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

function buildCheckQuery(config: ConfigInterface, endCursor: string | null) {
  return removeDeprecatedFields(
    config,
    queryTemplate(TEMPLATE_GET_HANDLERS, {
      END_CURSOR: JSON.stringify(endCursor),
    }),
  );
}

function removeDeprecatedFields(
  config: ConfigInterface,
  query: string,
): string {
  let processedQuery = query;

  // The privateMetafieldNamespaces field was deprecated in the July22 version, so we need to stop sending it
  if (versionCompatible(config)(ApiVersion.July22)) {
    processedQuery = processedQuery.replace('privateMetafieldNamespaces', '');
  }

  return processedQuery;
}

function buildHandlerFromNode(edge: WebhookCheckResponseNode): WebhookHandler {
  const endpoint = edge.node.endpoint;

  let handler: WebhookHandler;

  switch (endpoint.__typename) {
    case 'WebhookHttpEndpoint':
      handler = {
        deliveryMethod: DeliveryMethod.Http,
        privateMetafieldNamespaces: edge.node.privateMetafieldNamespaces,
        callbackUrl: endpoint.callbackUrl,
        // This is a dummy for now because we don't really care about it
        callback: async () => {},
      };

      // This field only applies to HTTP webhooks
      handler.privateMetafieldNamespaces?.sort();
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

  // Sort the array fields to make them cheaper to compare later on
  handler.includeFields?.sort();
  handler.metafieldNamespaces?.sort();

  return handler;
}

async function registerTopic({
  config,
  session,
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

  const GraphqlClient = graphqlClientClass({config});
  const client = new GraphqlClient({session});

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
  const handlersByKey = handlers.reduce((acc: HandlersByKey, value) => {
    acc[handlerIdentifier(config, value)] = value;
    return acc;
  }, {});
  const existingHandlersByKey = existingHandlers.reduce(
    (acc: HandlersByKey, value) => {
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
  const includeFieldsEqual = arraysEqual(
    arr1.includeFields || [],
    arr2.includeFields || [],
  );
  const metafieldNamespacesEqual = arraysEqual(
    arr1.metafieldNamespaces || [],
    arr2.metafieldNamespaces || [],
  );
  const privateMetafieldNamespacesEqual =
    arr1.deliveryMethod !== DeliveryMethod.Http ||
    arr2.deliveryMethod !== DeliveryMethod.Http ||
    arraysEqual(
      arr1.privateMetafieldNamespaces || [],
      arr2.privateMetafieldNamespaces || [],
    );

  return (
    includeFieldsEqual &&
    metafieldNamespacesEqual &&
    privateMetafieldNamespacesEqual
  );
}

function arraysEqual(arr1: any[], arr2: any[]): boolean {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
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

  logger(config).debug(`Running webhook mutation`, {topic, operation});

  try {
    const query = buildMutation(config, topic, handler, operation);

    const result = await client.query({data: query});

    registerResult = {
      deliveryMethod: handler.deliveryMethod,
      success: isSuccess(result.body, handler, operation),
      result: result.body,
      operation,
    };
  } catch (error) {
    if (error instanceof InvalidDeliveryMethodError) {
      registerResult = {
        deliveryMethod: handler.deliveryMethod,
        success: false,
        result: {message: error.message},
        operation,
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

  let identifier: string;
  if (handler.id) {
    identifier = `id: "${handler.id}"`;
  } else {
    identifier = `topic: ${topic}`;
  }

  const mutationArguments = {
    MUTATION_NAME: getMutationName(handler, operation),
    IDENTIFIER: identifier,
    MUTATION_PARAMS: '',
  };

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

    if (handler.includeFields) {
      params.includeFields = JSON.stringify(handler.includeFields);
    }
    if (handler.metafieldNamespaces) {
      params.metafieldNamespaces = JSON.stringify(handler.metafieldNamespaces);
    }

    if (
      handler.deliveryMethod === DeliveryMethod.Http &&
      handler.privateMetafieldNamespaces &&
      // This field was deprecated in the July22 version
      versionPriorTo(config)(ApiVersion.July22)
    ) {
      params.privateMetafieldNamespaces = JSON.stringify(
        handler.privateMetafieldNamespaces,
      );
    }

    const paramsString = Object.entries(params)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    mutationArguments.MUTATION_PARAMS = `webhookSubscription: {${paramsString}}`;
  }

  return queryTemplate(TEMPLATE_MUTATION, mutationArguments);
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

export const TEMPLATE_GET_HANDLERS = `query shopifyApiReadWebhookSubscriptions {
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
  mutation shopifyApiCreateWebhookSubscription {
    {{MUTATION_NAME}}(
      {{IDENTIFIER}},
      {{MUTATION_PARAMS}}
    ) {
      userErrors {
        field
        message
      }
    }
  }
`;
