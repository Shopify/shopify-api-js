import * as http from 'http';

import Shopify, {
  ApiVersion,
} from './src/adapters/node';

const HOST = new URL('http://localhost:8080');
const API_KEY = process.env.API_KEY;
const API_SECRET_KEY = process.env.API_SECRET;
const SCOPES = ['write_products', 'write_customers', 'write_draft_orders'];
Shopify.Context.initialize({
  API_KEY,
  API_SECRET_KEY,
  SCOPES,
  HOST_NAME: HOST.host,
  IS_EMBEDDED_APP: true,
  API_VERSION: ApiVersion.April22,
});

const server = http.createServer(async (req, res) => {
  const parsedURL = new URL(req.url, HOST);
  if (parsedURL.pathname === '/login') {
    return Shopify.Node.beginAuth(req, res, '/api/auth/callback', {shop});
  } else if (parsedURL.pathname === '/api/auth/callback') {
    return Shopify.Node.validateAuthCallback(req, res);
  }
  res.end(req.url);
});
server.listen(8080, () =>
  console.log(`Listening on :${server.address()?.port}`),
);
