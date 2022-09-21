import {ConfigInterface} from '../base-types';
import {SessionInterface} from '../session/types';
import {BillingError} from '../error';
import {createBuildEmbeddedAppUrl} from '../auth/get-embedded-app-url';
import {createGraphqlClientClass} from '../clients/graphql/graphql_client';
import {hashString} from '../runtime/crypto';
import {HashFormat} from '../runtime/crypto/types';

import {isRecurring} from './is_recurring';
import {
  RequestResponse,
  RecurringPaymentResponse,
  SinglePaymentResponse,
  BillingConfig,
} from './types';

interface RequestPaymentParams {
  session: SessionInterface;
  isTest: boolean;
}

interface RequestPaymentInternalParams {
  config: BillingConfig;
  client: InstanceType<ReturnType<typeof createGraphqlClientClass>>;
  returnUrl: string;
  isTest: boolean;
}

export function createRequestPayment(config: ConfigInterface) {
  return async function ({
    session,
    isTest,
  }: RequestPaymentParams): Promise<string | undefined> {
    if (!config.billing) {
      throw new BillingError({
        message: 'Attempted to request payment without billing configs',
        errorData: [],
      });
    }

    const returnUrl = createBuildEmbeddedAppUrl(config)(
      hashString(`${session.shop}/admin`, HashFormat.Base64),
    );

    const GraphqlClient = createGraphqlClientClass({config});
    const client = new GraphqlClient({
      domain: session.shop,
      accessToken: session.accessToken,
    });

    let data: RequestResponse;
    if (isRecurring(config.billing)) {
      const mutationResponse = await requestRecurringPayment({
        config: config.billing,
        client,
        returnUrl,
        isTest,
      });
      data = mutationResponse.data.appSubscriptionCreate;
    } else {
      const mutationResponse = await requestSinglePayment({
        config: config.billing,
        client,
        returnUrl,
        isTest,
      });
      data = mutationResponse.data.appPurchaseOneTimeCreate;
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
  config,
  client,
  returnUrl,
  isTest,
}: RequestPaymentInternalParams): Promise<RecurringPaymentResponse> {
  const mutationResponse = await client.query<RecurringPaymentResponse>({
    data: {
      query: RECURRING_PURCHASE_MUTATION,
      variables: {
        name: config.chargeName,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                interval: config.interval,
                price: {
                  amount: config.amount,
                  currencyCode: config.currencyCode,
                },
              },
            },
          },
        ],
        returnUrl,
        test: isTest,
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
  config,
  client,
  returnUrl,
  isTest,
}: RequestPaymentInternalParams): Promise<SinglePaymentResponse> {
  const mutationResponse = await client.query<SinglePaymentResponse>({
    data: {
      query: ONE_TIME_PURCHASE_MUTATION,
      variables: {
        name: config.chargeName,
        price: {
          amount: config.amount,
          currencyCode: config.currencyCode,
        },
        returnUrl,
        test: isTest,
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
  ) {
    appSubscriptionCreate(
      name: $name
      lineItems: $lineItems
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
