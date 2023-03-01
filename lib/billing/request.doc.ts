import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  name: 'request',
  description: 'Creates a new charge for the merchant, for the given plan.',
  type: 'async',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          title: 'Single-plan setup - charge after OAuth completes',
          code: './examples/request.single-plan.example.ts',
          language: 'js',
        },
        {
          title: 'Multi-plan setup - charge based on user selection',
          code: './examples/request.multi-plan.example.ts',
          language: 'js',
        },
      ],
      title: 'request',
    },
  },
  definitions: [
    {
      // Title of the list of definitions.
      title: 'request Parameters',
      // Description of the definitions. Can use Markdown.
      description: 'Parameters for the `request` function.',
      // Name of the TypeScript type this entity uses.
      type: 'RequestParams',
    },
    {
      title: 'request Return',
      description:
        "The URL to confirm the charge with the merchant - we don't redirect right away to make it possible for apps to run their own code after it creates the payment request.\n\nThe app must redirect the merchant to this URL so that they can confirm the charge before Shopify applies it. The merchant will be sent back to your app's main page after the process is complete.",
      type: 'BillingRequestResponse',
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
