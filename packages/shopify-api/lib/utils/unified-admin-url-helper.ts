// This class assumes the legacy url has been sanitized already
// Converts admin.shopify.com/store/my-shop to my-shop.myshopify.com
export function unifiedAdminUrlToLegacyUrl() {
  return (unifiedAdminUrl: string): string | null => {
    const isUnifiedAdminUrl = unifiedAdminUrl.split('.')[0] === 'admin';

    if (!isUnifiedAdminUrl) {
      return null;
    }

    const urlComponents = unifiedAdminUrl.split('/');
    const shopName = urlComponents[urlComponents.length - 1];

    const isSpinUrl = unifiedAdminUrl.includes('spin.dev/store/');
    if (isSpinUrl) {
      const spinUrlComponents = unifiedAdminUrl
        .split('.')
        .slice(2, 5)
        .join('.');

      return `${shopName}.shopify.${spinUrlComponents}.spin.dev`;
    } else {
      return `${shopName}.myshopify.com`;
    }
  };
}

// Converts my-shop.myshopify.com to admin.shopify.com/store/my-shop
export function legacyUrlToUnifiedAdminUrl() {
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
