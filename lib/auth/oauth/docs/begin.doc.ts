import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

const data: ReferenceEntityTemplateSchema = {
  name: 'begin',
  description:
    'Begins the OAuth process by redirecting the merchant to the Shopify Authentication screen, where they will be asked to approve the required app scopes.',
  type: 'async',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          title: 'Node.js',
          code: './examples/begin.node.example.ts',
          language: 'js',
        },
        {
          title: 'Cloudflare Workers',
          code: './examples/begin.cloudflare.example.ts',
          language: 'js',
        },
      ],
      title: 'begin an OAuth process',
    },
  },
  definitions: [
    {
      title: 'Props',
      description: '',
      type: 'BeginGeneratedType',
    },
  ],
  category: 'auth',
  thumbnail: '',
  related: [],
};

export default data;
