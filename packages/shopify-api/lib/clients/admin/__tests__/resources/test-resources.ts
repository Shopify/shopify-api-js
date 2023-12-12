import {ShopifyRestResources} from '../../../../../rest/types';

import {FakeResource} from './fake-resource';
import {FakeResourceWithCustomPrefix} from './fake-resource-with-custom-prefix';

interface TestRestResources extends ShopifyRestResources {
  FakeResource: typeof FakeResource;
  FakeResourceWithCustomPrefix: typeof FakeResourceWithCustomPrefix;
}

export const restResources: TestRestResources = {
  FakeResource,
  FakeResourceWithCustomPrefix,
};
