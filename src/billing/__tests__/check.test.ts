import {Session} from '../../auth/session/session';
import {Context} from '../../context';
import {BillingError} from '../../error';
import {check} from '../check';
import {BillingInterval} from '../types';

import {
  TEST_CHARGE_NAME,
  CONFIRMATION_URL,
  EMPTY_SUBSCRIPTIONS,
  EXISTING_ONE_TIME_PAYMENT,
  EXISTING_ONE_TIME_PAYMENT_WITH_PAGINATION,
  EXISTING_INACTIVE_ONE_TIME_PAYMENT,
  EXISTING_SUBSCRIPTION,
  PURCHASE_ONE_TIME_RESPONSE,
  PURCHASE_SUBSCRIPTION_RESPONSE,
  PURCHASE_ONE_TIME_RESPONSE_WITH_USER_ERRORS,
  PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS,
} from './check_responses';

describe('check', () => {
  const session = new Session('1234', 'test-shop.myshopify.io', '1234', true);
  session.accessToken = 'access-token';
  session.scope = Context.SCOPES.toString();

  describe('with non-recurring config', () => {
    beforeEach(() => {
      Context.BILLING = {
        amount: 5,
        chargeName: TEST_CHARGE_NAME,
        currencyCode: 'USD',
        interval: BillingInterval.OneTime,
      };
    });

    [true, false].forEach((isTest) =>
      test(`requests a single payment if there is none (isTest: ${isTest})`, async () => {
        fetchMock.mockResponses(
          EMPTY_SUBSCRIPTIONS,
          PURCHASE_ONE_TIME_RESPONSE,
        );

        const response = await check({
          session,
          isTest,
        });

        expect(response).toEqual({
          hasPayment: false,
          confirmBillingUrl: CONFIRMATION_URL,
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          expect.objectContaining({
            body: expect.stringContaining('oneTimePurchases'),
            headers: expect.objectContaining({
              'X-Shopify-Access-Token': session.accessToken,
            }),
          }),
        );

        const parsedBody = JSON.parse(
          fetchMock.mock.calls[1][1]!.body!.toString(),
        );
        expect(parsedBody).toMatchObject({
          query: expect.stringContaining('appPurchaseOneTimeCreate'),
          variables: expect.objectContaining({test: isTest}),
        });
      }),
    );

    test('defaults to test purchases', async () => {
      fetchMock.mockResponses(EMPTY_SUBSCRIPTIONS, PURCHASE_ONE_TIME_RESPONSE);

      const response = await check({session});

      expect(response).toEqual({
        hasPayment: false,
        confirmBillingUrl: CONFIRMATION_URL,
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);

      const parsedBody = JSON.parse(
        fetchMock.mock.calls[1][1]!.body!.toString(),
      );
      expect(parsedBody).toMatchObject({
        query: expect.stringContaining('appPurchaseOneTimeCreate'),
        variables: expect.objectContaining({test: true}),
      });
    });

    test('does not request payment if there is one', async () => {
      fetchMock.mockResponses(EXISTING_ONE_TIME_PAYMENT);

      const response = await check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: true,
        confirmBillingUrl: undefined,
      });
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          body: expect.stringContaining('oneTimePurchases'),
        }),
      );
    });

    test('ignores non-active payments', async () => {
      fetchMock.mockResponses(
        EXISTING_INACTIVE_ONE_TIME_PAYMENT,
        PURCHASE_ONE_TIME_RESPONSE,
      );

      const response = await check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: false,
        confirmBillingUrl: CONFIRMATION_URL,
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          body: expect.stringContaining('oneTimePurchases'),
        }),
      );
      expect(fetchMock).toHaveBeenNthCalledWith(
        2,
        expect.anything(),
        expect.objectContaining({
          body: expect.stringContaining('appPurchaseOneTimeCreate'),
        }),
      );
    });

    test('paginates until a payment is found', async () => {
      fetchMock.mockResponses(...EXISTING_ONE_TIME_PAYMENT_WITH_PAGINATION);

      const response = await check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: true,
        confirmBillingUrl: undefined,
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);

      let parsedBody = JSON.parse(fetchMock.mock.calls[0][1]!.body!.toString());
      expect(parsedBody).toMatchObject({
        query: expect.stringContaining('oneTimePurchases'),
        variables: expect.objectContaining({endCursor: null}),
      });

      parsedBody = JSON.parse(fetchMock.mock.calls[1][1]!.body!.toString());
      expect(parsedBody).toMatchObject({
        query: expect.stringContaining('oneTimePurchases'),
        variables: expect.objectContaining({endCursor: 'end_cursor'}),
      });
    });

    test('throws on userErrors', async () => {
      fetchMock.mockResponses(
        EMPTY_SUBSCRIPTIONS,
        PURCHASE_ONE_TIME_RESPONSE_WITH_USER_ERRORS,
      );

      await expect(() =>
        check({
          session,
          isTest: true,
        }),
      ).rejects.toThrow(BillingError);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('with recurring config', () => {
    beforeEach(() => {
      Context.BILLING = {
        amount: 5,
        chargeName: TEST_CHARGE_NAME,
        currencyCode: 'USD',
        interval: BillingInterval.Every30Days,
      };
    });

    [true, false].forEach((isTest) =>
      test(`requests a subscription if there is none (isTest: ${isTest})`, async () => {
        fetchMock.mockResponses(
          EMPTY_SUBSCRIPTIONS,
          PURCHASE_SUBSCRIPTION_RESPONSE,
        );

        const response = await check({
          session,
          isTest,
        });

        expect(response).toEqual({
          hasPayment: false,
          confirmBillingUrl: CONFIRMATION_URL,
        });
        expect(fetchMock).toHaveBeenCalledTimes(2);
        expect(fetchMock).toHaveBeenNthCalledWith(
          1,
          expect.anything(),
          expect.objectContaining({
            body: expect.stringContaining('activeSubscriptions'),
            headers: expect.objectContaining({
              'X-Shopify-Access-Token': session.accessToken,
            }),
          }),
        );

        const parsedBody = JSON.parse(
          fetchMock.mock.calls[1][1]!.body!.toString(),
        );
        expect(parsedBody).toMatchObject({
          query: expect.stringContaining('appSubscriptionCreate'),
          variables: expect.objectContaining({test: isTest}),
        });
      }),
    );

    test('defaults to test purchases', async () => {
      fetchMock.mockResponses(
        EMPTY_SUBSCRIPTIONS,
        PURCHASE_SUBSCRIPTION_RESPONSE,
      );

      const response = await check({session});

      expect(response).toEqual({
        hasPayment: false,
        confirmBillingUrl: CONFIRMATION_URL,
      });
      expect(fetchMock).toHaveBeenCalledTimes(2);

      const parsedBody = JSON.parse(
        fetchMock.mock.calls[1][1]!.body!.toString(),
      );
      expect(parsedBody).toMatchObject({
        query: expect.stringContaining('appSubscriptionCreate'),
        variables: expect.objectContaining({test: true}),
      });
    });

    test('does not request subscription if there is one', async () => {
      fetchMock.mockResponses(EXISTING_SUBSCRIPTION);

      const response = await check({
        session,
        isTest: true,
      });

      expect(response).toEqual({
        hasPayment: true,
        confirmBillingUrl: undefined,
      });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenNthCalledWith(
        1,
        expect.anything(),
        expect.objectContaining({
          body: expect.stringContaining('activeSubscriptions'),
        }),
      );
    });

    test('throws on userErrors', async () => {
      fetchMock.mockResponses(
        EMPTY_SUBSCRIPTIONS,
        PURCHASE_SUBSCRIPTION_RESPONSE_WITH_USER_ERRORS,
      );

      await expect(() =>
        check({
          session,
          isTest: true,
        }),
      ).rejects.toThrow(BillingError);

      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });
});
