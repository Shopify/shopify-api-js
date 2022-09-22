import {testConfig, queueMockResponses} from '../../__tests__/test-helper';
import {Session} from '../../session/session';
import {BillingError} from '../../error';
import {LATEST_API_VERSION, Shopify, BillingInterval} from '../../base-types';
import {shopifyApi} from '../..';

import * as CheckResponses from './check_responses';

const DOMAIN = 'test-shop.myshopify.io';
const ACCESS_TOKEN = 'access-token';
const GRAPHQL_BASE_REQUEST = {
  method: 'POST',
  domain: DOMAIN,
  path: `/admin/api/${LATEST_API_VERSION}/graphql.json`,
  headers: {'X-Shopify-Access-Token': ACCESS_TOKEN},
};

let shopify: Shopify;

describe('check', () => {
  const session = new Session({
    id: '1234',
    shop: DOMAIN,
    state: '1234',
    isOnline: true,
    accessToken: ACCESS_TOKEN,
    scope: 'write_products',
  });

  describe('with non-recurring config', () => {
    beforeEach(() => {
      shopify = shopifyApi({
        ...testConfig,
        billing: {
          amount: 5,
          chargeName: CheckResponses.TEST_CHARGE_NAME,
          currencyCode: 'USD',
          interval: BillingInterval.OneTime,
        },
      });
    });

    [true, false].forEach((isTest) =>
      test(`requests a single payment if there is none (isTest: ${isTest})`, async () => {
        queueMockResponses(
          [CheckResponses.EMPTY_SUBSCRIPTIONS],
          [CheckResponses.PURCHASE_ONE_TIME_RESPONSE],
        );

        const response = await shopify.billing.check({
          session,
          isTest,
        });

        expect(response).toEqual({
          hasPayment: false,
          confirmBillingUrl: CheckResponses.CONFIRMATION_URL,
        });

        expect({
          ...GRAPHQL_BASE_REQUEST,
          data: expect.stringContaining('oneTimePurchases'),
        }).toMatchMadeHttpRequest();
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
      queueMockResponses(
        [CheckResponses.EMPTY_SUBSCRIPTIONS],
        [CheckResponses.PURCHASE_ONE_TIME_RESPONSE],
      );

      const response = await shopify.billing.check({session});

      expect(response).toEqual({
        hasPayment: false,
        confirmBillingUrl: CheckResponses.CONFIRMATION_URL,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('appPurchaseOneTimeCreate'),
          variables: expect.objectContaining({test: true}),
        },
      }).toMatchMadeHttpRequest();
    });

    test('does not request payment if there is one', async () => {
      queueMockResponses([CheckResponses.EXISTING_ONE_TIME_PAYMENT]);

      const response = await shopify.billing.check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: true,
        confirmBillingUrl: undefined,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
    });

    test('ignores non-active payments', async () => {
      queueMockResponses(
        [CheckResponses.EXISTING_INACTIVE_ONE_TIME_PAYMENT],
        [CheckResponses.PURCHASE_ONE_TIME_RESPONSE],
      );

      const response = await shopify.billing.check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: false,
        confirmBillingUrl: CheckResponses.CONFIRMATION_URL,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('appPurchaseOneTimeCreate'),
      }).toMatchMadeHttpRequest();
    });

    test('paginates until a payment is found', async () => {
      queueMockResponses(
        [CheckResponses.EXISTING_ONE_TIME_PAYMENT_WITH_PAGINATION[0]],
        [CheckResponses.EXISTING_ONE_TIME_PAYMENT_WITH_PAGINATION[1]],
      );

      const response = await shopify.billing.check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: true,
        confirmBillingUrl: undefined,
      });

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

    test('throws on userErrors', async () => {
      queueMockResponses(
        [CheckResponses.EMPTY_SUBSCRIPTIONS],
        [CheckResponses.PURCHASE_ONE_TIME_RESPONSE_WITH_USER_ERRORS],
      );

      await expect(() =>
        shopify.billing.check({
          session,
          isTest: true,
        }),
      ).rejects.toThrow(BillingError);

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('oneTimePurchases'),
      }).toMatchMadeHttpRequest();
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
          amount: 5,
          chargeName: CheckResponses.TEST_CHARGE_NAME,
          currencyCode: 'USD',
          interval: BillingInterval.Every30Days,
        },
      });
    });

    [true, false].forEach((isTest) =>
      test(`requests a subscription if there is none (isTest: ${isTest})`, async () => {
        queueMockResponses(
          [CheckResponses.EMPTY_SUBSCRIPTIONS],
          [CheckResponses.PURCHASE_SUBSCRIPTION_RESPONSE],
        );

        const response = await shopify.billing.check({
          session,
          isTest,
        });

        expect(response).toEqual({
          hasPayment: false,
          confirmBillingUrl: CheckResponses.CONFIRMATION_URL,
        });

        expect({
          ...GRAPHQL_BASE_REQUEST,
          data: expect.stringContaining('activeSubscriptions'),
        }).toMatchMadeHttpRequest();
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
      queueMockResponses(
        [CheckResponses.EMPTY_SUBSCRIPTIONS],
        [CheckResponses.PURCHASE_SUBSCRIPTION_RESPONSE],
      );

      const response = await shopify.billing.check({session});

      expect(response).toEqual({
        hasPayment: false,
        confirmBillingUrl: CheckResponses.CONFIRMATION_URL,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('activeSubscriptions'),
      }).toMatchMadeHttpRequest();
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: {
          query: expect.stringContaining('appSubscriptionCreate'),
          variables: expect.objectContaining({test: true}),
        },
      }).toMatchMadeHttpRequest();
    });

    test('does not request subscription if there is one', async () => {
      queueMockResponses([CheckResponses.EXISTING_SUBSCRIPTION]);

      const response = await shopify.billing.check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: true,
        confirmBillingUrl: undefined,
      });

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('activeSubscriptions'),
      }).toMatchMadeHttpRequest();
    });

    test('throws on userErrors', async () => {
      queueMockResponses(
        [CheckResponses.EMPTY_SUBSCRIPTIONS],
        [CheckResponses.PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS],
      );

      await expect(() =>
        shopify.billing.check({
          session,
          isTest: true,
        }),
      ).rejects.toThrow(BillingError);

      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('activeSubscriptions'),
      }).toMatchMadeHttpRequest();
      expect({
        ...GRAPHQL_BASE_REQUEST,
        data: expect.stringContaining('appSubscriptionCreate'),
      }).toMatchMadeHttpRequest();
    });
  });
});
