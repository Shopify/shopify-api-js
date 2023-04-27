import {ConfigInterface} from '../base-types';
import {graphqlClientClass} from '../clients/graphql/graphql_client';
import {BillingError} from '../error';
import {BillingCancelParams} from '../types';

import {CancelResponse} from './types';

const CANCEL_MUTATION = `
  mutation appSubscriptionCancel($id: ID!, $returnUrl: String!) {
    appSubscriptionCancel(id: $id) {
      appSubscription {
        id
        name
        test
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export function cancel(config: ConfigInterface) {
  return async function (
    subscriptionInfo: BillingCancelParams,
  ): Promise<CancelResponse> {
    const {session, subscriptionId, prorate = true} = subscriptionInfo;

    const GraphqlClient = graphqlClientClass({config});
    const client = new GraphqlClient({session});

    const response = await client.query<CancelResponse>({
      data: {
        query: CANCEL_MUTATION,
        variables: {
          id: subscriptionId,
          prorate,
        },
      },
    });

    if (response.body.errors?.length) {
      throw new BillingError({
        message: 'Error while canceling a subscription',
        errorData: response.body.errors,
      });
    }

    return response.body;
  };
}
