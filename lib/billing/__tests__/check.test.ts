import {testConfig, queueMockResponses} from '../../__tests__/test-helper';
import {Session} from '../../session/session';
import {LATEST_API_VERSION, BillingInterval} from '../../types';
import {BillingError} from '../../error';
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

describe('shopify.billing.check', () => {
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
        shopify.billing.check({
          session,
          plans: Responses.ALL_PLANS,
          isTest: true,
        }),
      ).rejects.toThrowError(BillingError);
    });
  });

  describe('with non-recurring configs', () => {
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

    test(`handles empty responses`, async () => {
      queueMockResponses([Responses.EMPTY_SUBSCRIPTIONS]);

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
        isTest: true,
      });

      expect(response).toBe(false);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
    });

    test(`returns false if non-test and only test purchases are returned`, async () => {
      queueMockResponses([Responses.EXISTING_ONE_TIME_PAYMENT]);

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
        isTest: false,
      });

      expect(response).toBe(false);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
    });

    test(`returns false if purchase is for a different plan`, async () => {
      queueMockResponses([Responses.EXISTING_ONE_TIME_PAYMENT]);

      const response = await shopify.billing.check({
        session,
        plans: [Responses.PLAN_2],
        isTest: false,
      });

      expect(response).toBe(false);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
    });

    test('defaults to test purchases', async () => {
      queueMockResponses([Responses.EXISTING_ONE_TIME_PAYMENT]);

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
      });

      expect(response).toBe(true);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
    });

    test('ignores non-active payments', async () => {
      queueMockResponses([Responses.EXISTING_INACTIVE_ONE_TIME_PAYMENT]);

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
        isTest: true,
      });

      expect(response).toBe(false);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
    });

    test('paginates until a payment is found', async () => {
      queueMockResponses(
        [Responses.EXISTING_ONE_TIME_PAYMENT_WITH_PAGINATION[0]],
        [Responses.EXISTING_ONE_TIME_PAYMENT_WITH_PAGINATION[1]],
      );

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
        isTest: true,
      });

      expect(response).toBe(true);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('oneTimePurchases'),
          variables: expect.objectContaining({endCursor: null}),
        },
      }).toMatchMadeHttpRequest();
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('oneTimePurchases'),
          variables: expect.objectContaining({endCursor: 'end_cursor'}),
        },
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

    test(`handles empty responses`, async () => {
      queueMockResponses([Responses.EMPTY_SUBSCRIPTIONS]);

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
        isTest: true,
      });

      expect(response).toBe(false);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('activeSubscriptions'),
      }).toMatchMadeHttpRequest();
    });

    test(`returns false if non-test and only test purchases are returned`, async () => {
      queueMockResponses([Responses.EXISTING_SUBSCRIPTION]);

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
        isTest: false,
      });

      expect(response).toBe(false);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('activeSubscriptions'),
      }).toMatchMadeHttpRequest();
    });

    test(`returns false if purchase is for a different plan`, async () => {
      queueMockResponses([Responses.EXISTING_SUBSCRIPTION]);

      const response = await shopify.billing.check({
        session,
        plans: [Responses.PLAN_2],
        isTest: false,
      });

      expect(response).toBe(false);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('activeSubscriptions'),
      }).toMatchMadeHttpRequest();
    });

    test('defaults to test purchases', async () => {
      queueMockResponses([Responses.EXISTING_SUBSCRIPTION]);

      const response = await shopify.billing.check({
        session,
        plans: Responses.ALL_PLANS,
      });

      expect(response).toBe(true);
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('activeSubscriptions'),
      }).toMatchMadeHttpRequest();
    });
  });
});
