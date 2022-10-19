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
} from './types';

interface RunMutationParams {
  config: ConfigInterface;
  client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
  topic: string;
  handler: WebhookHandler;
  operation: WebhookOperation;
  registerReturn: RegisterReturn;
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

      const handlers = createGetHandlers(webhookRegistry)(topic);

      if (gdprTopics.includes(topic)) {
        continue;
      }

      const {toCreate, toUpdate, toDelete} = categorizeHandlers(
        config,
        existingHandlers[topic] || [],
        handlers,
      );

      const GraphqlClient = createGraphqlClientClass({config});
      const client = new GraphqlClient({domain: shop, accessToken});

      for (const handler of toCreate) {
        await runMutation({
          config,
          client,
          topic,
          handler,
          operation: WebhookOperation.Create,
          registerReturn,
        });
      }

      for (const handler of toUpdate) {
        await runMutation({
          config,
          client,
          topic,
          handler,
          operation: WebhookOperation.Update,
          registerReturn,
        });
      }

      for (const handler of toDelete) {
        await runMutation({
          config,
          client,
          topic,
          handler,
          operation: WebhookOperation.Delete,
          registerReturn,
        });
      }
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

export function buildCheckQuery(endCursor: string | null) {
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
        id: edge.node.id,
        deliveryMethod: DeliveryMethod.Http,
        callbackUrl: endpoint.callbackUrl,
        // This is a dummy for now because we don't really care about it
        handler: async () => {},
      };
      break;
    case 'WebhookEventBridgeEndpoint':
      handler = {
        id: edge.node.id,
        deliveryMethod: DeliveryMethod.EventBridge,
        arn: endpoint.arn,
      };
      break;
    case 'WebhookPubSubEndpoint':
      handler = {
        id: edge.node.id,
        deliveryMethod: DeliveryMethod.PubSub,
        pubSubProject: endpoint.pubSubProject,
        pubSubTopic: endpoint.pubSubTopic,
      };
      break;
  }

  return handler;
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

    if (existingKey in handlersByKey) {
      delete toCreate[existingKey];
      // For now, there is nothing to update because we only save the identifier fields
      // toUpdate.push(handler);
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

async function runMutation({
  config,
  client,
  topic,
  handler,
  operation,
  registerReturn,
}: RunMutationParams): Promise<void> {
  try {
    const query = buildMutation(config, topic, handler, operation);

    const result = await client.query({data: query});

    registerReturn[topic].push({
      deliveryMethod: handler.deliveryMethod,
      success: isSuccess(result.body, handler, operation),
      result: result.body,
    });
  } catch (error) {
    if (error instanceof InvalidDeliveryMethodError) {
      registerReturn[topic].push({
        deliveryMethod: handler.deliveryMethod,
        success: false,
        result: {message: error.message},
      });
    } else {
      throw error;
    }
  }
}

export function buildMutation(
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
