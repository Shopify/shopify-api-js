import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  // The title of the page.
  name: 'shopifyApi',
  // Optional. A description of the reference entity. Can include Markdown.
  description: 'Creates an instance of the Shopify API library.',
  // Optional. If used will cause the page to only be visible when the feature flag is enabled.
  featureFlag: '',
  // Optional. A short sentence of what is needed to use this entity, such as a version dependency.
  requires: '',
  // Optional. What category the entity is: component, hook, utility, etc.
  type: '',
  // Boolean that determines if the entity is a visual component.
  isVisualComponent: false,
  // Optional. The example that appears in the right hand column at the top of the page. Represents the primary use case.
  defaultExample: {
    // Optional. If used will cause the card to only be visible when the feature flag is enabled.
    featureFlag: '',
    // Optional. An image preview of the example.
    image: '',
    // The data for the codeblock.
    codeblock: {
      // Tabs that appear at the top of the codeblock.
      tabs: [
        {
          // Optional. The title of the tab.
          title: 'JS',
          // The relative file path to the code file. Content will be automatically extracted from that file.
          code: './examples/shopifyApi.example.js',
          // Optional. The name of the language of the code.
          language: 'js',
        },
      ],
      // The title of the codeblock.
      title: 'Create the Shopify API library',
    },
  },
  // Optional. Displays generated TypeScript information, such as prop tables.
  definitions: [
    {
      // Title of the list of definitions.
      title: 'shopifyApi',
      // Description of the definitions. Can use Markdown.
      description: '',
      // Name of the TypeScript type this entity uses.
      type: 'Shopify',
    },
  ],
  // This determines where in the sidebar the entity will appear.
  category: 'shopify-api-js',
  // Optional. Further determines where in the sidebar category an entity will appear.
  subCategory: 'shopifyApi',
  // Optional. A thumbnail image to display in the category page.
  thumbnail: '',
  related: [],
};

export default data;
