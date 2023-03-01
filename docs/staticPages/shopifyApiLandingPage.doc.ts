import {LandingTemplateSchema} from '@shopify/generate-docs';

const data: LandingTemplateSchema = {
  title: '@shopify/shopify-api',
  description:
    'The `@shopify/shopify-api` package provides a simple interface for making requests to the Shopify Admin API.',
  image: '',
  darkImage: '',
  mobileImage: '',
  mobileDarkImage: '',
  id: 'shopify-api-js',
  sections: [
    {
      type: 'Generic',
      anchorLink: 'installation',
      title: 'Installing the package',
      sectionContent:
        'Use your package manager of choice to install the package.',
      codeblock: {
        title: 'Installing',
        tabs: [
          {
            title: 'npm',
            code: './examples/installing-npm.bash',
            language: 'bash',
          },
          {
            title: 'yarn',
            code: './examples/installing-yarn.bash',
            language: 'bash',
          },
          {
            title: 'pnpm',
            code: './examples/installing-pnpm.bash',
            language: 'bash',
          },
        ],
      },
      initialLanguage: 'bash',
    },
    {
      type: 'Generic',
      anchorLink: 'shopify-api',
      title: 'shopifyApi',
      sectionContent:
        'The starting point for using the Shopify Admin API library for JavaScript is `shopifyApi`.',
      sectionCard: [
        {
          name: 'shopifyApi reference',
          url: '/docs/api/shopify-api-js/shopify/shopifyapi',
          type: 'blocks',
        },
      ],
    },
    {
      type: 'Resource',
      anchorLink: 'resources',
      title: 'Resources',
      resources: [],
    },
  ],
};

export default data;
