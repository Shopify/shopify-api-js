import {ConfigInterface} from '../base-types';
import {InvalidHostError, InvalidShopError} from '../error';
import {decodeHost} from '../auth/decode-host';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - only required for doc generation
interface SanitizeShopParams {
  /** The shop to sanitize. */
  shop: string;
  /** Whether to throw an error if the shop is invalid. Defaults to `false`. */
  throwOnInvalid?: boolean;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - only required for doc generation
type SanitizeShopReturns = string | null;

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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - only required for doc generation
interface SanitizeHostParams {
  /** The incoming host value to sanitize. */
  host: string;
  /** Whether to throw an error if the host is invalid. Defaults to `false`. */
  throwOnInvalid?: boolean;
}
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - only required for doc generation
type SanitizeHostReturns = string | null;

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
