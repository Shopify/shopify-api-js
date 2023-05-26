import {testConfig, queueMockResponses} from '../../__tests__/test-helper';
import {Session} from '../../session/session';
import {LATEST_API_VERSION} from '../../types';
import {shopifyApi, Shopify, BillingError, BillingInterval} from '../..';

import * as Responses from './responses';

const DOMAIN = 'test-shop.myshopify.io';
const ACCESS_TOKEN = 'access-token';
const GRAPHQL_BASE_REQUEST = {
  method: 'POST',
  domain: DOMAIN,
  path: `/admin/api/${LATEST_API_VERSION}/graphql.json`,
  headers: {'X-Shopify-Access-Token': ACCESS_TOKEN},
};

describe('shopify.billing.cancel', () => {
  const session = new Session({
    id: '1234',
    shop: DOMAIN,
    state: '1234',
    isOnline: true,
    accessToken: ACCESS_TOKEN,
    scope: 'read_returns',
  });

  let shopify: Shopify;
  beforeEach(() => {
    shopify = shopifyApi({
      ...testConfig,
      billing: {
        basic: {
          amount: 5.0,
          currencyCode: 'USD',
          interval: BillingInterval.OneTime,
        },
      },
    });
  });

  test('returns the details of the subscription successfully cancelled', async () => {
    queueMockResponses([Responses.CANCEL_RESPONSE]);

    const {
      data: {
        currentAppInstallation: {activeSubscriptions},
      },
    } = Responses.EXISTING_SUBSCRIPTION_OBJECT;

    const subscriptionId = activeSubscriptions[0].id;
    const response = await shopify.billing.cancel({
      session,
      subscriptionId,
    });

    expect(response).toEqual(
      JSON.parse(Responses.CANCEL_RESPONSE).data.appSubscriptionCancel
        .appSubscription,
    );
    expect({
      ...GRAPHQL_BASE_REQUEST,
      data: {
        query: expect.stringContaining('appSubscriptionCancel'),
        variables: expect.objectContaining({
          id: subscriptionId,
          prorate: true,
        }),
      },
    }).toMatchMadeHttpRequest();
  });

  test('throws a BillingError when an error occurs', async () => {
    queueMockResponses([Responses.CANCEL_RESPONSE_WITH_USER_ERRORS]);

    const {
      data: {
        currentAppInstallation: {activeSubscriptions},
      },
    } = Responses.EXISTING_SUBSCRIPTION_OBJECT;

    const subscriptionId = activeSubscriptions[0].id;

    expect(() =>
      shopify.billing.cancel({
        session,
        subscriptionId,
      }),
    ).rejects.toThrowError(BillingError);
  });

  test('throws a BillingError when a user error occurs', async () => {
    queueMockResponses([Responses.CANCEL_RESPONSE_WITH_ERRORS]);

    const {
      data: {
        currentAppInstallation: {activeSubscriptions},
      },
    } = Responses.EXISTING_SUBSCRIPTION_OBJECT;

    const subscriptionId = activeSubscriptions[0].id;

    expect(() =>
      shopify.billing.cancel({
        session,
        subscriptionId,
      }),
    ).rejects.toThrowError(BillingError);
  });

  test('throws a BillingError when a user error occurs', async () => {
    queueMockResponses([Responses.CANCEL_RESPONSE_WITH_USER_ERRORS]);

    const {
      data: {
        currentAppInstallation: {activeSubscriptions},
      },
    } = Responses.EXISTING_SUBSCRIPTION_OBJECT;

    const subscriptionId = activeSubscriptions[0].id;

    expect(() =>
      shopify.billing.cancel({
        session,
        subscriptionId,
      }),
    ).rejects.toThrowError(BillingError);
  });

  test('throws a BillingError when an error occurs', async () => {
    queueMockResponses([Responses.CANCEL_RESPONSE_WITH_ERRORS]);

    const {
      data: {
        currentAppInstallation: {activeSubscriptions},
      },
    } = Responses.EXISTING_SUBSCRIPTION_OBJECT;

    const subscriptionId = activeSubscriptions[0].id;

    expect(() =>
      shopify.billing.cancel({
        session,
        subscriptionId,
      }),
    ).rejects.toThrowError(BillingError);
  });
});
