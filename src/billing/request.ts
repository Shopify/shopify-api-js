import {BillingInterval, ConfigInterface} from '../base-types';
import {BillingError} from '../error';
import {createBuildEmbeddedAppUrl} from '../auth/get-embedded-app-url';
import {createGraphqlClientClass} from '../clients/graphql/graphql_client';
import {hashString} from '../runtime/crypto';
import {HashFormat} from '../runtime/crypto/types';

import {
  RequestParams,
  RequestResponse,
  RecurringPaymentResponse,
  SinglePaymentResponse,
  BillingConfigSubscriptionPlan,
  BillingConfigOneTimePlan,
} from './types';

interface RequestInternalParams {
  client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
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

export function createRequest(config: ConfigInterface) {
  return async function ({
    session,
    plan,
    isTest = true,
  }: RequestParams): Promise<string> {
    if (!config.billing || !config.billing[plan]) {
      throw new BillingError({
        message: `Could not find plan ${plan} in billing settings`,
        errorData: [],
      });
    }

    const billingConfig = config.billing[plan];

    const returnUrl = createBuildEmbeddedAppUrl(config)(
      hashString(`${session.shop}/admin`, HashFormat.Base64),
    );

    const GraphqlClient = createGraphqlClientClass({config});
    const client = new GraphqlClient({
      domain: session.shop,
      accessToken: session.accessToken,
    });

    let data: RequestResponse;
    if (billingConfig.interval === BillingInterval.OneTime) {
      const mutationResponse = await requestSinglePayment({
        billingConfig: billingConfig as BillingConfigOneTimePlan,
        plan,
        client,
        returnUrl,
        isTest,
      });
      data = mutationResponse.data.appPurchaseOneTimeCreate;
    } else {
      const mutationResponse = await requestRecurringPayment({
        billingConfig: billingConfig as BillingConfigSubscriptionPlan,
        plan,
        client,
        returnUrl,
        isTest,
      });
      data = mutationResponse.data.appSubscriptionCreate;
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
