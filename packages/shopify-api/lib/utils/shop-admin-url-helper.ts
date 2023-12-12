// This class assumes the legacy url has protocol stripped already
// Converts admin.shopify.com/store/my-shop to my-shop.myshopify.com
export function shopAdminUrlToLegacyUrl() {
  return (shopAdminUrl: string): string | null => {
    const isShopAdminUrl = shopAdminUrl.split('.')[0] === 'admin';

    if (!isShopAdminUrl) {
      return null;
    }

    const urlComponents = shopAdminUrl.split('/');
    const shopName = urlComponents[urlComponents.length - 1];

    const isSpinUrl = shopAdminUrl.includes('spin.dev/store/');
    if (isSpinUrl) {
      const spinUrlComponents = shopAdminUrl.split('.').slice(2, 5).join('.');

      return `${shopName}.shopify.${spinUrlComponents}.spin.dev`;
    } else {
      return `${shopName}.myshopify.com`;
    }
  };
}

// Converts my-shop.myshopify.com to admin.shopify.com/store/my-shop
export function legacyUrlToShopAdminUrl() {
  return (legacyAdminUrl: string): string | null => {
    const shopName = legacyAdminUrl.split('.')[0];

    const isSpinUrl = legacyAdminUrl.endsWith('spin.dev');
    if (isSpinUrl) {
      const spinUrlComponents = legacyAdminUrl.split('.').slice(2, 5).join('.');
      return `admin.web.${spinUrlComponents}.spin.dev/store/${shopName}`;
    } else {
      return `admin.shopify.com/store/${shopName}`;
    }
  };
}
