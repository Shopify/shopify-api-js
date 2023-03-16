import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

const data: ReferenceEntityTemplateSchema = {
  name: 'getCurrentId',
  description:
    'Extracts the Shopify session id from the given request.\n\nFor embedded apps, `getCurrentId` will only be able to find a session id if you use `authenticatedFetch` from the `@shopify/app-bridge-utils` client-side package.\n\nThis function behaves like a [normal `fetch` call](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), but ensures the appropriate headers are set.\n\nLearn more about [making authenticated requests](https://shopify.dev/docs/apps/auth/oauth/session-tokens/getting-started#step-2-authenticate-your-requests) using App Bridge.\n\n> Note:\nThis method will rely on cookies for non-embedded apps, and the `Authorization` HTTP header for embedded apps using [App Bridge session tokens](https://shopify.dev/docs/apps/auth/oauth/session-tokens), making all apps safe to use in modern browsers that block 3rd party cookies.',
  type: 'async',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          code: './examples/get-current-id.example.ts',
          language: 'js',
        },
      ],
      title: 'getCurrentId',
    },
  },
  definitions: [
    {
      title: 'Props',
      description: '',
      type: 'GetCurrentIdGeneratedType',
    },
  ],
  category: 'session',
  related: [],
};

export default data;
