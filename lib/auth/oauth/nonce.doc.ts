import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  // The title of the page.
  name: 'nonce',
  // Optional. A description of the reference entity. Can include Markdown.
  description:
    'Generates a string of 15 characters that are cryptographically random, suitable for short-lived values in cookies to aid validation of requests/responses.',
  // Optional. What category the entity is: component, hook, utility, etc.
  type: '',
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
          code: './examples/nonce.example.ts',
          // Optional. The name of the language of the code.
          language: 'js',
        },
      ],
      // The title of the codeblock.
      title: 'nonce',
    },
  },
  definitions: [
    {
      title: 'Props',
      description: '',
      type: 'NonceGeneratedType',
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
