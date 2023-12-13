# Typing GraphQL operations

Since v9, `@shopify/shopify-api` is using `@shopify/admin-api-client` and `@shopify/storefront-api-client` to interact with those APIs.

The main advantage those clients bring are the ability to use [Codegen](https://the-guild.dev/graphql/codegen) to automatically parse and create types for your queries and mutations.

Here is an example of the experience you can get after going through this process:

[typing-graphql-operations.webm](https://github.com/Shopify/shopify-api-js/assets/64600052/a0fed145-b9e1-40b6-9fe0-9d19d9d4c2db)

In this page we'll go over the process of integrating `@shopify/api-codegen-preset` into your app to get all its benefits.

## Set up

The first step is to install the packages using your preferred package manager:

```bash
yarn add --dev @shopify/api-codegen-preset
yarn add @shopify/admin-api-client @shopify/storefront-api-client
```

```bash
npm add --save-dev @shopify/api-codegen-preset
npm add @shopify/admin-api-client @shopify/storefront-api-client
```

```bash
pnpm add --save-dev @shopify/api-codegen-preset
pnpm add @shopify/admin-api-client @shopify/storefront-api-client
```

> [!NOTE]
> The app will need to add the clients as direct dependencies so Codegen can overload the types with the ones parsed from your code.

The codegen package includes all the dependencies you'll need to run [`@graphql-codegen/cli`](https://www.npmjs.com/package/@graphql-codegen/cli), including the `graphql-codegen` script.

Then, you can add a `.graphqlrc.ts` file in your app's root.
See the [package documentation](../../../api-codegen-preset/README.md#configuration) for more details on setting up the appropriate configuration.

## Generating types

Once you configure your app, you can run `graphql-codegen` to start parsing your queries for types.

To do that, add this `script` to your `package.json` file:

```json
{
  "scripts": {
    // ...
    "graphql-codegen": "graphql-codegen"
  }
}
```

You can then run the script using your package manager:

```sh
yarn graphql-codegen
```

```sh
npm run graphql-codegen
```

```sh
pnpm run graphql-codegen
```

> [!NOTE]
> Codegen will fail if it can't find any documents to parse.
> To fix that, either create a query or set the [`ignoreNoDocuments` option](https://the-guild.dev/graphql/codegen/docs/config-reference/codegen-config#configuration-options) to `true`.

When the script runs, it'll create a new `admin.generated.d.ts` file - or `storefront` depending on your configuration.
The `@shopify/shopify-api` package will automatically apply the types created in those files, so your queries will have variables and return types automatically!

> [!NOTE]
> Make sure to include the `.generated.d.ts` files in your `tsconfig` `"include"` configuration for the types to load.

To make your development flow faster, you can pass in the `--watch` flag to update the query types whenever you save a file:

```sh
npm run graphql-codegen -- --watch
```
