import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

// Order of data shape mimics visual structure of page
// Anything in an array can have multiple objects

const data: ReferenceEntityTemplateSchema = {
  name: 'versionCompatible',
  description:
    "This method determines if the given version is compatible (equal to or newer) with the configured `apiVersion` for the `shopifyApi` object. Its main use is when you want to tweak behaviour depending on your current API version, though apps won't typically need this kind of check.",
  type: '',
  isVisualComponent: false,
  defaultExample: {
    codeblock: {
      tabs: [
        {
          code: './examples/version-compatible.example.ts',
          language: 'js',
        },
      ],
      title: 'versionCompatibile',
    },
  },
  definitions: [
    {
      title: 'Parameters',
      description: '',
      type: 'VersionCompatibileParams',
    },
    {
      title: 'Returns',
      description:
        '`true` if the given version is compatible with the configured `apiVersion`.',
      type: 'VersionCompatibleReturns',
    },
  ],
  category: 'utils',
  related: [],
};

export default data;
