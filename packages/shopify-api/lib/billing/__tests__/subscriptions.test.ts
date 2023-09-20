import {testConfig, queueMockResponses} from '../../__tests__/test-helper';
import {Session} from '../../session/session';
import {LATEST_API_VERSION} from '../../types';
import {shopifyApi, Shopify, BillingInterval} from '../..';

import * as Responses from './responses';

const DOMAIN = 'test-shop.myshopify.io';
const ACCESS_TOKEN = 'access-token';
const GRAPHQL_BASE_REQUEST = {
  method: 'POST',
  domain: DOMAIN,
  path: `/admin/api/${LATEST_API_VERSION}/graphql.json`,
  headers: {'X-Shopify-Access-Token': ACCESS_TOKEN},
};

describe('shopify.billing.subscriptions', () => {
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

  test('Returns a list of subscriptions', async () => {
    queueMockResponses([Responses.SUBSCRIPTIONS_RESPONSE]);

    const response = await shopify.billing.subscriptions({
      session,
    });

    expect(response).toEqual(
      JSON.parse(Responses.SUBSCRIPTIONS_RESPONSE).data.currentAppInstallation,
    );
    expect({
      ...GRAPHQL_BASE_REQUEST,
      data: {
        query: expect.stringContaining('currentAppInstallation'),
      },
    }).toMatchMadeHttpRequest();
  });
});
