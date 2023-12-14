// This class assumes the legacy url has protocol stripped already
// Converts admin.shopify.com/store/my-shop to my-shop.myshopify.com
export function shopAdminUrlToLegacyUrl() {
  return (shopAdminUrl: string): string | null => {
    const isShopAdminUrl = shopAdminUrl.split('.')[0] === 'admin';

    if (!isShopAdminUrl) {
      return null;
    }

    const regex = new RegExp(`admin\\..+/store/(.+)`);
    const matches = shopAdminUrl.match(regex);

    if (matches && matches.length === 2) {
      const shopName = matches[1];
      const isSpinUrl = shopAdminUrl.includes('spin.dev/store/');

      if (isSpinUrl) {
        return spinAdminUrlToLegacyUrl(shopAdminUrl);
      } else {
        return `${shopName}.myshopify.com`;
      }
    } else {
      return null;
    }
  };
}

// Converts my-shop.myshopify.com to admin.shopify.com/store/my-shop
export function legacyUrlToShopAdminUrl() {
  return (legacyAdminUrl: string): string | null => {
    const regex = new RegExp(`(.+)\\.myshopify\\.com$`);
    const matches = legacyAdminUrl.match(regex);

    if (matches && matches.length === 2) {
      const shopName = matches[1];
      return `admin.shopify.com/store/${shopName}`;
    } else {
      const isSpinUrl = legacyAdminUrl.endsWith('spin.dev');

      if (isSpinUrl) {
        return spinLegacyUrlToAdminUrl(legacyAdminUrl);
      } else {
        return null;
      }
    }
  };
}

function spinAdminUrlToLegacyUrl(shopAdminUrl: string) {
  const spinRegex = new RegExp(`admin\\.web\\.(.+\\.spin\\.dev)/store/(.+)`);
  const spinMatches = shopAdminUrl.match(spinRegex);

  if (spinMatches && spinMatches.length === 3) {
    const spinUrl = spinMatches[1];
    const shopName = spinMatches[2];
    return `${shopName}.shopify.${spinUrl}`;
  } else {
    return null;
  }
}

function spinLegacyUrlToAdminUrl(legacyAdminUrl: string) {
  const spinRegex = new RegExp(`(.+)\\.shopify\\.(.+\\.spin\\.dev)`);
  const spinMatches = legacyAdminUrl.match(spinRegex);

  if (spinMatches && spinMatches.length === 3) {
    const shopName = spinMatches[1];
    const spinUrl = spinMatches[2];
    return `admin.web.${spinUrl}/store/${shopName}`;
  } else {
    return null;
  }
}
