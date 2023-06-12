import {httpClientClass} from '../http_client/http_client';

import {GraphqlClient, GraphqlClientClassParams} from './graphql_client';
import {PaymentsAppsClientParams} from './types';

export class PaymentsAppsClient extends GraphqlClient {
  baseApiPath = '/payments_apps/api';

  constructor(params: PaymentsAppsClientParams) {
    super(params);
  }
}

export function paymentsAppsClientClass(params: GraphqlClientClassParams) {
  const {config} = params;
  let {HttpClient} = params;
  if (!HttpClient) {
    HttpClient = httpClientClass(config);
  }
  class NewPaymentsAppsClient extends PaymentsAppsClient {
    public static config = config;
    public static HttpClient = HttpClient!;
  }

  Reflect.defineProperty(NewPaymentsAppsClient, 'name', {
    value: 'PaymentsAppsClient',
  });

  return NewPaymentsAppsClient as typeof PaymentsAppsClient;
}
