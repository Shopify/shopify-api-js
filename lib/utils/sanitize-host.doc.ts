import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

const data: ReferenceEntityTemplateSchema = {
  name: 'sanitizeHost',
  description:
    'This method makes user inputs safer by ensuring that the `host` query arguments from Shopify requests is valid.',
  type: '',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          code: './examples/sanitize-host.example.ts',
          language: 'js',
        },
      ],
      title: 'sanitizeHost',
    },
  },
  definitions: [
    {
      title: 'Parameters',
      description: '',
      type: 'SanitizeHostParams',
    },
    {
      title: 'Returns',
      description:
        'The `host` value if it is properly formatted, otherwise `null`.',
      type: 'SanitizeHostReturns',
    },
  ],
  category: 'utils',
  related: [],
};

export default data;
