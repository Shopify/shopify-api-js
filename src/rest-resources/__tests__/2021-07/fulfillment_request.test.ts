import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentRequest} from '../../2021-07';

describe('FulfillmentRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000825, "shop_id": 548380009, "order_id": 1073459971, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000819, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737559, "shop_id": 548380009, "fulfillment_order_id": 1046000825, "quantity": 1, "line_item_id": 1071823188, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737560, "shop_id": 548380009, "fulfillment_order_id": 1046000825, "quantity": 1, "line_item_id": 1071823189, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737561, "shop_id": 548380009, "fulfillment_order_id": 1046000825, "quantity": 1, "line_item_id": 1071823190, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000826, "shop_id": 548380009, "order_id": 1073459971, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000820, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737562, "shop_id": 548380009, "fulfillment_order_id": 1046000826, "quantity": 1, "line_item_id": 1071823188, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737563, "shop_id": 548380009, "fulfillment_order_id": 1046000826, "quantity": 1, "line_item_id": 1071823189, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-03-11T11:18:49-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": {"id": 1046000827, "shop_id": 548380009, "order_id": 1073459971, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000821, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737564, "shop_id": 548380009, "fulfillment_order_id": 1046000827, "quantity": 1, "line_item_id": 1071823190, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000825;
    fulfillment_request.message = "Fulfill this ASAP please.";
    fulfillment_request.fulfillment_order_line_items = [
      {
        "id": 1058737559,
        "quantity": 1
      },
      {
        "id": 1058737560,
        "quantity": 1
      }
    ];
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000825/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please.", "fulfillment_order_line_items": [{"id": 1058737559, "quantity": 1}, {"id": 1058737560, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000828, "shop_id": 548380009, "order_id": 1073459972, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000822, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737565, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 1071823191, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737566, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 1071823192, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737567, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 1071823193, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-03-11T11:18:52-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000828, "shop_id": 548380009, "order_id": 1073459972, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000822, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737565, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 1071823191, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737566, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 1071823192, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737567, "shop_id": 548380009, "fulfillment_order_id": 1046000828, "quantity": 1, "line_item_id": 1071823193, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-03-11T11:18:52-05:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": null}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000828;
    fulfillment_request.message = "Fulfill this ASAP please.";
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000828/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000823, "shop_id": 548380009, "order_id": 1073459969, "assigned_location_id": 24826418, "request_status": "accepted", "status": "in_progress", "supported_actions": ["request_cancellation", "create_fulfillment"], "destination": {"id": 1046000817, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737553, "shop_id": 548380009, "fulfillment_order_id": 1046000823, "quantity": 1, "line_item_id": 1071823182, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737554, "shop_id": 548380009, "fulfillment_order_id": 1046000823, "quantity": 1, "line_item_id": 1071823183, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737555, "shop_id": 548380009, "fulfillment_order_id": 1046000823, "quantity": 1, "line_item_id": 1071823184, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000823;
    await fulfillment_request.accept({
      body: {"fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000823/fulfillment_request/accept.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000824, "shop_id": 548380009, "order_id": 1073459970, "assigned_location_id": 24826418, "request_status": "rejected", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000818, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737556, "shop_id": 548380009, "fulfillment_order_id": 1046000824, "quantity": 1, "line_item_id": 1071823185, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737557, "shop_id": 548380009, "fulfillment_order_id": 1046000824, "quantity": 1, "line_item_id": 1071823186, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737558, "shop_id": 548380009, "fulfillment_order_id": 1046000824, "quantity": 1, "line_item_id": 1071823187, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000824;
    await fulfillment_request.reject({
      body: {"fulfillment_request": {"message": "Not enough inventory on hand to complete the work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000824/fulfillment_request/reject.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Not enough inventory on hand to complete the work."} }
    }).toMatchMadeHttpRequest();
  });

});
