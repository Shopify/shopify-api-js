/**
 * Validates myshopify.com urls
 *
 * @param shop Shop url: {shop}.myshopify.com
 */
export default function validateShop(shop: string): boolean {
  const shopUrlRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.(com|io)[/]*$/;
  const spinUrlRegex =
    /^[a-zA-Z0-9][a-zA-Z0-9-]*\.shopify\.[a-zA-Z0-9][a-zA-Z0-9-]*\.[a-zA-Z0-9][a-zA-Z0-9-]*\.(us|asia|eu)\.spin.dev[/]*$/;
  const combinedRegex = new RegExp(
    `${shopUrlRegex.source}|${spinUrlRegex.source}`,
  );

  return combinedRegex.test(shop);
}
