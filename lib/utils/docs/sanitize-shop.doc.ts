import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

const data: ReferenceEntityTemplateSchema = {
  name: 'sanitizeShop',
  description:
    "This method makes user inputs safer by ensuring that a given shop value is a properly formatted Shopify shop domain.\n\n > Note:\nIf you're using custom shop domains for testing, you can use the `customShopDomains` setting to add allowed domains.",
  type: '',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          code: './examples/sanitize-shop.example.ts',
          language: 'js',
        },
      ],
      title: 'sanitizeShop',
    },
  },
  definitions: [
    {
      title: 'Parameters',
      description: '',
      type: 'SanitizeShopParams',
    },
    {
      title: 'Returns',
      description:
        'The `shop` value if it is a properly formatted Shopify shop domain, otherwise `null`.',
      type: 'SanitizeShopReturns',
    },
  ],
  category: 'utils',
  related: [],
};

export default data;
