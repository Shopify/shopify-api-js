"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GraphqlClient = void 0;
var graphql_client_1 = require("./graphql_client");
Object.defineProperty(exports, "GraphqlClient", { enumerable: true, get: function () { return graphql_client_1.GraphqlClient; } });
var ShopifyGraphqlClient = {
    GraphqlClient: graphql_client_1.GraphqlClient,
};
exports.default = ShopifyGraphqlClient;
