# Creating a store-specific custom app

A custom app is an app that you or a developer builds exclusively for your Shopify store (unlike a public app, which is built to be used by many stores). You can use custom apps to add features to your Shopify admin, access your store's data directly using Shopify's APIs, or extend your online store to other platforms using the Storefront API. Sometimes such a custom app is referred to as a "private app".

## Prerequisites

1. [Enable custom app development from the Shopify admin](https://help.shopify.com/en/manual/apps/custom-apps#enable-custom-app-development-from-the-shopify-admin)
2. [Create and install a custom app](https://help.shopify.com/en/manual/apps/custom-apps#create-and-install-a-custom-app)
3. :warning: Have a secure copy of the Admin API access token from the previous step.

## Basic concepts

A store-specific custom app does not use the OAuth process to authenticate - it uses the secrets established during the app creation and install process to access the API.  As a result, there are no sessions to be retrieved from incoming requests and stored in a database, etc.

When initializing `shopifyApi` in a custom app, set the `isPrivateApp` configuration property to `true`, and set the `apiSecretKey` to the **Admin API access token** obtained during the installation process (step 2 in the [prerequisites](#prerequisites)).

The `scopes` configuration property must be set to something for initialization to work.  However, the value is ignored as the scopes of the app are set during the create and install process (step 2 in the [prerequisites](#prerequisites)) and are linked to the Admin API access token.

## Example

### Initialization

```js
import "@shopify/shopify-api/adapters/node";
import { shopifyApi, LATEST_API_VERSION, Session } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-01";

const shopify = shopifyApi({
  apiKey: "App_API_key",
  apiSecretKey: "Admin_API_Access_Token", // Note: this is the API Access Token, NOT the API Secret Key
  apiVersion: LATEST_API_VERSION,
  isPrivateApp: true,                     // this MUST be set to true (default is false)
  scopes: ["read_products"],              // this must have a value but it will be ignored by the library
  isEmbeddedApp: false,
  hostName: "my-shop.myshopify.com",
  // Mount REST resources.
  restResources,
});
```

> **Note** The `apiSecretKey` is **NOT** set to the API secret key but to the **Admin API Access Token**.

### Making requests

API requests, either using `shopify.clients.Rest` or `shopify.clients.Graphql`, or using the REST resources, require a `session` parameter.  Since there are no sessions in a store-specific custom app, a `session` parameter needs to be created.

To create the session object, the `id`, `state` and `isOnline` properties must be populated but will be ignored.  Only the `shop` parameter is required when making the API requests from a store specifc custom app and the value must match the stop on which the custom app is installed.

```js
const session = new Session({
  id: 'not-a-real-session-id',            // must have a string value, will be ignored
  shop: "my-shop.myshopify.com",  // MUST match shop on which custom app is installed
  state: "state",                         // must have a string value, will be ignored
  isOnline: false,                        // must have a boolean value, will be ignored
});

// Use REST resources to make calls.
const { count: productCount } = await shopify.rest.Product.count({ session });
const { count: customerCount } = await shopify.rest.Customer.count({ session });
const { count: orderCount } = await shopify.rest.Order.count({ session });

console.log(
  `There are ${productCount} products, ${customerCount} customers, and ${orderCount} orders in the ${session.shop} store.`
);
```
