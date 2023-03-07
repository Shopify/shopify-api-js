import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  // The title of the page.
  name: 'callback',
  // Optional. A description of the reference entity. Can include Markdown.
  description:
    "Process Shopify's callback request after the user approves the app installation. Once the merchant approves the app's request for scopes, Shopify will redirect them back to your app, using the `callbackPath` parameter from `auth.begin`.\n\nYour app must then call `auth.callback` to complete the OAuth process, which will create a new Shopify `Session` and return the appropriate HTTP headers your app with which your app must respond.",
  // Optional. What category the entity is: component, hook, utility, etc.
  type: 'async',
  // Boolean that determines if the entity is a visual component.
  isVisualComponent: false,
  // Optional. The example that appears in the right hand column at the top of the page. Represents the primary use case.
  defaultExample: {
    // The data for the codeblock.
    codeblock: {
      // Tabs that appear at the top of the codeblock.
      tabs: [
        {
          // Optional. The title of the tab.
          title: 'Node.js',
          // The relative file path to the code file. Content will be automatically extracted from that file.
          code: './examples/callback.node.example.ts',
          // Optional. The name of the language of the code.
          language: 'js',
        },
        {
          // Optional. The title of the tab.
          title: 'Cloudflare Workers',
          // The relative file path to the code file. Content will be automatically extracted from that file.
          code: './examples/callback.cloudflare.example.ts',
          // Optional. The name of the language of the code.
          language: 'js',
        },
      ],
      // The title of the codeblock.
      title: 'complete the OAuth process',
    },
  },
  // Optional. Displays generated TypeScript information, such as prop tables.
  definitions: [
    {
      title: 'callback Parameters',
      description: 'Parameters for the `callback` function.',
      type: 'CallbackParams',
    },
    {
      title: 'callback Return',
      description: 'Return type of the `callback` function.',
      type: 'CallbackResponse',
    },
  ],
  // This determines where in the sidebar the entity will appear.
  category: 'auth',
  // Optional. Further determines where in the sidebar category an entity will appear.
  thumbnail: '',
  // Optional. A section for examples. Examples may be grouped or ungrouped.
  // A section that displays related entities in a grid of cards.
  related: [],
};

export default data;
