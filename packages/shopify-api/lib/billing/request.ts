import {ConfigInterface, ConfigParams} from '../base-types';
import {BillingInterval} from '../types';
import {BillingError, GraphqlQueryError} from '../error';
import {buildEmbeddedAppUrl} from '../auth/get-embedded-app-url';
import {hashString} from '../../runtime/crypto';
import {HashFormat} from '../../runtime/crypto/types';
import {FutureFlagOptions} from '../../future/flags';
import {adminGraphqlClientFactory, AdminGraphqlClient} from '../clients/admin';

import {
  BillingConfigSubscriptionPlan,
  BillingConfigOneTimePlan,
  BillingConfigUsagePlan,
  BillingRequestParams,
  BillingRequestResponse,
  RecurringPaymentResponse,
  RequestResponseData,
  SinglePaymentResponse,
  BillingConfigSubscriptionLineItemPlan,
  RequestConfigLineItemOverrides,
} from './types';

interface RequestInternalParams {
  client: AdminGraphqlClient;
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

interface RequestSubscriptionParams extends RequestInternalParams {
  billingConfig: BillingConfigSubscriptionLineItemPlan;
}

export function request<
  Config extends ConfigInterface<Params>,
  Params extends ConfigParams<any, Future>,
  Future extends FutureFlagOptions,
>(config: Config) {
  return async function <Params extends BillingRequestParams>({
    session,
    plan,
    isTest = true,
    returnUrl: returnUrlParam,
    returnObject = false,
    ...overrides
  }: Params): Promise<BillingRequestResponse<Params>> {
    if (!config.billing || !config.billing[plan]) {
      throw new BillingError({
        message: `Could not find plan ${plan} in billing settings`,
        errorData: [],
      });
    }

    const billingConfig = {
      ...config.billing[plan],
    };
    const filteredOverrides = Object.fromEntries(
      Object.entries(overrides).filter(([_key, value]) => value !== undefined),
    );

    const cleanShopName = session.shop.replace('.myshopify.com', '');
    const embeddedAppUrl = buildEmbeddedAppUrl(config)(
      hashString(`admin.shopify.com/store/${cleanShopName}`, HashFormat.Base64),
    );

    const appUrl = `${config.hostScheme}://${config.hostName}?shop=${session.shop}`;

    // if provided a return URL, use it, otherwise use the embedded app URL or hosted app URL
    const returnUrl =
      returnUrlParam || (config.isEmbeddedApp ? embeddedAppUrl : appUrl);

    const client = adminGraphqlClientFactory(config)({session});

    function isLineItemPlan(
      billingConfig: any,
    ): billingConfig is BillingConfigSubscriptionLineItemPlan {
      return 'lineItems' in billingConfig;
    }

    function isOneTimePlan(
      billingConfig: any,
    ): billingConfig is BillingConfigOneTimePlan {
      return billingConfig.interval === BillingInterval.OneTime;
    }

    let data: RequestResponseData;
    if (isLineItemPlan(billingConfig)) {
      const mergedBillingConfigs = mergeBillingConfigs(
        billingConfig,
        filteredOverrides,
      );
      const mutationRecurringResponse = await requestSubscriptionPayment({
        billingConfig: mergedBillingConfigs,
        plan,
        client,
        returnUrl,
        isTest,
      });

      data = mutationRecurringResponse.appSubscriptionCreate;
    } else if (isOneTimePlan(billingConfig)) {
      const mutationOneTimeResponse = await requestSinglePayment({
        billingConfig: {...billingConfig, ...filteredOverrides},
        plan,
        client,
        returnUrl,
        isTest,
      });
      data = mutationOneTimeResponse.appPurchaseOneTimeCreate;
    } else {
      switch (billingConfig.interval) {
        case BillingInterval.Usage: {
          const mutationUsageResponse = await requestUsagePayment({
            billingConfig: {...billingConfig, ...filteredOverrides},
            plan,
            client,
            returnUrl,
            isTest,
          });
          data = mutationUsageResponse.appSubscriptionCreate;
          break;
        }
        default: {
          const mutationRecurringResponse = await requestRecurringPayment({
            billingConfig: {...billingConfig, ...filteredOverrides},
            plan,
            client,
            returnUrl,
            isTest,
          });
          data = mutationRecurringResponse.appSubscriptionCreate;
        }
      }
    }

    if (data.userErrors?.length) {
      throw new BillingError({
        message: 'Error while billing the store',
        errorData: data.userErrors,
      });
    }

    if (returnObject) {
      return data as Omit<
        RequestResponseData,
        'userErrors'
      > as BillingRequestResponse<Params>;
    } else {
      return data.confirmationUrl as BillingRequestResponse<Params>;
    }
  };
}

async function requestSubscriptionPayment({
  billingConfig,
  plan,
  client,
  returnUrl,
  isTest,
}: RequestSubscriptionParams): Promise<RecurringPaymentResponse> {
  const lineItems = billingConfig.lineItems.map((item) => {
    if (
      item.interval === BillingInterval.Every30Days ||
      item.interval === BillingInterval.Annual
    ) {
      const appRecurringPricingDetails: any = {
        interval: item.interval,
        price: {
          amount: item.amount,
          currencyCode: item.currencyCode,
        },
      };

      if (item.discount) {
        appRecurringPricingDetails.discount = {
          durationLimitInIntervals: item.discount.durationLimitInIntervals,
          value: {
            amount: item.discount.value.amount,
            percentage: item.discount.value.percentage,
          },
        };
      }

      return {
        plan: {
          appRecurringPricingDetails,
        },
      };
    } else if (item.interval === BillingInterval.Usage) {
      const appUsagePricingDetails = {
        terms: item.terms,
        cappedAmount: {
          amount: item.amount,
          currencyCode: item.currencyCode,
        },
      };

      return {
        plan: {
          appUsagePricingDetails,
        },
      };
    } else {
      throw new BillingError({
        message: 'Invalid interval provided',
        errorData: [item],
      });
    }
  });

  try {
    const mutationResponse = await client.request<RecurringPaymentResponse>(
      RECURRING_PURCHASE_MUTATION,
      {
        variables: {
          name: plan,
          trialDays: billingConfig.trialDays,
          replacementBehavior: billingConfig.replacementBehavior,
          returnUrl,
          test: isTest,
          lineItems,
        },
      },
    );

    return mutationResponse.data!;
  } catch (error) {
    throw rethrowGraphqlError(error);
  }
}
async function requestRecurringPayment({
  billingConfig,
  plan,
  client,
  returnUrl,
  isTest,
}: RequestSubscriptionInternalParams): Promise<RecurringPaymentResponse> {
  try {
    const mutationResponse = await client.request<RecurringPaymentResponse>(
      RECURRING_PURCHASE_MUTATION,
      {
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
    );

    return mutationResponse.data!;
  } catch (error) {
    throw rethrowGraphqlError(error);
  }
}

async function requestUsagePayment({
  billingConfig,
  plan,
  client,
  returnUrl,
  isTest,
}: RequestUsageSubscriptionInternalParams): Promise<RecurringPaymentResponse> {
  try {
    const mutationResponse = await client.request<RecurringPaymentResponse>(
      RECURRING_PURCHASE_MUTATION,
      {
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
    );

    return mutationResponse.data!;
  } catch (error) {
    throw rethrowGraphqlError(error);
  }
}

async function requestSinglePayment({
  billingConfig,
  plan,
  client,
  returnUrl,
  isTest,
}: RequestOneTimePaymentInternalParams): Promise<SinglePaymentResponse> {
  try {
    const mutationResponse = await client.request<SinglePaymentResponse>(
      ONE_TIME_PURCHASE_MUTATION,
      {
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
    );

    return mutationResponse.data!;
  } catch (error) {
    throw rethrowGraphqlError(error);
  }
}

function mergeBillingConfigs(
  billingConfig: BillingConfigSubscriptionLineItemPlan,
  overrides: RequestConfigLineItemOverrides,
) {
  const mergedConfig = {...billingConfig, ...overrides};
  const mergedLineItems = [];

  if (billingConfig.lineItems && overrides.lineItems) {
    for (const i of billingConfig.lineItems) {
      let found = false;

      for (const j of overrides.lineItems) {
        if (i.interval === j.interval) {
          mergedLineItems.push({...i, ...j});
          found = true;
          break;
        }
      }

      if (!found) {
        mergedLineItems.push(i);
      }
    }

    mergedConfig.lineItems = mergedLineItems;
  }

  return mergedConfig;
}

function rethrowGraphqlError(error: Error): Error {
  if (error instanceof GraphqlQueryError) {
    return new BillingError({
      message: 'Error while billing the store',
      errorData: error.response.errors,
    });
  }

  return error;
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
      appSubscription {
        id
        name
        test
      }
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
      appPurchaseOneTime {
        id
        name
        test
      }
      confirmationUrl
      userErrors {
        field
        message
      }
    }
  }
`;
