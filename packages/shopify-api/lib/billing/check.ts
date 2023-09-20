import {ConfigInterface} from '../base-types';
import {
  graphqlClientClass,
  GraphqlClient,
} from '../clients/graphql/graphql_client';
import {BillingError} from '../error';

import {
  AppSubscription,
  BillingCheckParams,
  BillingCheckResponse,
  BillingCheckResponseObject,
  CurrentAppInstallation,
  CurrentAppInstallations,
  OneTimePurchase,
} from './types';

interface CheckInternalParams {
  plans: string[];
  client: GraphqlClient;
  isTest: boolean;
  returnObject: boolean;
}

interface CheckInstallationParams {
  plans: string[];
  isTest: boolean;
  installation: CurrentAppInstallation;
}

type CheckInternalResponse<Params extends CheckInternalParams> =
  Params['returnObject'] extends true ? BillingCheckResponseObject : boolean;

interface SubscriptionMeetsCriteriaParams {
  plans: string[];
  isTest: boolean;
  subscription: AppSubscription;
}

interface PurchaseMeetsCriteriaParams {
  plans: string[];
  isTest: boolean;
  purchase: OneTimePurchase;
}

export function check(config: ConfigInterface) {
  return async function check<Params extends BillingCheckParams>({
    session,
    plans,
    isTest = true,
    returnObject = false,
  }: Params): Promise<BillingCheckResponse<Params>> {
    if (!config.billing) {
      throw new BillingError({
        message: 'Attempted to look for purchases without billing configs',
        errorData: [],
      });
    }

    const GraphqlClient = graphqlClientClass({config});
    const client = new GraphqlClient({session});

    const plansArray = Array.isArray(plans) ? plans : [plans];
    return assessPayments({
      plans: plansArray,
      client,
      isTest,
      returnObject,
    }) as Promise<BillingCheckResponse<Params>>;
  };
}

async function assessPayments<Params extends CheckInternalParams>({
  plans,
  client,
  isTest,
  returnObject,
}: Params): Promise<CheckInternalResponse<Params>> {
  const returnValue: BillingCheckResponseObject | boolean = returnObject
    ? {
        hasActivePayment: false,
        oneTimePurchases: [],
        appSubscriptions: [],
      }
    : false;

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
    if (returnObject) {
      installation.activeSubscriptions.map((subscription) => {
        if (subscriptionMeetsCriteria({plans, isTest, subscription})) {
          (returnValue as BillingCheckResponseObject).hasActivePayment = true;
          (returnValue as BillingCheckResponseObject).appSubscriptions.push(
            subscription,
          );
        }
      });
      installation.oneTimePurchases.edges.map((purchase) => {
        if (purchaseMeetsCriteria({plans, isTest, purchase: purchase.node})) {
          (returnValue as BillingCheckResponseObject).hasActivePayment = true;
          (returnValue as BillingCheckResponseObject).oneTimePurchases.push(
            purchase.node,
          );
        }
      });
    } else {
      const params = {plans, isTest, installation};
      if (hasSubscription(params) || hasOneTimePayment(params)) {
        return true as CheckInternalResponse<Params>;
      }
    }
    endCursor = installation.oneTimePurchases.pageInfo.endCursor;
  } while (installation?.oneTimePurchases.pageInfo.hasNextPage);

  return returnValue as CheckInternalResponse<Params>;
}

function subscriptionMeetsCriteria({
  plans,
  isTest,
  subscription,
}: SubscriptionMeetsCriteriaParams): boolean {
  return plans.includes(subscription.name) && (isTest || !subscription.test);
}

function purchaseMeetsCriteria({
  plans,
  isTest,
  purchase,
}: PurchaseMeetsCriteriaParams): boolean {
  return (
    plans.includes(purchase.name) &&
    (isTest || !purchase.test) &&
    purchase.status === 'ACTIVE'
  );
}

function hasSubscription({
  plans,
  isTest,
  installation,
}: CheckInstallationParams): boolean {
  return installation.activeSubscriptions.some((subscription) =>
    subscriptionMeetsCriteria({plans, isTest, subscription}),
  );
}

function hasOneTimePayment({
  plans,
  isTest,
  installation,
}: CheckInstallationParams): boolean {
  return installation.oneTimePurchases.edges.some((purchase) =>
    purchaseMeetsCriteria({plans, isTest, purchase: purchase.node}),
  );
}

const HAS_PAYMENTS_QUERY = `
  query appSubscription($endCursor: String) {
    currentAppInstallation {
      activeSubscriptions {
        id
        name
        test
      }

      oneTimePurchases(first: 250, sortKey: CREATED_AT, after: $endCursor) {
        edges {
          node {
            id
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
