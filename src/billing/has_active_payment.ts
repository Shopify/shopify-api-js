import {Context} from '../context';
import {BillingError} from '../error';
import {GraphqlClient} from '../clients/graphql';
import {SessionInterface} from '../auth/session/types';

import {isRecurring} from './is_recurring';
import {
  ActiveSubscriptions,
  CurrentAppInstallations,
  OneTimePurchases,
} from './types';

export async function hasActivePayment(
  session: SessionInterface,
  isTest: boolean,
): Promise<boolean> {
  if (isRecurring()) {
    return hasActiveSubscription(session, isTest);
  } else {
    return hasActiveOneTimePurchase(session, isTest);
  }
}

async function hasActiveSubscription(
  session: SessionInterface,
  isTest: boolean,
): Promise<boolean> {
  if (!Context.BILLING) {
    throw new BillingError({
      message: 'Attempted to look for subscriptions without billing configs',
      errorData: [],
    });
  }

  const client = new GraphqlClient(session.shop, session.accessToken);

  const currentInstallations = await client.query<
    CurrentAppInstallations<ActiveSubscriptions>
  >({
    data: RECURRING_PURCHASES_QUERY,
  });

  return currentInstallations.body.data.currentAppInstallation.activeSubscriptions.some(
    (subscription) =>
      subscription.name === Context.BILLING!.chargeName &&
      (isTest || !subscription.test),
  );
}

async function hasActiveOneTimePurchase(
  session: SessionInterface,
  isTest: boolean,
): Promise<boolean> {
  if (!Context.BILLING) {
    throw new BillingError({
      message:
        'Attempted to look for one time purchases without billing configs',
      errorData: [],
    });
  }

  const client = new GraphqlClient(session.shop, session.accessToken);

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
          purchase.node.name === Context.BILLING!.chargeName &&
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
