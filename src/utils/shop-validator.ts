/**
 * Validates myshopify.com urls
 *
 * @param shop Shop url: {shop}.myshopify.com
 */
export default function validateShop(shop: string): boolean {
<<<<<<< HEAD
  const shopUrlRegex =
    /(^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.(com|io)[/]*$|^[a-zA-Z0-9][a-zA-Z0-9-]*\.shopify\.[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z0-9][a-zA-Z0-9-]*\.(us|asia|eu)\.spin.dev[/]*$)/;
=======
  // FIXME: Added this for debugging purposes
  if (shop.startsWith('localhost')) return true;
  const shopUrlRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.(com|io)[/]*$/;
>>>>>>> origin/isomorphic/crypto
  return shopUrlRegex.test(shop);
}
