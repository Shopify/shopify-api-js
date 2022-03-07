import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {AssignedFulfillmentOrder} from '../../2021-04';

describe('AssignedFulfillmentOrder resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await AssignedFulfillmentOrder.all({
      session: test_session,
      assignment_status: "cancellation_requested",
      location_ids: ["24826418"],
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/assigned_fulfillment_orders.json',
      query: 'assignment_status=cancellation_requested&location_ids%5B%5D=24826418',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
