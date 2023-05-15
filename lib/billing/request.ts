import {ConfigInterface} from '../base-types';
import {BillingInterval} from '../types';
import {BillingError} from '../error';
import {buildEmbeddedAppUrl} from '../auth/get-embedded-app-url';
import {
  GraphqlClient,
  graphqlClientClass,
} from '../clients/graphql/graphql_client';
import {hashString} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';

import {
  RequestParams,
  RequestResponse,
  RecurringPaymentResponse,
  SinglePaymentResponse,
  BillingConfigSubscriptionPlan,
  BillingConfigOneTimePlan,
  BillingConfigUsagePlan,
} from './types';

interface RequestInternalParams {
  client: GraphqlClient;
  plan: string;
  returnUrl: string;
  isTest: boolean;
}

interface RequestSubscriptionInternalParams extends RequestInternalParams {
  billingConfig: BillingConfigSubscriptionPlan;
}

interface RequestOneTimePaymentInternalParams extends RequestInternalParams {
  billingConfig: BillingConfigOneTimePlan;
}

interface RequestUsageSubscriptionInternalParams extends RequestInternalParams {
  billingConfig: BillingConfigUsagePlan;
}

export function request(config: ConfigInterface) {
  return async function ({
    session,
    plan,
    isTest = true,
    returnUrl: returnUrlParam,
  }: RequestParams): Promise<string> {
    if (!config.billing || !config.billing[plan]) {
      throw new BillingError({
        message: `Could not find plan ${plan} in billing settings`,
        errorData: [],
      });
    }

    const billingConfig = config.billing[plan];

    const cleanShopName = session.shop.replace('.myshopify.com', '');
    const embeddedAppUrl = buildEmbeddedAppUrl(config)(
      hashString(`admin.shopify.com/store/${cleanShopName}`, HashFormat.Base64),
    );

    const appUrl = `${config.hostScheme}://${config.hostName}`;

    // if provided a return URL, use it, otherwise use the embedded app URL or hosted app URL
    const returnUrl =
      returnUrlParam || (config.isEmbeddedApp ? embeddedAppUrl : appUrl);

    const GraphqlClient = graphqlClientClass({config});
    const client = new GraphqlClient({session});

    let data: RequestResponse;
    switch (billingConfig.interval) {
      case BillingInterval.OneTime: {
        const mutationOneTimeResponse = await requestSinglePayment({
          billingConfig: billingConfig as BillingConfigOneTimePlan,
          plan,
          client,
          returnUrl,
          isTest,
        });
        data = mutationOneTimeResponse.data.appPurchaseOneTimeCreate;
        break;
      }
      case BillingInterval.Usage: {
        const mutationUsageResponse = await requestUsagePayment({
          billingConfig: billingConfig as BillingConfigUsagePlan,
          plan,
          client,
          returnUrl,
          isTest,
        });
        data = mutationUsageResponse.data.appSubscriptionCreate;
        break;
      }
      default: {
        const mutationRecurringResponse = await requestRecurringPayment({
          billingConfig: billingConfig as BillingConfigSubscriptionPlan,
          plan,
          client,
          returnUrl,
          isTest,
        });
        data = mutationRecurringResponse.data.appSubscriptionCreate;
      }
    }
    if (data.userErrors?.length) {
      throw new BillingError({
        message: 'Error while billing the store',
        errorData: data.userErrors,
      });
    }

    return data.confirmationUrl;
  };
}

async function requestRecurringPayment({
  billingConfig,
  plan,
  client,
  returnUrl,
  isTest,
}: RequestSubscriptionInternalParams): Promise<RecurringPaymentResponse> {
  const mutationResponse = await client.query<RecurringPaymentResponse>({
    data: {
      query: RECURRING_PURCHASE_MUTATION,
      variables: {
        name: plan,
        trialDays: billingConfig.trialDays,
        replacementBehavior: billingConfig.replacementBehavior,
        returnUrl,
        test: isTest,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                interval: billingConfig.interval,
                price: {
                  amount: billingConfig.amount,
                  currencyCode: billingConfig.currencyCode,
                },
                discount: {
                  durationLimitInIntervals:
                    billingConfig.discount?.durationLimitInIntervals,
                  value: {
                    amount: billingConfig.discount?.value?.amount,
                    percentage: billingConfig.discount?.value?.percentage,
                  },
                },
              },
            },
          },
        ],
      },
    },
  });

  if (mutationResponse.body.errors?.length) {
    throw new BillingError({
      message: 'Error while billing the store',
      errorData: mutationResponse.body.errors,
    });
  }

  return mutationResponse.body;
}

async function requestUsagePayment({
  billingConfig,
  plan,
  client,
  returnUrl,
  isTest,
}: RequestUsageSubscriptionInternalParams): Promise<RecurringPaymentResponse> {
  const mutationResponse = await client.query<RecurringPaymentResponse>({
    data: {
      query: RECURRING_PURCHASE_MUTATION,
      variables: {
        name: plan,
        returnUrl,
        test: isTest,
        trialDays: billingConfig.trialDays,
        replacementBehavior: billingConfig.replacementBehavior,
        lineItems: [
          {
            plan: {
              appUsagePricingDetails: {
                terms: billingConfig.usageTerms,
                cappedAmount: {
                  amount: billingConfig.amount,
                  currencyCode: billingConfig.currencyCode,
                },
              },
            },
          },
        ],
      },
    },
  });

  if (mutationResponse.body.errors?.length) {
    throw new BillingError({
      message: `Error while billing the store:: ${mutationResponse.body.errors}`,
      errorData: mutationResponse.body.errors,
    });
  }

  return mutationResponse.body;
}

async function requestSinglePayment({
  billingConfig,
  plan,
  client,
  returnUrl,
  isTest,
}: RequestOneTimePaymentInternalParams): Promise<SinglePaymentResponse> {
  const mutationResponse = await client.query<SinglePaymentResponse>({
    data: {
      query: ONE_TIME_PURCHASE_MUTATION,
      variables: {
        name: plan,
        returnUrl,
        test: isTest,
        price: {
          amount: billingConfig.amount,
          currencyCode: billingConfig.currencyCode,
        },
      },
    },
  });

  if (mutationResponse.body.errors?.length) {
    throw new BillingError({
      message: 'Error while billing the store',
      errorData: mutationResponse.body.errors,
    });
  }

  return mutationResponse.body;
}

const RECURRING_PURCHASE_MUTATION = `
  mutation test(
    $name: String!
    $lineItems: [AppSubscriptionLineItemInput!]!
    $returnUrl: URL!
    $test: Boolean
    $trialDays: Int
    $replacementBehavior: AppSubscriptionReplacementBehavior
  ) {
    appSubscriptionCreate(
      name: $name
      lineItems: $lineItems
      returnUrl: $returnUrl
      test: $test
      trialDays: $trialDays
      replacementBehavior: $replacementBehavior
    ) {
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;

const ONE_TIME_PURCHASE_MUTATION = `
  mutation test(
    $name: String!
    $price: MoneyInput!
    $returnUrl: URL!
    $test: Boolean
  ) {
    appPurchaseOneTimeCreate(
      name: $name
      price: $price
      returnUrl: $returnUrl
      test: $test
    ) {
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;
