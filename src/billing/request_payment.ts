import {GraphqlClient} from '../clients/graphql';
import {SessionInterface} from '../auth/session/types';
import {config} from '../config';
import {BillingError} from '../error';
import {buildEmbeddedAppUrl} from '../utils/get-embedded-app-url';

import {isRecurring} from './is_recurring';
import {
  RequestResponse,
  RecurringPaymentResponse,
  SinglePaymentResponse,
} from './types';

export async function requestPayment(
  session: SessionInterface,
  isTest: boolean,
): Promise<string | undefined> {
  const returnUrl = buildEmbeddedAppUrl(
    Buffer.from(`${session.shop}/admin`).toString('base64'),
  );

  let data: RequestResponse;
  if (isRecurring()) {
    const mutationResponse = await requestRecurringPayment(
      session,
      returnUrl,
      isTest,
    );
    data = mutationResponse.data.appSubscriptionCreate;
  } else {
    const mutationResponse = await requestSinglePayment(
      session,
      returnUrl,
      isTest,
    );
    data = mutationResponse.data.appPurchaseOneTimeCreate;
  }

  if (data.userErrors?.length) {
    throw new BillingError({
      message: 'Error while billing the store',
      errorData: data.userErrors,
    });
  }

  return data.confirmationUrl;
}

async function requestRecurringPayment(
  session: SessionInterface,
  returnUrl: string,
  isTest: boolean,
): Promise<RecurringPaymentResponse> {
  if (!config.billing) {
    throw new BillingError({
      message: 'Attempted to request recurring payment without billing configs',
      errorData: [],
    });
  }

  const client = new GraphqlClient(session.shop, session.accessToken);

  const mutationResponse = await client.query<RecurringPaymentResponse>({
    data: {
      query: RECURRING_PURCHASE_MUTATION,
      variables: {
        name: config.billing.chargeName,
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                interval: config.billing.interval,
                price: {
                  amount: config.billing.amount,
                  currencyCode: config.billing.currencyCode,
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

async function requestSinglePayment(
  session: SessionInterface,
  returnUrl: string,
  isTest: boolean,
): Promise<SinglePaymentResponse> {
  if (!config.billing) {
    throw new BillingError({
      message: 'Attempted to request single payment without billing configs',
      errorData: [],
    });
  }

  const client = new GraphqlClient(session.shop, session.accessToken);

  const mutationResponse = await client.query<SinglePaymentResponse>({
    data: {
      query: ONE_TIME_PURCHASE_MUTATION,
      variables: {
        name: config.billing.chargeName,
        price: {
          amount: config.billing.amount,
          currencyCode: config.billing.currencyCode,
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
