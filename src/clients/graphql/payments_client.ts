import {GraphqlClient} from './graphql_client';

export class PaymentsClient extends GraphqlClient {
  protected baseApiPath = '/payments_apps/api';
}
