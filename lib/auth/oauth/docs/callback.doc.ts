import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

const data: ReferenceEntityTemplateSchema = {
  name: 'callback',
  description:
    "Process Shopify's callback request after the user approves the app installation. Once the merchant approves the app's request for scopes, Shopify will redirect them back to your app, using the `callbackPath` parameter from `auth.begin`.\n\nYour app must then call `auth.callback` to complete the OAuth process, which will create a new Shopify `Session` and return the appropriate HTTP headers your app with which your app must respond.",
  type: 'async',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          title: 'Node.js',
          code: './examples/callback.node.example.ts',
          language: 'js',
        },
        {
          title: 'Cloudflare Workers',
          code: './examples/callback.cloudflare.example.ts',
          language: 'js',
        },
      ],
      title: 'complete the OAuth process',
    },
  },
  definitions: [
    {
      title: 'Props',
      description: '',
      type: 'CallbackGeneratedType',
    },
  ],
  category: 'auth',
  thumbnail: '',
  related: [],
};

export default data;
