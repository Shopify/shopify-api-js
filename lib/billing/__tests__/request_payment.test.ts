import {testConfig, queueMockResponses} from '../../__tests__/test-helper';
import {Session} from '../../session/session';
import {BillingError} from '../../error';
import {LATEST_API_VERSION, Shopify, BillingInterval} from '../../base-types';
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

let shopify: Shopify;

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

  describe('with non-recurring config', () => {
    beforeEach(() => {
      shopify = shopifyApi({
        ...testConfig,
        billing: {
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
      });
    });

    [true, false].forEach((isTest) =>
      test(`can request a one-time payment (isTest: ${isTest})`, async () => {
        queueMockResponses([Responses.PURCHASE_ONE_TIME_RESPONSE]);

        const response = await shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
          isTest,
        });

        expect(response).toBe(Responses.CONFIRMATION_URL);
        expect({
          ...GRAPHQL_BASE_REQUEST,
          data: {
            query: expect.stringContaining('appPurchaseOneTimeCreate'),
            variables: expect.objectContaining({test: isTest}),
          },
        }).toMatchMadeHttpRequest();
      }),
    );

    test('defaults to test purchases', async () => {
      queueMockResponses([Responses.PURCHASE_ONE_TIME_RESPONSE]);

      const response = await shopify.billing.request({
        session,
        plan: Responses.PLAN_1,
      });

      expect(response).toBe(Responses.CONFIRMATION_URL);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('appPurchaseOneTimeCreate'),
          variables: expect.objectContaining({test: true}),
        },
      }).toMatchMadeHttpRequest();
    });

    test('can request multiple plans', async () => {
      queueMockResponses(
        [Responses.PURCHASE_ONE_TIME_RESPONSE],
        [Responses.PURCHASE_ONE_TIME_RESPONSE],
      );

      const response1 = await shopify.billing.request({
        session,
        plan: Responses.PLAN_1,
      });

      expect(response1).toBe(Responses.CONFIRMATION_URL);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('appPurchaseOneTimeCreate'),
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
          query: expect.stringContaining('appPurchaseOneTimeCreate'),
          variables: expect.objectContaining({
            name: Responses.PLAN_2,
          }),
        },
      }).toMatchMadeHttpRequest();
    });

    test('throws on userErrors', async () => {
      queueMockResponses([
        Responses.PURCHASE_ONE_TIME_RESPONSE_WITH_USER_ERRORS,
      ]);

      await expect(() =>
        shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
          isTest: true,
        }),
      ).rejects.toThrow(BillingError);

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('appPurchaseOneTimeCreate'),
      }).toMatchMadeHttpRequest();
    });
  });

  describe('with recurring config', () => {
    beforeEach(() => {
      shopify = shopifyApi({
        ...testConfig,
        billing: {
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
      });
    });

    [true, false].forEach((isTest) =>
      test(`can request a subscription (isTest: ${isTest})`, async () => {
        queueMockResponses([Responses.PURCHASE_SUBSCRIPTION_RESPONSE]);

        const response = await shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
          isTest,
        });

        expect(response).toBe(Responses.CONFIRMATION_URL);
        expect({
          ...GRAPHQL_BASE_REQUEST,
          data: {
            query: expect.stringContaining('appSubscriptionCreate'),
            variables: expect.objectContaining({test: isTest}),
          },
        }).toMatchMadeHttpRequest();
      }),
    );

    test('defaults to test purchases', async () => {
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
          variables: expect.objectContaining({test: true}),
        },
      }).toMatchMadeHttpRequest();
    });

    test('throws on userErrors', async () => {
      queueMockResponses([
        Responses.PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS,
      ]);

      await expect(() =>
        shopify.billing.request({
          session,
          plan: Responses.PLAN_1,
          isTest: true,
        }),
      ).rejects.toThrow(BillingError);

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('appSubscriptionCreate'),
      }).toMatchMadeHttpRequest();
    });

    test('can request multiple plans', async () => {
      queueMockResponses(
        [Responses.PURCHASE_SUBSCRIPTION_RESPONSE],
        [Responses.PURCHASE_SUBSCRIPTION_RESPONSE],
      );

      const response1 = await shopify.billing.request({
        session,
        plan: Responses.PLAN_1,
      });

      expect(response1).toBe(Responses.CONFIRMATION_URL);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('appSubscriptionCreate'),
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
          query: expect.stringContaining('appSubscriptionCreate'),
          variables: expect.objectContaining({
            name: Responses.PLAN_2,
          }),
        },
      }).toMatchMadeHttpRequest();
    });
  });
});
