import Shopify from './src/index-cf-worker.ts';

export default {
  async fetch(req, env, ctx) {
    Shopify.Context.initialize({
      API_KEY: env.API_KEY,
      API_SECRET_KEY: env.API_SECRET_KEY,
      SCOPES: 'write_products,write_customers,write_draft_orders'.split(','),
      HOST_NAME: env.HOST?.replace(/https:\/\//, ''),
      IS_EMBEDDED_APP: true,
      API_VERSION: Shopify.API_VERSION,
    });

    return new Response(`Hello Miniflare! Here’s the context object:
      ${JSON.stringify(Shopify.Context, null, '  ')}
    `);
  },
};
