export default function validateShop(shop: string): boolean {
  const shopUrlRegex = /^https:\/\/[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com[/]*$/;
  return shopUrlRegex.test(shop);
}
