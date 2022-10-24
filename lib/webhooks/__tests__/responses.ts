export interface MockResponse {
  [key: string]: unknown;
}

export const TEST_WEBHOOK_ID = 'gid://shopify/WebhookSubscription/12345';

export const webhookCheckEmptyResponse = {
  data: {
    webhookSubscriptions: {
      edges: [],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

export const webhookCheckErrorResponse = {
  errors: [
    {
      message:
        "Argument 'topics' on Field 'webhookSubscriptions' has an invalid value (topic). Expected type '[WebhookSubscriptionTopic!]'.",
    },
  ],
};

export const webhookCheckResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: TEST_WEBHOOK_ID,
            topic: 'PRODUCTS_CREATE',
            endpoint: {
              __typename: 'WebhookHttpEndpoint',
              callbackUrl: 'https://test_host_name/webhooks',
            },
          },
        },
      ],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

export const webhookCheckMultiHandlerResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: TEST_WEBHOOK_ID,
            topic: 'PRODUCTS_CREATE',
            endpoint: {
              __typename: 'WebhookHttpEndpoint',
              callbackUrl: 'https://test_host_name/webhooks',
            },
          },
        },
        {
          node: {
            id: `${TEST_WEBHOOK_ID}-2`,
            topic: 'PRODUCTS_UPDATE',
            endpoint: {
              __typename: 'WebhookHttpEndpoint',
              callbackUrl: 'https://test_host_name/webhooks',
            },
          },
        },
      ],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

export const eventBridgeWebhookCheckResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: TEST_WEBHOOK_ID,
            topic: 'PRODUCTS_CREATE',
            endpoint: {
              __typename: 'WebhookEventBridgeEndpoint',
              arn: 'arn:test',
            },
          },
        },
      ],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

export const pubSubWebhookCheckResponse = {
  data: {
    webhookSubscriptions: {
      edges: [
        {
          node: {
            id: TEST_WEBHOOK_ID,
            topic: 'PRODUCTS_CREATE',
            endpoint: {
              __typename: 'WebhookPubSubEndpoint',
              pubSubProject: 'my-project-id',
              pubSubTopic: 'my-topic-id',
            },
          },
        },
      ],
      pageInfo: {
        endCursor: null,
        hasNextPage: false,
      },
    },
  },
};

export const successResponse = {
  data: {
    webhookSubscriptionCreate: {
      userErrors: [],
    },
  },
};

export const eventBridgeSuccessResponse = {
  data: {
    eventBridgeWebhookSubscriptionCreate: {
      userErrors: [],
    },
  },
};

export const pubSubSuccessResponse = {
  data: {
    pubSubWebhookSubscriptionCreate: {
      userErrors: [],
    },
  },
};

export const successUpdateResponse = {
  data: {
    webhookSubscriptionUpdate: {
      userErrors: [],
    },
  },
};

export const eventBridgeSuccessUpdateResponse = {
  data: {
    eventBridgeWebhookSubscriptionUpdate: {
      userErrors: [],
    },
  },
};

export const pubSubSuccessUpdateResponse = {
  data: {
    pubSubWebhookSubscriptionUpdate: {
      userErrors: [],
    },
  },
};

export const successDeleteResponse = {
  data: {
    webhookSubscriptionDelete: {
      userErrors: [],
    },
  },
};

export const failResponse = {
  data: {},
};

export const httpFailResponse = {
  data: {
    webhookSubscriptionCreate: {
      userErrors: ['this is an error'],
    },
  },
};
