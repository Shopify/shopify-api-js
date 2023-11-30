import {BillingError} from '../error';
import {ConfigInterface} from '../base-types';
import {adminGraphqlClientFactory} from '../clients/admin';

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

    const client = adminGraphqlClientFactory(config)({session});

    const response = await client.request<SubscriptionResponse>(
      SUBSCRIPTION_QUERY,
    );

    return response.data!.currentAppInstallation;
  };
}
