import {ConfigInterface} from '../base-types';
import {FeatureEnabled, FutureFlagOptions} from '../../future/flags';

import {begin, callback} from './oauth/oauth';
import {nonce} from './oauth/nonce';
import {safeCompare} from './oauth/safe-compare';
import {getEmbeddedAppUrl, buildEmbeddedAppUrl} from './get-embedded-app-url';
import {TokenExchange, tokenExchange} from './oauth/token-exchange';

export function shopifyAuth<Config extends ConfigInterface>(
  config: Config,
): ShopifyAuth<Config['future']> {
  const shopify = {
    begin: begin(config),
    callback: callback(config),
    nonce,
    safeCompare,
    getEmbeddedAppUrl: getEmbeddedAppUrl(config),
    buildEmbeddedAppUrl: buildEmbeddedAppUrl(config),
  } as ShopifyAuth<Config['future']>;

  if (config.future?.unstable_tokenExchange) {
    shopify.tokenExchange = tokenExchange(config);
  }

  return shopify;
}

export type ShopifyAuth<Future extends FutureFlagOptions> = {
  begin: ReturnType<typeof begin>;
  callback: ReturnType<typeof callback>;
  nonce: typeof nonce;
  safeCompare: typeof safeCompare;
  getEmbeddedAppUrl: ReturnType<typeof getEmbeddedAppUrl>;
  buildEmbeddedAppUrl: ReturnType<typeof buildEmbeddedAppUrl>;
} & (FeatureEnabled<Future, 'unstable_tokenExchange'> extends true
  ? {tokenExchange: TokenExchange}
  : {[key: string]: never});
