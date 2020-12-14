import * as Rest from './rest';
import * as Graphql from './graphql';

const ShopifyClients = {
  Rest: Rest,
  Graphql: Graphql,
};

export default ShopifyClients;
export { ShopifyClients };
