import {InvalidHostError, InvalidShopError} from '../error';
import {Context} from '../context';

/**
 * Validates and sanitizes shop domain urls. If Context.CUSTOM_SHOP_DOMAINS is set, shops ending in those domains are
 * allowed. Accepts myshopify.com and myshopify.io by default.
 *
 * @param shop Shop url: {shop}.{domain}
 * @param throwOnInvalid Whether to raise an exception if the shop is invalid
 */
export function sanitizeShop(
  shop: string,
  throwOnInvalid = false,
): string | null {
  const domainsRegex = ['myshopify\\.com', 'myshopify\\.io'];
  if (Context.CUSTOM_SHOP_DOMAINS) {
    domainsRegex.push(
      ...Context.CUSTOM_SHOP_DOMAINS.map((regex) =>
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
}

/**
 * Validates and sanitizes Shopify host arguments.
 *
 * @param host Host address
 * @param throwOnInvalid Whether to raise an exception if the host is invalid
 */
export function sanitizeHost(
  host: string,
  throwOnInvalid = false,
): string | null {
  const base64regex = /^[0-9a-zA-Z+/]+={0,2}$/;

  const sanitizedHost = base64regex.test(host) ? host : null;
  if (!sanitizedHost && throwOnInvalid) {
    throw new InvalidHostError('Received invalid host argument');
  }

  return sanitizedHost;
}
