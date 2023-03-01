import {shopifyApi, ApiVersion, BillingInterval} from '@shopify/shopify-api';
import {restResources} from '@shopify/shopify-api/rest/admin/2022-07';

const shopify = shopifyApi({
  apiKey: 'APIKeyFromPartnersDashboard',
  apiSecretKey: 'APISecretFromPartnersDashboard',
  scopes: ['read_products'],
  hostName: 'localhost:4321',
  hostScheme: 'http',
  apiVersion: ApiVersion.July22,
  isEmbeddedApp: true,
  isCustomStoreApp: false,
  userAgentPrefix: 'Custom prefix',
  privateAppStorefrontAccessToken: 'PrivateAccessToken',
  customShopDomains: ['*.my-custom-domain.io'],
  billing: {
    'My plan': {
      amount: 5.0,
      currencyCode: 'USD',
      interval: BillingInterval.OneTime,
    },
  },
  logger: {
    log: (severity, message) => {
      myAppsLogFunction(severity, message);
    },
  },
  restResources,
});
