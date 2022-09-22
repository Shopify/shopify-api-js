import {ConfigInterface} from '../base-types';
import {SessionInterface} from '../session/types';
import {createGraphqlClientClass} from '../clients/graphql/graphql_client';
import {BillingError} from '../error';

import {isRecurring} from './is_recurring';
import {
  ActiveSubscriptions,
  BillingConfig,
  CurrentAppInstallations,
  OneTimePurchases,
} from './types';

interface HasActivePaymentParams {
  session: SessionInterface;
  isTest: boolean;
}

interface HasActivePaymentInternalParams {
  billingConfig: BillingConfig;
  client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
  isTest: boolean;
}

export function createHasActivePayment(config: ConfigInterface) {
  return async function ({
    session,
    isTest,
  }: HasActivePaymentParams): Promise<boolean> {
    if (!config.billing) {
      throw new BillingError({
        message: 'Attempted to look for purchases without billing configs',
        errorData: [],
      });
    }

    const GraphqlClient = createGraphqlClientClass({config});
    const client = new GraphqlClient({
      domain: session.shop,
      accessToken: session.accessToken,
    });

    if (isRecurring(config.billing)) {
      return hasActiveSubscription({
        billingConfig: config.billing,
        client,
        isTest,
      });
    } else {
      return hasActiveOneTimePurchase({
        billingConfig: config.billing,
        client,
        isTest,
      });
    }
  };
}

async function hasActiveSubscription({
  billingConfig,
  client,
  isTest,
}: HasActivePaymentInternalParams): Promise<boolean> {
  const currentInstallations = await client.query<
    CurrentAppInstallations<ActiveSubscriptions>
  >({
    data: RECURRING_PURCHASES_QUERY,
  });

  return currentInstallations.body.data.currentAppInstallation.activeSubscriptions.some(
    (subscription) =>
      subscription.name === billingConfig.chargeName &&
      (isTest || !subscription.test),
  );
}

async function hasActiveOneTimePurchase({
  billingConfig,
  client,
  isTest,
}: HasActivePaymentInternalParams): Promise<boolean> {
  let installation: OneTimePurchases;
  let endCursor = null;
  do {
    const currentInstallations = await client.query<
      CurrentAppInstallations<OneTimePurchases>
    >({
      data: {
        query: ONE_TIME_PURCHASES_QUERY,
        variables: {endCursor},
      },
    });

    installation = currentInstallations.body.data.currentAppInstallation;
    if (
      installation.oneTimePurchases.edges.some(
        (purchase) =>
          purchase.node.name === billingConfig.chargeName &&
          (isTest || !purchase.node.test) &&
          purchase.node.status === 'ACTIVE',
      )
    ) {
      return true;
    }

    endCursor = installation.oneTimePurchases.pageInfo.endCursor;
  } while (installation?.oneTimePurchases.pageInfo.hasNextPage);

  return false;
}

const RECURRING_PURCHASES_QUERY = `
  query appSubscription {
    currentAppInstallation {
      activeSubscriptions {
        name
        test
      }
    }
  }
`;

const ONE_TIME_PURCHASES_QUERY = `
  query appPurchases($endCursor: String) {
    currentAppInstallation {
      oneTimePurchases(first: 250, sortKey: CREATED_AT, after: $endCursor) {
        edges {
          node {
            name
            test
            status
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;
