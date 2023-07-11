/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April23,
    restResources,
  });
});

describe('FulfillmentOrder resource', () => {
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
    queueMockResponse(JSON.stringify({"fulfillment_orders": [{"id": 1046000815, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000805, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737558, "shop_id": 548380009, "fulfillment_order_id": 1046000815, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}]}));

    await shopify.rest.FulfillmentOrder.all({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/orders/450789469/fulfillment_orders.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000827, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000817, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737569, "shop_id": 548380009, "fulfillment_order_id": 1046000827, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    await shopify.rest.FulfillmentOrder.find({
      session: session,
      id: 1046000827,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000827.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000825, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000815, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "replacement_fulfillment_order": {"id": 1046000826, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000816, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737568, "shop_id": 548380009, "fulfillment_order_id": 1046000826, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000825;
    await fulfillment_order.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000825/cancel.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000816, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "closed", "status": "incomplete", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000806, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737559, "shop_id": 548380009, "fulfillment_order_id": 1046000816, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000816;
    await fulfillment_order.close({
      body: {"fulfillment_order": {"message": "Not enough inventory to complete this work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000816/close.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"message": "Not enough inventory to complete this work."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"original_fulfillment_order": {"id": 1046000818, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 487838322, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000808, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737561, "shop_id": 548380009, "fulfillment_order_id": 1046000818, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "manual", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "moved_fulfillment_order": {"id": 1046000819, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 655441491, "request_status": "unsubmitted", "status": "open", "supported_actions": ["create_fulfillment", "move"], "destination": {"id": 1046000809, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737562, "shop_id": 548380009, "fulfillment_order_id": 1046000819, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "manual", "assigned_location": {"address1": "50 Rideau Street", "address2": null, "city": "Ottawa", "country_code": "CA", "location_id": 655441491, "name": "50 Rideau Street", "phone": null, "province": "Ontario", "zip": "K1N 9J7"}, "merchant_requests": []}, "remaining_fulfillment_order": null}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000818;
    await fulfillment_order.move({
      body: {"fulfillment_order": {"new_location_id": 655441491, "fulfillment_order_line_items": [{"id": 1058737561, "quantity": 1}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000818/move.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_location_id": 655441491, "fulfillment_order_line_items": [{"id": 1058737561, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000823, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000813, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737566, "shop_id": 548380009, "fulfillment_order_id": 1046000823, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000823;
    await fulfillment_order.open({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000823/open.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000824, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "scheduled", "supported_actions": ["mark_as_open"], "destination": {"id": 1046000814, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737567, "shop_id": 548380009, "fulfillment_order_id": 1046000824, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": "2024-08-05T19:11:00-04:00", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000824;
    await fulfillment_order.reschedule({
      body: {"fulfillment_order": {"new_fulfill_at": "2024-08-05 23:11 UTC"}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000824/reschedule.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_fulfill_at": "2024-08-05 23:11 UTC"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000828, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "on_hold", "supported_actions": ["release_hold"], "destination": {"id": 1046000818, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737570, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfill_at": null, "international_duties": {"incoterm": null}, "fulfillment_holds": [{"reason": "inventory_out_of_stock", "reason_notes": "Not enough inventory to complete this work."}], "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000828;
    await fulfillment_order.hold({
      body: {"fulfillment_hold": {"reason": "inventory_out_of_stock", "reason_notes": "Not enough inventory to complete this work.", "fulfillment_order_line_items": [{"id": 1058737570, "quantity": 1}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000828/hold.json',
      query: '',
      headers,
      data: {"fulfillment_hold": {"reason": "inventory_out_of_stock", "reason_notes": "Not enough inventory to complete this work.", "fulfillment_order_line_items": [{"id": 1058737570, "quantity": 1}]}}
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    queueMockResponse(JSON.stringify({}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});

    await fulfillment_order.set_fulfillment_orders_deadline({
      body: {"fulfillment_order_ids": [1046000821], "fulfillment_deadline": "2021-05-26T10:00:00-04:00"},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/set_fulfillment_orders_deadline.json',
      query: '',
      headers,
      data: {"fulfillment_order_ids": [1046000821], "fulfillment_deadline": "2021-05-26T10:00:00-04:00"}
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    queueMockResponse(JSON.stringify({"fulfillment_order": {"id": 1046000817, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000807, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "+1(502)-459-2181", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737560, "shop_id": 548380009, "fulfillment_order_id": 1046000817, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfill_at": null, "international_duties": {"incoterm": null}, "fulfillment_holds": [], "delivery_method": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new shopify.rest.FulfillmentOrder({session: session});
    fulfillment_order.id = 1046000817;
    await fulfillment_order.release_hold({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/fulfillment_orders/1046000817/release_hold.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
