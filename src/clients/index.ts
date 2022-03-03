import {GraphqlClient as Graphql} from './graphql';
import {StorefrontClient as Storefront} from './graphql/storefront_client';

const ShopifyClients = {
  Graphql,
  Storefront,
};

export default ShopifyClients;
export {ShopifyClients};
