import {ConfigInterface} from '../base-types';
import {InvalidHostError, InvalidShopError} from '../error';
import {decodeHost} from '../auth/decode-host';

export function sanitizeShop(config: ConfigInterface) {
  return (shop: string, throwOnInvalid = false): string | null => {
    const domainsRegex = ['myshopify\\.com', 'shopify\\.com', 'myshopify\\.io'];
    if (config.customShopDomains) {
      domainsRegex.push(
        ...config.customShopDomains.map((regex) =>
          typeof regex === 'string' ? regex : regex.source,
        ),
      );
    }

    const shopUrlRegex = new RegExp(
      `^[a-zA-Z0-9][a-zA-Z0-9-_]*\\.(${domainsRegex.join('|')})[/]*$`,
    );

    const sanitizedShop = shopUrlRegex.test(shop) ? shop : null;
    if (!sanitizedShop && throwOnInvalid) {
      throw new InvalidShopError('Received invalid shop argument');
    }

    return sanitizedShop;
  };
}

export function sanitizeHost(config: ConfigInterface) {
  return (host: string, throwOnInvalid = false): string | null => {
    const base64regex = /^[0-9a-zA-Z+/]+={0,2}$/;

    let sanitizedHost = base64regex.test(host) ? host : null;
    if (sanitizedHost) {
      const url = new URL(`https://${decodeHost(sanitizedHost)}`);
      if (!sanitizeShop(config)(url.hostname, false)) {
        sanitizedHost = null;
      }
    }
    if (!sanitizedHost && throwOnInvalid) {
      throw new InvalidHostError('Received invalid host argument');
    }

    return sanitizedHost;
  };
}
