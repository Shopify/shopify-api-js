export const PLAN_1 = 'Shopify app plan 1';
export const PLAN_2 = 'Shopify app plan 2';
export const PLAN_3 = 'Shopify app plan 3';
export const ALL_PLANS = [PLAN_1, PLAN_2, PLAN_3];

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
            node: {name: PLAN_1, test: true, status: 'ACTIVE'},
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
                name: PLAN_1,
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
              name: PLAN_1,
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

export const EXISTING_SUBSCRIPTION_OBJECT = {
  data: {
    currentAppInstallation: {
      oneTimePurchases: {
        edges: [],
        pageInfo: {hasNextPage: false, endCursor: null},
      },
      activeSubscriptions: [{id: 'gid://123', name: PLAN_1, test: true}],
    },
  },
};

export const EXISTING_ONE_TIME_PAYMENTS_WITH_PAGINATION_AND_SUBSCRIPTION = [
  JSON.stringify({
    data: {
      currentAppInstallation: {
        oneTimePurchases: {
          edges: [
            {
              node: {
                name: PLAN_1,
                id: 'gid://010203',
                test: true,
                status: 'ACTIVE',
              },
            },
            {
              node: {
                name: 'some_other_expired_name',
                id: 'gid://040506',
                test: true,
                status: 'EXPIRED',
              },
            },
          ],
          pageInfo: {hasNextPage: true, endCursor: 'end_cursor'},
        },
        activeSubscriptions: [{id: 'gid://070809', name: PLAN_2, test: true}],
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
                name: PLAN_3,
                id: 'gid://101112',
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

export const EXISTING_SUBSCRIPTION = JSON.stringify(
  EXISTING_SUBSCRIPTION_OBJECT,
);

export const PURCHASE_ONE_TIME_RESPONSE = JSON.stringify({
  data: {
    appPurchaseOneTimeCreate: {
      oneTimePurchase: {
        id: 'gid://123',
        name: PLAN_1,
        test: true,
      },
      confirmationUrl: CONFIRMATION_URL,
      userErrors: [],
    },
  },
});

export const PURCHASE_SUBSCRIPTION_RESPONSE = JSON.stringify({
  data: {
    appSubscriptionCreate: {
      appSubscription: {
        id: 'gid://123',
        name: PLAN_1,
        test: true,
      },
      confirmationUrl: CONFIRMATION_URL,
      userErrors: [],
    },
  },
});

export const PURCHASE_ONE_TIME_RESPONSE_WITH_USER_ERRORS = JSON.stringify({
  data: {
    appPurchaseOneTimeCreate: {
      oneTimePurchase: {
        id: 'gid://123',
        name: PLAN_1,
        test: true,
      },
      confirmationUrl: CONFIRMATION_URL,
      userErrors: ['Oops, something went wrong'],
    },
  },
});

export const PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS = JSON.stringify({
  data: {
    appSubscriptionCreate: {
      appSubscription: {
        id: 'gid://123',
        name: PLAN_1,
        test: true,
      },
      confirmationUrl: CONFIRMATION_URL,
      userErrors: ['Oops, something went wrong'],
    },
  },
});

export const CANCEL_RESPONSE = JSON.stringify({
  data: {
    appSubscriptionCancel: {
      appSubscription: {
        id: 'gid://123',
        name: PLAN_1,
        test: true,
      },
      userErrors: [],
    },
  },
});

export const CANCEL_RESPONSE_WITH_USER_ERRORS = JSON.stringify({
  data: {
    appSubscriptionCancel: {
      appSubscription: {
        id: 'gid://123',
        name: PLAN_1,
        test: true,
      },
      userErrors: ['Oops, something went wrong'],
    },
  },
});

export const CANCEL_RESPONSE_WITH_ERRORS = JSON.stringify({
  data: {
    appSubscriptionCancel: {
      appSubscription: {
        id: 'gid://123',
        name: PLAN_1,
        test: true,
      },
      userErrors: [],
    },
  },
  errors: [{message: 'Oops, something went wrong'}],
});

export const SUBSCRIPTIONS_RESPONSE = JSON.stringify({
  data: {
    currentAppInstallation: {
      activeSubscriptions: [{id: 'gid://123', name: PLAN_1, test: true}],
    },
  },
});
