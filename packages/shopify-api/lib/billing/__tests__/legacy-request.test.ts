import {queueMockResponses} from '../../__tests__/test-helper';
import {testConfig} from '../../__tests__/test-config';
import {Session} from '../../session/session';
import {BillingError} from '../../error';
import {
  LATEST_API_VERSION,
  BillingInterval,
  BillingReplacementBehavior,
} from '../../types';
import {BillingConfig} from '../types';
import {shopifyApi} from '../..';

import * as Responses from './responses';

const DOMAIN = 'test-shop.myshopify.io';
const ACCESS_TOKEN = 'access-token';
const GRAPHQL_BASE_REQUEST = {
  method: 'POST',
  domain: DOMAIN,
  path: `/admin/api/${LATEST_API_VERSION}/graphql.json`,
  headers: {'X-Shopify-Access-Token': ACCESS_TOKEN},
};

interface TestConfigInterface {
  name: string;
  billingConfig: BillingConfig | BillingConfig<{v10_lineItemBilling: false}>;
  paymentResponse: string;
  responseObject: any;
  errorResponse: string;
  mutationName: string;
}

const TEST_CONFIGS: TestConfigInterface[] = [
  {
    name: 'non-recurring config',
    billingConfig: {
      [Responses.PLAN_1]: {
        amount: 5,
        currencyCode: 'USD',
        interval: BillingInterval.OneTime,
      },
      [Responses.PLAN_2]: {
        amount: 10,
        currencyCode: 'USD',
        interval: BillingInterval.OneTime,
      },
    },
    paymentResponse: Responses.PURCHASE_ONE_TIME_RESPONSE,
    responseObject: JSON.parse(Responses.PURCHASE_ONE_TIME_RESPONSE).data
      .appPurchaseOneTimeCreate,
    errorResponse: Responses.PURCHASE_ONE_TIME_RESPONSE_WITH_USER_ERRORS,
    mutationName: 'appPurchaseOneTimeCreate',
  },
  {
    name: 'recurring config',
    billingConfig: {
      [Responses.PLAN_1]: {
        amount: 5,
        currencyCode: 'USD',
        interval: BillingInterval.Every30Days,
      },
      [Responses.PLAN_2]: {
        amount: 10,
        currencyCode: 'USD',
        interval: BillingInterval.Annual,
      },
    },
    paymentResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE,
    responseObject: JSON.parse(Responses.PURCHASE_SUBSCRIPTION_RESPONSE).data
      .appSubscriptionCreate,
    errorResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS,
    mutationName: 'appSubscriptionCreate',
  },
  {
    name: 'usage config',
    billingConfig: {
      [Responses.PLAN_1]: {
        amount: 5,
        currencyCode: 'USD',
        usageTerms: '1 dollar per click',
        interval: BillingInterval.Usage,
      },
      [Responses.PLAN_2]: {
        amount: 10,
        currencyCode: 'USD',
        usageTerms: '1 dollar per email',
        interval: BillingInterval.Usage,
      },
    },
    paymentResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE,
    responseObject: JSON.parse(Responses.PURCHASE_SUBSCRIPTION_RESPONSE).data
      .appSubscriptionCreate,
    errorResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS,
    mutationName: 'appSubscriptionCreate',
  },
];

const SUBSCRIPTION_TEST_CONFIGS: TestConfigInterface[] = [
  {
    name: 'Legacy - can request subscription with extra fields',
    billingConfig: {
      [Responses.PLAN_1]: {
        amount: 5,
        currencyCode: 'USD',
        interval: BillingInterval.Every30Days,
        replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
        trialDays: 10,
      },
    },
    paymentResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE,
    responseObject: JSON.parse(Responses.PURCHASE_SUBSCRIPTION_RESPONSE).data
      .appSubscriptionCreate,
    errorResponse: '',
    mutationName: 'appSubscriptionCreate',
  },
  {
    name: 'Legacy - can request subscription with discount amount fields',
    billingConfig: {
      [Responses.PLAN_1]: {
        amount: 5,
        currencyCode: 'USD',
        interval: BillingInterval.Every30Days,
        replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
        trialDays: 10,
        discount: {
          durationLimitInIntervals: 5,
          value: {
            amount: 2,
          },
        },
      },
    },
    paymentResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE,
    responseObject: JSON.parse(Responses.PURCHASE_SUBSCRIPTION_RESPONSE).data
      .appSubscriptionCreate,
    errorResponse: '',
    mutationName: 'appSubscriptionCreate',
  },
  {
    name: 'Legacy - can request subscription with discount percentage fields',
    billingConfig: {
      [Responses.PLAN_1]: {
        amount: 5,
        currencyCode: 'USD',
        interval: BillingInterval.Every30Days,
        replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
        trialDays: 10,
        discount: {
          durationLimitInIntervals: 5,
          value: {
            percentage: 0.2,
          },
        },
      },
    },
    paymentResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE,
    responseObject: JSON.parse(Responses.PURCHASE_SUBSCRIPTION_RESPONSE).data
      .appSubscriptionCreate,
    errorResponse: '',
    mutationName: 'appSubscriptionCreate',
  },
  {
    name: 'Legacy - can request usage subscription with extra fields',
    billingConfig: {
      [Responses.PLAN_1]: {
        amount: 5,
        currencyCode: 'USD',
        interval: BillingInterval.Usage,
        replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
        trialDays: 10,
        usageTerms: '1 dollar per click',
      },
    },
    paymentResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE,
    responseObject: JSON.parse(Responses.PURCHASE_SUBSCRIPTION_RESPONSE).data
      .appSubscriptionCreate,
    errorResponse: '',
    mutationName: 'appSubscriptionCreate',
  },
];

describe('shopify.billing.request', () => {
  const session = new Session({
    id: '1234',
    shop: DOMAIN,
    state: '1234',
    isOnline: true,
    accessToken: ACCESS_TOKEN,
    scope: 'write_products',
  });

  describe('with no billing config', () => {
    test('throws error', async () => {
      const shopify = shopifyApi(
        testConfig({
          billing: undefined,
          future: {
            v10_lineItemBilling: false,
          },
        }),
      );

      expect(() =>
        shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
          isTest: true,
        }),
      ).rejects.toThrowError(BillingError);
    });
  });

  [true, false].forEach((returnObject) => {
    describe(`returning ${
      returnObject ? 'response object' : 'confirmationUrl'
    }`, () => {
      TEST_CONFIGS.forEach((config) => {
        describe(`with ${config.name}`, () => {
          [true, false].forEach((isTest) =>
            test(`Legacy - can request payment (isTest: ${isTest})`, async () => {
              const shopify = shopifyApi(
                testConfig({
                  billing: config.billingConfig,
                  future: {
                    v10_lineItemBilling: false,
                  },
                }),
              );

              queueMockResponses([config.paymentResponse]);

              const response = await shopify.billing.request({
                session,
                plan: Responses.PLAN_1,
                isTest,
                returnObject,
              });

              if (returnObject) {
                expect(response).toStrictEqual(config.responseObject);
              } else {
                expect(response).toBe(Responses.CONFIRMATION_URL);
              }
              expect({
                ...GRAPHQL_BASE_REQUEST,
                data: {
                  query: expect.stringContaining(config.mutationName),
                  variables: expect.objectContaining({
                    test: isTest,
                    returnUrl: `https://test_host_name?shop=${DOMAIN}`,
                  }),
                },
              }).toMatchMadeHttpRequest();
            }),
          );

          test(`Legacy - can request payment with returnUrl param`, async () => {
            const shopify = shopifyApi(
              testConfig({
                billing: config.billingConfig,
                future: {
                  v10_lineItemBilling: false,
                },
              }),
            );

            queueMockResponses([config.paymentResponse]);

            const response = await shopify.billing.request({
              session,
              plan: Responses.PLAN_1,
              isTest: true,
              returnUrl: 'https://example.com',
              returnObject,
            });

            if (returnObject) {
              expect(response).toStrictEqual(config.responseObject);
            } else {
              expect(response).toBe(Responses.CONFIRMATION_URL);
            }
            expect({
              ...GRAPHQL_BASE_REQUEST,
              data: {
                query: expect.stringContaining(config.mutationName),
                variables: expect.objectContaining({
                  test: true,
                  returnUrl: 'https://example.com',
                }),
              },
            }).toMatchMadeHttpRequest();
          });

          test('Legacy - defaults to test purchases', async () => {
            const shopify = shopifyApi(
              testConfig({
                billing: config.billingConfig,
                future: {
                  v10_lineItemBilling: false,
                },
              }),
            );

            queueMockResponses([config.paymentResponse]);

            const response = await shopify.billing.request({
              session,
              plan: Responses.PLAN_1,
              returnObject,
            });

            if (returnObject) {
              expect(response).toStrictEqual(config.responseObject);
            } else {
              expect(response).toBe(Responses.CONFIRMATION_URL);
            }
            expect({
              ...GRAPHQL_BASE_REQUEST,
              data: {
                query: expect.stringContaining(config.mutationName),
                variables: expect.objectContaining({test: true}),
              },
            }).toMatchMadeHttpRequest();
          });

          test('Legacy - can request multiple plans', async () => {
            const shopify = shopifyApi(
              testConfig({
                billing: config.billingConfig,
                future: {
                  v10_lineItemBilling: false,
                },
              }),
            );

            queueMockResponses(
              [config.paymentResponse],
              [config.paymentResponse],
            );

            const response1 = await shopify.billing.request({
              session,
              plan: Responses.PLAN_1,
              returnObject,
            });

            if (returnObject) {
              expect(response1).toStrictEqual(config.responseObject);
            } else {
              expect(response1).toBe(Responses.CONFIRMATION_URL);
            }
            expect({
              ...GRAPHQL_BASE_REQUEST,
              data: {
                query: expect.stringContaining(config.mutationName),
                variables: expect.objectContaining({
                  name: Responses.PLAN_1,
                }),
              },
            }).toMatchMadeHttpRequest();

            const response2 = await shopify.billing.request({
              session,
              plan: Responses.PLAN_2,
              returnObject,
            });

            if (returnObject) {
              expect(response2).toStrictEqual(config.responseObject);
            } else {
              expect(response2).toBe(Responses.CONFIRMATION_URL);
            }
            expect({
              ...GRAPHQL_BASE_REQUEST,
              data: {
                query: expect.stringContaining(config.mutationName),
                variables: expect.objectContaining({
                  name: Responses.PLAN_2,
                }),
              },
            }).toMatchMadeHttpRequest();
          });

          test('Legacy - throws on userErrors', async () => {
            const shopify = shopifyApi(
              testConfig({
                billing: config.billingConfig,
                future: {
                  v10_lineItemBilling: false,
                },
              }),
            );

            queueMockResponses([config.errorResponse]);

            await expect(() =>
              shopify.billing.request({
                session,
                plan: Responses.PLAN_1,
                isTest: true,
                returnObject,
              }),
            ).rejects.toThrow(BillingError);

            expect({
              ...GRAPHQL_BASE_REQUEST,
              data: expect.stringContaining(config.mutationName),
            }).toMatchMadeHttpRequest();
          });
        });
      });

      SUBSCRIPTION_TEST_CONFIGS.forEach((config) => {
        describe(`Legacy - subscription tests`, () => {
          test(`${config.name}`, async () => {
            const shopify = shopifyApi(
              testConfig({
                billing: config.billingConfig,
                future: {
                  v10_lineItemBilling: false,
                },
              }),
            );

            queueMockResponses([config.paymentResponse]);

            const response = await shopify.billing.request({
              session,
              plan: Responses.PLAN_1,
              returnObject,
            });

            if (returnObject) {
              expect(response).toStrictEqual(config.responseObject);
            } else {
              expect(response).toBe(Responses.CONFIRMATION_URL);
            }
            expect({
              ...GRAPHQL_BASE_REQUEST,
              data: {
                query: expect.stringContaining(config.mutationName),
                variables: expect.objectContaining({
                  trialDays: 10,
                  replacementBehavior:
                    BillingReplacementBehavior.ApplyImmediately,
                }),
              },
            }).toMatchMadeHttpRequest();
          });
        });
      });
    });
  });

  describe('Legacy - billing config overrides', () => {
    it.each([
      {field: 'trialDays', value: 20, expected: '"trialDays":20'},
      {field: 'amount', value: 10, expected: '"amount":10'},
      {field: 'currencyCode', value: 'CAD', expected: '"currencyCode":"CAD"'},
      {
        field: 'replacementBehavior',
        value: BillingReplacementBehavior.ApplyImmediately,
        expected: '"replacementBehavior":"APPLY_IMMEDIATELY"',
      },
      {
        field: 'usageTerms',
        value: 'Different usage terms',
        expected: '"terms":"Different usage terms"',
      },
      {
        field: 'discount',
        value: {durationLimitInIntervals: 10, value: {amount: 2}},
        expected:
          '"discount":{"durationLimitInIntervals":10,"value":{"amount":2}}',
      },
    ])('applies $field override when set', async ({field, value, expected}) => {
      const shopify = shopifyApi(
        testConfig({
          billing: {
            [Responses.PLAN_1]: {
              interval: BillingInterval.Every30Days,
              amount: 5,
              currencyCode: 'USD',
              replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
              discount: {durationLimitInIntervals: 5, value: {amount: 2}},
              trialDays: 10,
              [field]: value,
            },
            [Responses.PLAN_2]: {
              interval: BillingInterval.Usage,
              amount: 5,
              currencyCode: 'USD',
              replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
              usageTerms: 'Usage terms',
              trialDays: 10,
              [field]: value,
            },
          },
          future: {
            v10_lineItemBilling: false,
          },
        }),
      );

      queueMockResponses([Responses.PURCHASE_SUBSCRIPTION_RESPONSE]);

      await shopify.billing.request({
        session,
        plan: field === 'usageTerms' ? Responses.PLAN_2 : Responses.PLAN_1,
        returnObject: true,
        [field]: value,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining(expected),
      }).toMatchMadeHttpRequest();
    });

    it('applies a trialDays override of 0', async () => {
      const shopify = shopifyApi(
        testConfig({
          billing: {
            [Responses.PLAN_1]: {
              amount: 5,
              currencyCode: 'USD',
              interval: BillingInterval.Every30Days,
              replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
              trialDays: 10,
            },
          },
          future: {
            v10_lineItemBilling: false,
          },
        }),
      );

      queueMockResponses([Responses.PURCHASE_SUBSCRIPTION_RESPONSE]);

      await shopify.billing.request({
        session,
        plan: Responses.PLAN_1,
        returnObject: true,
        trialDays: 0,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('appSubscriptionCreate'),
          variables: expect.objectContaining({
            trialDays: 0,
          }),
        },
      }).toMatchMadeHttpRequest();
    });

    it("ignores overrides if they're undefined", async () => {
      const shopify = shopifyApi(
        testConfig({
          billing: {
            [Responses.PLAN_1]: {
              amount: 5,
              currencyCode: 'USD',
              interval: BillingInterval.Every30Days,
              replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
              trialDays: 10,
            },
          },
          future: {
            v10_lineItemBilling: false,
          },
        }),
      );

      queueMockResponses([Responses.PURCHASE_SUBSCRIPTION_RESPONSE]);

      await shopify.billing.request({
        session,
        plan: Responses.PLAN_1,
        returnObject: true,
        trialDays: undefined,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('appSubscriptionCreate'),
          variables: expect.objectContaining({
            trialDays: 10,
          }),
        },
      }).toMatchMadeHttpRequest();
    });
  });
});
