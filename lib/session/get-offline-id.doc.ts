import {ReferenceEntityTemplateSchema} from '@shopify/generate-docs';

const data: ReferenceEntityTemplateSchema = {
  name: 'getOfflineId',
  description:
    'Builds a session id that can be used to load an offline session, if there was a [`auth.begin`](/docs/api/shopify-api-js/auth/begin) call to create one.\n\n> Caution:\nThis method **_does not_** perform any validation on the `shop` parameter because it is meant for background tasks. You should **_never_** read the shop from user inputs or URLs.',
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
      title: 'getOfflineId',
    },
  },
  definitions: [
    {
      title: 'Props',
      description: '',
      type: 'GetOfflineIdFunction',
    },
    // {
    //   title: 'Parameters',
    //   description: '',
    //   type: 'GetOfflineIdParams',
    // },
    // {
    //   title: 'Returns',
    //   description:
    //     'The `shop` value if it is a properly formatted Shopify shop domain, otherwise `null`.',
    //   type: 'GetOfflineIdReturns',
    // },
  ],
  category: 'session',
  related: [],
};

export default data;
