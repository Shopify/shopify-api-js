/**
 * Validates myshopify.com urls
 *
 * @param shop Shop url: {shop}.myshopify.com
 */
export default function validateShop(shop: string): boolean {
  console.warn(
    'Deprecation notice: validateShop will be removed in the next major release.',
  );
  const shopUrlRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.(com|io)[/]*$/;
  return shopUrlRegex.test(shop);
}
