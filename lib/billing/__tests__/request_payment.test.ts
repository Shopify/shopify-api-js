import {testConfig, queueMockResponses} from '../../__tests__/test-helper';
import {Session} from '../../session/session';
import {BillingError} from '../../error';
import {
  LATEST_API_VERSION,
  BillingInterval,
  BillingReplacementBehavior,
} from '../../types';
import {BillingConfig} from '../types';
import {shopifyApi, Shopify} from '../..';

import * as Responses from './responses';

const DOMAIN = 'test-shop.myshopify.io';
const ACCESS_TOKEN = 'access-token';
const GRAPHQL_BASE_REQUEST = {
  method: 'POST',
  domain: DOMAIN,
  path: `/admin/api/${LATEST_API_VERSION}/graphql.json`,
  headers: {'X-Shopify-Access-Token': ACCESS_TOKEN},
};

let shopify: Shopify;

interface TestConfigInterface {
  name: string;
  billingConfig: BillingConfig;
  paymentResponse: string;
  errorResponse: string;
  mutationName: string;
}

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
    beforeEach(() => {
      shopify = shopifyApi({
        ...testConfig,
        billing: undefined,
      });
    });

    test('throws error', async () => {
      expect(() =>
        shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
          isTest: true,
        }),
      ).rejects.toThrowError(BillingError);
    });
  });

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
      errorResponse: Responses.PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS,
      mutationName: 'appSubscriptionCreate',
    },
  ];

  TEST_CONFIGS.forEach((config) => {
    describe(`with ${config.name}`, () => {
      beforeEach(() => {
        shopify = shopifyApi({
          ...testConfig,
          billing: config.billingConfig,
        });
      });

      [true, false].forEach((isTest) =>
        test(`can request payment (isTest: ${isTest})`, async () => {
          queueMockResponses([config.paymentResponse]);

          const response = await shopify.billing.request({
            session,
            plan: Responses.PLAN_1,
            isTest,
          });

          expect(response).toBe(Responses.CONFIRMATION_URL);
          expect({
            ...GRAPHQL_BASE_REQUEST,
            data: {
              query: expect.stringContaining(config.mutationName),
              variables: expect.objectContaining({test: isTest}),
            },
          }).toMatchMadeHttpRequest();
        }),
      );

      test('defaults to test purchases', async () => {
        queueMockResponses([config.paymentResponse]);

        const response = await shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
        });

        expect(response).toBe(Responses.CONFIRMATION_URL);
        expect({
          ...GRAPHQL_BASE_REQUEST,
          data: {
            query: expect.stringContaining(config.mutationName),
            variables: expect.objectContaining({test: true}),
          },
        }).toMatchMadeHttpRequest();
      });

      test('can request multiple plans', async () => {
        queueMockResponses([config.paymentResponse], [config.paymentResponse]);

        const response1 = await shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
        });

        expect(response1).toBe(Responses.CONFIRMATION_URL);
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
        });

        expect(response2).toBe(Responses.CONFIRMATION_URL);
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

      test('throws on userErrors', async () => {
        queueMockResponses([config.errorResponse]);

        await expect(() =>
          shopify.billing.request({
            session,
            plan: Responses.PLAN_1,
            isTest: true,
          }),
        ).rejects.toThrow(BillingError);

        expect({
          ...GRAPHQL_BASE_REQUEST,
          data: expect.stringContaining(config.mutationName),
        }).toMatchMadeHttpRequest();
      });
    });
  });

  test('can request subscription with extra fields', async () => {
    shopify = shopifyApi({
      ...testConfig,
      billing: {
        [Responses.PLAN_1]: {
          amount: 5,
          currencyCode: 'USD',
          interval: BillingInterval.Every30Days,
          replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
          trialDays: 10,
        },
      },
    });

    queueMockResponses([Responses.PURCHASE_SUBSCRIPTION_RESPONSE]);

    const response = await shopify.billing.request({
      session,
      plan: Responses.PLAN_1,
    });

    expect(response).toBe(Responses.CONFIRMATION_URL);
    expect({
      ...GRAPHQL_BASE_REQUEST,
      data: {
        query: expect.stringContaining('appSubscriptionCreate'),
        variables: expect.objectContaining({
          trialDays: 10,
          replacementBehavior: BillingReplacementBehavior.ApplyImmediately,
        }),
      },
    }).toMatchMadeHttpRequest();
  });
});
