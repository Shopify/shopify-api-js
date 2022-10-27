import {ConfigInterface} from '../base-types';
import {
  createGraphqlClientClass,
  GraphqlClient,
} from '../clients/graphql/graphql_client';
import {BillingError} from '../error';

import {
  CheckParams,
  CurrentAppInstallation,
  CurrentAppInstallations,
} from './types';

interface CheckInternalParams {
  plans: string[];
  client: GraphqlClient;
  isTest: boolean;
}

interface CheckInstallationParams {
  plans: string[];
  isTest: boolean;
  installation: CurrentAppInstallation;
}

export function createCheck(config: ConfigInterface) {
  return async function ({
    session,
    plans,
    isTest = true,
  }: CheckParams): Promise<boolean> {
    if (!config.billing) {
      throw new BillingError({
        message: 'Attempted to look for purchases without billing configs',
        errorData: [],
      });
    }

    const GraphqlClient = createGraphqlClientClass({config});
    const client = new GraphqlClient(session);

    const plansArray = Array.isArray(plans) ? plans : [plans];
    return hasActivePayment({
      plans: plansArray,
      client,
      isTest,
    });
  };
}

async function hasActivePayment({
  plans,
  client,
  isTest,
}: CheckInternalParams): Promise<boolean> {
  let installation: CurrentAppInstallation;
  let endCursor: string | null = null;
  do {
    const currentInstallations = await client.query<CurrentAppInstallations>({
      data: {
        query: HAS_PAYMENTS_QUERY,
        variables: {endCursor},
      },
    });

    installation = currentInstallations.body.data.currentAppInstallation;
    if (
      hasSubscription({plans, isTest, installation}) ||
      hasOneTimePayment({plans, isTest, installation})
    ) {
      return true;
    }

    endCursor = installation.oneTimePurchases.pageInfo.endCursor;
  } while (installation?.oneTimePurchases.pageInfo.hasNextPage);

  return false;
}

function hasSubscription({
  plans,
  isTest,
  installation,
}: CheckInstallationParams): boolean {
  return installation.activeSubscriptions.some(
    (subscription) =>
      plans.includes(subscription.name) && (isTest || !subscription.test),
  );
}

function hasOneTimePayment({
  plans,
  isTest,
  installation,
}: CheckInstallationParams): boolean {
  return installation.oneTimePurchases.edges.some(
    (purchase) =>
      plans.includes(purchase.node.name) &&
      (isTest || !purchase.node.test) &&
      purchase.node.status === 'ACTIVE',
  );
}

const HAS_PAYMENTS_QUERY = `
  query appSubscription($endCursor: String) {
    currentAppInstallation {
      activeSubscriptions {
        name
        test
      }

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
