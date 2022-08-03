/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {AssignedFulfillmentOrder} from '../../2022-07';

describe('AssignedFulfillmentOrder resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_orders": [{"id": 1046000786, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "cancellation_requested", "status": "in_progress", "supported_actions": ["revert_to_unfulfilled", "create_fulfillment"], "destination": {"id": 1046000786, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737499, "shop_id": 548380009, "fulfillment_order_id": 1046000786, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}}]}));

    await AssignedFulfillmentOrder.all({
      session: test_session,
      assignment_status: "cancellation_requested",
      location_ids: ["24826418"],
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/assigned_fulfillment_orders.json',
      query: 'assignment_status=cancellation_requested&location_ids%5B%5D=24826418',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
