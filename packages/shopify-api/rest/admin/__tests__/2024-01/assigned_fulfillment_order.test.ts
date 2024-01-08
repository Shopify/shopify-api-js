/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2024-01';

describe('AssignedFulfillmentOrder resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January24, restResources}),
    );

    queueMockResponse(JSON.stringify({"fulfillment_orders": [{"id": 1046000811, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "cancellation_requested", "status": "in_progress", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000801, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737552, "shop_id": 548380009, "fulfillment_order_id": 1046000811, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "international_duties": null, "fulfillment_service_handle": "shipwire-app", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}}]}));

    await shopify.rest.AssignedFulfillmentOrder.all({
      session: session,
      assignment_status: "cancellation_requested",
      location_ids: ["24826418"],
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2024-01/assigned_fulfillment_orders.json',
      query: 'assignment_status=cancellation_requested&location_ids%5B%5D=24826418',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
