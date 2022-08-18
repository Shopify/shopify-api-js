import {RestClient as Rest} from './rest';
import {GraphqlClient as Graphql} from './graphql';
import {PaymentsClient as Payments} from './graphql/payments_client';
import {StorefrontClient as Storefront} from './graphql/storefront_client';

const ShopifyClients = {
  Rest,
  Graphql,
  Payments,
  Storefront,
};

export default ShopifyClients;
export {ShopifyClients};
