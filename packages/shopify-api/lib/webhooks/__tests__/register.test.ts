import {Method, Header} from '@shopify/network';

import {
  RegisterParams,
  RegisterReturn,
  WebhookHandler,
  WebhookOperation,
} from '../types';
import {ApiVersion, gdprTopics, ShopifyHeader} from '../../types';
import {DataType} from '../../clients/types';
import {
  queueMockResponse,
  queueMockResponses,
  shopify,
} from '../../__tests__/test-helper';
import {mockTestRequests} from '../../../adapters/mock/mock_test_requests';
import {queryTemplate} from '../query-template';
import {TEMPLATE_GET_HANDLERS, TEMPLATE_MUTATION} from '../register';
import {Session} from '../../session/session';
import {InvalidDeliveryMethodError} from '../../error';

import * as mockResponses from './responses';
import {MockResponse} from './responses';
import {EVENT_BRIDGE_HANDLER, HTTP_HANDLER, PUB_SUB_HANDLER} from './handlers';

interface RegisterTestWebhook {
  topic: string;
  handler: WebhookHandler;
  checkMockResponse?: MockResponse;
  responses?: MockResponse[];
  includePrivateMetafieldNamespaces?: boolean;
}

interface RegisterTestResponse {
  topic: string;
  registerReturn: RegisterReturn;
  expectedSuccess?: boolean;
  responses: MockResponse[];
}

interface MutationParams {
  [key: string]: any;
}

const session = new Session({
  id: 'test-session',
  shop: 'shop1.myshopify.io',
  accessToken: 'some token',
  isOnline: true,
  state: 'test-state',
});

describe('shopify.webhooks.register', () => {
  it('sends a post request to the given shop domain with the webhook data as a GraphQL query in the body and the access token in the headers', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler = HTTP_HANDLER;
    const responses = [mockResponses.successResponse];

    const registerReturn = await registerWebhook({topic, handler, responses});

    assertWebhookRegistrationRequest(
      'webhookSubscriptionCreate',
      `topic: ${topic}`,
      {callbackUrl: `"https://test_host_name/webhooks"`},
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('returns a result with success set to false, body set to empty object, when the server doesn’t return a webhookSubscriptionCreate field', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler = HTTP_HANDLER;
    const responses = [mockResponses.httpFailResponse];

    const registerReturn = await registerWebhook({topic, handler, responses});

    assertWebhookRegistrationRequest(
      'webhookSubscriptionCreate',
      `topic: ${topic}`,
      {callbackUrl: `"https://test_host_name/webhooks"`},
    );
    assertRegisterResponse({
      registerReturn,
      topic,
      responses,
      expectedSuccess: false,
    });
  });

  it('sends an EventBridge registration GraphQL query for an EventBridge webhook registration', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler = EVENT_BRIDGE_HANDLER;
    const responses = [mockResponses.eventBridgeSuccessResponse];

    const registerReturn = await registerWebhook({topic, handler, responses});

    assertWebhookRegistrationRequest(
      'eventBridgeWebhookSubscriptionCreate',
      `topic: ${topic}`,
      {arn: '"arn:test"'},
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('sends a PubSub registration GraphQL query for a PubSub webhook registration', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler = PUB_SUB_HANDLER;
    const responses = [mockResponses.pubSubSuccessResponse];

    const registerReturn = await registerWebhook({topic, handler, responses});

    assertWebhookRegistrationRequest(
      'pubSubWebhookSubscriptionCreate',
      `topic: ${topic}`,
      {pubSubProject: '"my-project-id"', pubSubTopic: '"my-topic-id"'},
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('updates a pre-existing webhook if the address stays the same', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler: WebhookHandler = {
      ...HTTP_HANDLER,
      metafieldNamespaces: ['new-namespace'],
    };
    const responses = [mockResponses.successUpdateResponse];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      checkMockResponse: mockResponses.webhookCheckResponse,
      responses,
    });

    assertWebhookRegistrationRequest(
      'webhookSubscriptionUpdate',
      `id: "${mockResponses.TEST_WEBHOOK_ID}"`,
      {
        callbackUrl: `"https://test_host_name/webhooks"`,
        metafieldNamespaces: '["new-namespace"]',
      },
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('updates a pre-existing eventbridge webhook if the address stays the same', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler: WebhookHandler = {
      ...EVENT_BRIDGE_HANDLER,
      metafieldNamespaces: ['new-namespace'],
    };
    const responses = [mockResponses.eventBridgeSuccessUpdateResponse];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      checkMockResponse: mockResponses.eventBridgeWebhookCheckResponse,
      responses,
    });

    assertWebhookRegistrationRequest(
      'eventBridgeWebhookSubscriptionUpdate',
      `id: "${mockResponses.TEST_WEBHOOK_ID}"`,
      {
        arn: `"arn:test"`,
        metafieldNamespaces: '["new-namespace"]',
      },
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('updates a pre-existing pubsub webhook if the address stays the same', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler: WebhookHandler = {
      ...PUB_SUB_HANDLER,
      includeFields: ['id', 'title'],
    };
    const responses = [mockResponses.pubSubSuccessUpdateResponse];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      checkMockResponse: mockResponses.pubSubWebhookCheckResponse,
      responses,
    });

    assertWebhookRegistrationRequest(
      'pubSubWebhookSubscriptionUpdate',
      `id: "${mockResponses.TEST_WEBHOOK_ID}"`,
      {
        pubSubProject: '"my-project-id"',
        pubSubTopic: '"my-topic-id"',
        includeFields: '["id","title"]',
      },
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('creates a new webhook registration if the path changes, then deletes the old one', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler: WebhookHandler = {
      ...HTTP_HANDLER,
      callbackUrl: '/webhooks/new',
    };
    const responses = [
      mockResponses.successResponse,
      mockResponses.successDeleteResponse,
    ];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      checkMockResponse: mockResponses.webhookCheckResponse,
      responses,
    });

    assertWebhookRegistrationRequest(
      'webhookSubscriptionCreate',
      `topic: ${topic}`,
      {callbackUrl: `"https://test_host_name/webhooks/new"`},
    );
    assertWebhookRegistrationRequest(
      'webhookSubscriptionDelete',
      `id: "${mockResponses.TEST_WEBHOOK_ID}"`,
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('creates a new EventBridge webhook registration if the address changes, then deletes the old one', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler: WebhookHandler = {
      ...EVENT_BRIDGE_HANDLER,
      arn: 'arn:test-new',
    };
    const responses = [
      mockResponses.eventBridgeSuccessResponse,
      mockResponses.successDeleteResponse,
    ];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      checkMockResponse: mockResponses.eventBridgeWebhookCheckResponse,
      responses,
    });

    assertWebhookRegistrationRequest(
      'eventBridgeWebhookSubscriptionCreate',
      `topic: ${topic}`,
      {arn: `"arn:test-new"`},
    );
    assertWebhookRegistrationRequest(
      'webhookSubscriptionDelete',
      `id: "${mockResponses.TEST_WEBHOOK_ID}"`,
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('creates a new PubSub webhook registration if the address changes, then deletes the old one', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler = {...PUB_SUB_HANDLER, pubSubTopic: 'my-new-topic-id'};
    const responses = [
      mockResponses.pubSubSuccessResponse,
      mockResponses.successDeleteResponse,
    ];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      checkMockResponse: mockResponses.pubSubWebhookCheckResponse,
      responses,
    });

    assertWebhookRegistrationRequest(
      'pubSubWebhookSubscriptionCreate',
      `topic: ${topic}`,
      {pubSubProject: '"my-project-id"', pubSubTopic: '"my-new-topic-id"'},
    );
    assertWebhookRegistrationRequest(
      'webhookSubscriptionDelete',
      `id: "${mockResponses.TEST_WEBHOOK_ID}"`,
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('fails if given an invalid DeliveryMethod', async () => {
    const topic = 'PRODUCTS_CREATE';
    const handler = {...HTTP_HANDLER, deliveryMethod: 'invalid' as any};

    shopify.webhooks.addHandlers({[topic]: handler});

    queueMockResponse(JSON.stringify(mockResponses.webhookCheckEmptyResponse));

    await expect(shopify.webhooks.register({session})).rejects.toThrow(
      InvalidDeliveryMethodError,
    );
  });

  gdprTopics.forEach((gdprTopic) => {
    it(`does not send a register for ${gdprTopic}`, async () => {
      const handler = HTTP_HANDLER;

      shopify.webhooks.addHandlers({[gdprTopic]: handler});

      queueMockResponse(
        JSON.stringify(mockResponses.webhookCheckEmptyResponse),
      );

      const response = await shopify.webhooks.register({session});

      expect(mockTestRequests.requestList).toHaveLength(1);
      expect(response[gdprTopic]).toHaveLength(0);
      expect(shopify.webhooks.getTopicsAdded()).toContain(gdprTopic);
    });
  });

  it('deletes handlers not currently in the registry', async () => {
    const topic = 'NEW_TOPIC_TO_ADD';
    const handler = {...HTTP_HANDLER};
    const responses = [
      mockResponses.successResponse,
      mockResponses.successDeleteResponse,
    ];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      checkMockResponse: mockResponses.webhookCheckResponse,
      responses,
    });

    expect(Object.keys(registerReturn)).toEqual([
      'NEW_TOPIC_TO_ADD',
      'PRODUCTS_CREATE',
    ]);
  });

  it('returns multiple results per topic for multiple webhooks per topic', async () => {
    const topic = 'PRODUCTS_CREATE';
    const httpHandler = HTTP_HANDLER;
    const ebHandler = EVENT_BRIDGE_HANDLER;
    const responses = [
      mockResponses.successResponse,
      mockResponses.eventBridgeSuccessResponse,
    ];

    shopify.webhooks.addHandlers({[topic]: httpHandler});
    shopify.webhooks.addHandlers({[topic]: ebHandler});

    queueMockResponse(JSON.stringify(mockResponses.webhookCheckEmptyResponse));
    responses.forEach((response) => {
      queueMockResponse(JSON.stringify(response));
    });
    const registerReturn = await shopify.webhooks.register({session});

    expect(mockTestRequests.requestList).toHaveLength(responses.length + 1);
    assertWebhookCheckRequest({session});

    assertWebhookRegistrationRequest(
      'webhookSubscriptionCreate',
      `topic: ${topic}`,
      {callbackUrl: `"https://test_host_name/webhooks"`},
    );
    assertWebhookRegistrationRequest(
      'eventBridgeWebhookSubscriptionCreate',
      `topic: ${topic}`,
      {arn: '"arn:test"'},
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  it('returns which operation was done for each handler', async () => {
    // We have a pre-existing webhook for PRODUCTS_CREATE, so we expect it to be deleted, whereas we expect a new one to
    // be created for PRODUCTS_DELETE
    shopify.webhooks.addHandlers({
      PRODUCTS_UPDATE: {...HTTP_HANDLER, includeFields: ['id', 'title']},
      PRODUCTS_DELETE: HTTP_HANDLER,
    });

    queueMockResponses(
      [JSON.stringify(mockResponses.webhookCheckMultiHandlerResponse)],
      [JSON.stringify(mockResponses.successResponse)],
      [JSON.stringify(mockResponses.successUpdateResponse)],
      [JSON.stringify(mockResponses.successDeleteResponse)],
    );

    const registerReturn = await shopify.webhooks.register({session});

    expect(registerReturn.PRODUCTS_CREATE[0].operation).toEqual(
      WebhookOperation.Delete,
    );
    expect(registerReturn.PRODUCTS_DELETE[0].operation).toEqual(
      WebhookOperation.Create,
    );
    expect(registerReturn.PRODUCTS_UPDATE[0].operation).toEqual(
      WebhookOperation.Update,
    );
  });

  it('stops sending the privateMetafieldNamespaces field in versions after 2022-04', async () => {
    shopify.config.apiVersion = ApiVersion.April23;

    const topic = 'PRODUCTS_CREATE';
    const handler = {...HTTP_HANDLER, privateMetafieldNamespaces: ['test']};
    const responses = [mockResponses.successResponse];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      responses,
    });

    assertWebhookRegistrationRequest(
      'webhookSubscriptionCreate',
      `topic: ${topic}`,
      {callbackUrl: `"https://test_host_name/webhooks"`},
    );
    assertRegisterResponse({registerReturn, topic, responses});
  });

  // The test above this becomes moot when this API version is removed. Delete it as well
  it('sends the privateMetafieldNamespaces field up until version 2022-04', async () => {
    shopify.config.apiVersion = ApiVersion.April22;

    const topic = 'PRODUCTS_CREATE';
    const handler = {...HTTP_HANDLER, privateMetafieldNamespaces: ['test']};
    const responses = [mockResponses.successResponse];

    const registerReturn = await registerWebhook({
      topic,
      handler,
      responses,
      includePrivateMetafieldNamespaces: true,
    });

    assertWebhookRegistrationRequest(
      'webhookSubscriptionCreate',
      `topic: ${topic}`,
      {
        callbackUrl: `"https://test_host_name/webhooks", privateMetafieldNamespaces: ["test"]`,
      },
    );
    assertRegisterResponse({
      registerReturn,
      topic,
      responses,
    });
  });
});

async function registerWebhook({
  topic,
  handler,
  checkMockResponse = mockResponses.webhookCheckEmptyResponse,
  responses = [],
  includePrivateMetafieldNamespaces = false,
}: RegisterTestWebhook): Promise<RegisterReturn> {
  shopify.webhooks.addHandlers({[topic]: handler});

  queueMockResponse(JSON.stringify(checkMockResponse));
  responses.forEach((response) => {
    queueMockResponse(JSON.stringify(response));
  });

  const result = await shopify.webhooks.register({session});

  expect(mockTestRequests.requestList).toHaveLength(responses.length + 1);

  assertWebhookCheckRequest({session}, includePrivateMetafieldNamespaces);

  return result;
}

function assertRegisterResponse({
  registerReturn,
  topic,
  expectedSuccess = true,
  responses,
}: RegisterTestResponse) {
  expect(registerReturn[topic]).not.toHaveLength(0);

  registerReturn[topic].forEach((result, i) => {
    expect(result.success).toBe(expectedSuccess);
    expect(result.result).toEqual(responses[i]);
  });
}

function assertWebhookCheckRequest(
  {session}: RegisterParams,
  includePrivateMetafieldNamespaces = false,
) {
  let query = queryTemplate(TEMPLATE_GET_HANDLERS, {END_CURSOR: 'null'});

  if (!includePrivateMetafieldNamespaces) {
    query = query.replace('privateMetafieldNamespaces', '');
  }

  expect({
    method: Method.Post.toString(),
    domain: session.shop,
    path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: session.accessToken,
    },
    data: query,
  }).toMatchMadeHttpRequest();
}

function assertWebhookRegistrationRequest(
  mutationName: string,
  identifier: string,
  mutationParams: MutationParams = {},
) {
  const paramsString = Object.entries(mutationParams)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ');

  const webhookQuery = queryTemplate(TEMPLATE_MUTATION, {
    MUTATION_NAME: mutationName,
    IDENTIFIER: identifier,
    MUTATION_PARAMS: paramsString.length
      ? `webhookSubscription: {${paramsString}}`
      : '',
  });

  expect({
    method: Method.Post.toString(),
    domain: session.shop,
    path: `/admin/api/${shopify.config.apiVersion}/graphql.json`,
    headers: {
      [Header.ContentType]: DataType.GraphQL.toString(),
      [ShopifyHeader.AccessToken]: session.accessToken,
    },
    data: webhookQuery,
  }).toMatchMadeHttpRequest();
}
