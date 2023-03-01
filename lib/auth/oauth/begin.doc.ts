import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  // The title of the page.
  name: 'begin',
  // Optional. A description of the reference entity. Can include Markdown.
  description:
    'Begins the OAuth process by redirecting the merchant to the Shopify Authentication screen, where they will be asked to approve the required app scopes.',
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
          code: './examples/begin.node.example.ts',
          // Optional. The name of the language of the code.
          language: 'js',
        },
        {
          // Optional. The title of the tab.
          title: 'Cloudflare Workers',
          // The relative file path to the code file. Content will be automatically extracted from that file.
          code: './examples/begin.cloudflare.example.ts',
          // Optional. The name of the language of the code.
          language: 'js',
        },
      ],
      // The title of the codeblock.
      title: 'begin an OAuth process',
    },
  },
  // Optional. Displays generated TypeScript information, such as prop tables.
  definitions: [
    {
      // Title of the list of definitions.
      title: 'begin Parameters',
      // Description of the definitions. Can use Markdown.
      description: 'Parameters for the `begin` function.',
      // Name of the TypeScript type this entity uses.
      type: 'BeginParams',
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
