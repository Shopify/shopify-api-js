import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  // The title of the page.
  name: 'check',
  // Optional. A description of the reference entity. Can include Markdown.
  description:
    "Checks if a payment exists for any of the given plans, by querying the Shopify Admin API.\n\n > Note: \nDepending on the number of requests your app handles, you might want to cache a merchant's payment status, but you should periodically call this method to ensure you're blocking unpaid access.",
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
          // The relative file path to the code file. Content will be automatically extracted from that file.
          code: './examples/check.example.ts',
          // Optional. The name of the language of the code.
          language: 'js',
        },
      ],
      // The title of the codeblock.
      title: 'check',
    },
  },
  // Optional. Displays generated TypeScript information, such as prop tables.
  definitions: [
    {
      title: 'check Parameters',
      description: 'Parameters for the `check` function.',
      type: 'CheckParams',
    },
    {
      title: 'check Return',
      description:
        '`true` if there is a payment for any of the given plans, and `false` otherwise.',
      type: 'CheckResponse',
    },
  ],
  // This determines where in the sidebar the entity will appear.
  category: 'billing',
  // Optional. Further determines where in the sidebar category an entity will appear.
  thumbnail: '',
  // Optional. A section for examples. Examples may be grouped or ungrouped.
  // A section that displays related entities in a grid of cards.
  related: [],
};

export default data;
