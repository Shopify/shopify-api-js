export const TEST_CHARGE_NAME = 'Shopify app test billing';
export const CONFIRMATION_URL = 'totally-real-url';

export const EMPTY_SUBSCRIPTIONS = JSON.stringify({
  data: {
    currentAppInstallation: {
      oneTimePurchases: {
        edges: [],
        pageInfo: {hasNextPage: false, endCursor: null},
      },
      activeSubscriptions: [],
      userErrors: [],
    },
  },
});

export const EXISTING_ONE_TIME_PAYMENT = JSON.stringify({
  data: {
    currentAppInstallation: {
      oneTimePurchases: {
        edges: [
          {
            node: {name: TEST_CHARGE_NAME, test: true, status: 'ACTIVE'},
          },
        ],
        pageInfo: {hasNextPage: false, endCursor: null},
      },
      activeSubscriptions: [],
    },
  },
});

export const EXISTING_ONE_TIME_PAYMENT_WITH_PAGINATION = [
  JSON.stringify({
    data: {
      currentAppInstallation: {
        oneTimePurchases: {
          edges: [
            {
              node: {name: 'some_other_name', test: true, status: 'ACTIVE'},
            },
          ],
          pageInfo: {hasNextPage: true, endCursor: 'end_cursor'},
        },
        activeSubscriptions: [],
      },
    },
  }),
  JSON.stringify({
    data: {
      currentAppInstallation: {
        oneTimePurchases: {
          edges: [
            {
              node: {
                name: TEST_CHARGE_NAME,
                test: true,
                status: 'ACTIVE',
              },
            },
          ],
          pageInfo: {hasNextPage: false, endCursor: null},
        },
        activeSubscriptions: [],
      },
    },
  }),
];

export const EXISTING_INACTIVE_ONE_TIME_PAYMENT = JSON.stringify({
  data: {
    currentAppInstallation: {
      oneTimePurchases: {
        edges: [
          {
            node: {
              name: TEST_CHARGE_NAME,
              test: true,
              status: 'PENDING',
            },
          },
        ],
        pageInfo: {hasNextPage: false, endCursor: null},
      },
      activeSubscriptions: [],
    },
  },
});

export const EXISTING_SUBSCRIPTION = JSON.stringify({
  data: {
    currentAppInstallation: {
      oneTimePurchases: {
        edges: [],
        pageInfo: {hasNextPage: false, endCursor: null},
      },
      activeSubscriptions: [{name: TEST_CHARGE_NAME, test: true}],
    },
  },
});

export const PURCHASE_ONE_TIME_RESPONSE = JSON.stringify({
  data: {
    appPurchaseOneTimeCreate: {
      confirmationUrl: CONFIRMATION_URL,
      userErrors: [],
    },
  },
});

export const PURCHASE_SUBSCRIPTION_RESPONSE = JSON.stringify({
  data: {
    appSubscriptionCreate: {
      confirmationUrl: CONFIRMATION_URL,
      userErrors: [],
    },
  },
});

export const PURCHASE_ONE_TIME_RESPONSE_WITH_USER_ERRORS = JSON.stringify({
  data: {
    appPurchaseOneTimeCreate: {
      confirmationUrl: CONFIRMATION_URL,
      userErrors: ['Oops, something went wrong'],
    },
  },
});

export const PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS = JSON.stringify({
  data: {
    appSubscriptionCreate: {
      confirmationUrl: CONFIRMATION_URL,
      userErrors: ['Oops, something went wrong'],
    },
  },
});
