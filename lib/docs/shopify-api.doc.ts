import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  // The title of the page.
  name: 'shopifyApi',
  // Optional. A description of the reference entity. Can include Markdown.
  description:
    'Creates a new library object that provides all features needed for an app to interact with Shopify APIs.\n\nUse this function when you set up your app.',
  // Optional. A short sentence of what is needed to use this entity, such as a version dependency.
  requires: '',
  // Optional. What category the entity is: component, hook, utility, etc.
  type: 'Entry point',
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
          code: './examples/shopify-api.example.ts',
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
      title: 'config',
      // Description of the definitions. Can use Markdown.
      description: 'Parameter passed into `shopifyApi`.',
      // Name of the TypeScript type this entity uses.
      type: 'ConfigParams',
    },
    {
      // Title of the list of definitions.
      title: 'Shopify',
      // Description of the definitions. Can use Markdown.
      description: 'Object returned by `shopifyApi`.',
      // Name of the TypeScript type this entity uses.
      type: 'Shopify',
    },
  ],
  // This determines where in the sidebar the entity will appear.
  category: 'Entry point',
  // Optional. A thumbnail image to display in the category page.
  thumbnail: '',
  related: [],
};

export default data;
