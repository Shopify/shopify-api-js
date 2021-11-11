import { RestClient as Rest } from './rest';
import { GraphqlClient as Graphql } from './graphql';
import { StorefrontClient as Storefront } from './graphql/storefront_client';
declare const ShopifyClients: {
    Rest: typeof Rest;
    Graphql: typeof Graphql;
    Storefront: typeof Storefront;
};
export default ShopifyClients;
export { ShopifyClients };
//# sourceMappingURL=index.d.ts.map