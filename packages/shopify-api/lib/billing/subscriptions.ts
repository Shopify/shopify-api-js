import {BillingError} from '../error';
import {ConfigInterface} from '../base-types';
import {graphqlClientClass} from '../clients/admin';

import {
  ActiveSubscriptions,
  BillingSubscriptionParams,
  SubscriptionResponse,
} from './types';

const SUBSCRIPTION_QUERY = `
query appSubscription {
  currentAppInstallation {
    activeSubscriptions {
      id
      name
      test
      lineItems {
        id
        plan {
          pricingDetails {
            ... on AppRecurringPricing {
              price {
                amount
                currencyCode
              }
              interval
              discount {
                durationLimitInIntervals
                remainingDurationInIntervals
                priceAfterDiscount {
                  amount
                }
                value {
                  ... on AppSubscriptionDiscountAmount {
                    amount {
                      amount
                      currencyCode
                    }
                  }
                  ... on AppSubscriptionDiscountPercentage {
                    percentage
                  }
                }
              }
            }
            ... on AppUsagePricing {
              balanceUsed {
                amount
                currencyCode
              }
              cappedAmount {
                amount
                currencyCode
              }
              terms
            }
          }
        }
      }
    }
  }
}
`;

export function subscriptions(config: ConfigInterface) {
  return async function ({
    session,
  }: BillingSubscriptionParams): Promise<ActiveSubscriptions> {
    if (!config.billing) {
      throw new BillingError({
        message: 'Attempted to look for purchases without billing configs',
        errorData: [],
      });
    }

    const GraphqlClient = graphqlClientClass({config});
    const client = new GraphqlClient({session});

    const response =
      await client.request<SubscriptionResponse>(SUBSCRIPTION_QUERY);

    return response.data?.currentAppInstallation!;
  };
}
