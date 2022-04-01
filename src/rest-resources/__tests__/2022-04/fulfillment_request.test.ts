import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentRequest} from '../../2022-04';

describe('FulfillmentRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000804, "shop_id": 548380009, "order_id": 1073459979, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000798, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737509, "shop_id": 548380009, "fulfillment_order_id": 1046000804, "quantity": 1, "line_item_id": 1071823192, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737510, "shop_id": 548380009, "fulfillment_order_id": 1046000804, "quantity": 1, "line_item_id": 1071823193, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737511, "shop_id": 548380009, "fulfillment_order_id": 1046000804, "quantity": 1, "line_item_id": 1071823194, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000805, "shop_id": 548380009, "order_id": 1073459979, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000799, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737512, "shop_id": 548380009, "fulfillment_order_id": 1046000805, "quantity": 1, "line_item_id": 1071823192, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737513, "shop_id": 548380009, "fulfillment_order_id": 1046000805, "quantity": 1, "line_item_id": 1071823193, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-03-30T19:54:27-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": {"id": 1046000806, "shop_id": 548380009, "order_id": 1073459979, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000800, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737514, "shop_id": 548380009, "fulfillment_order_id": 1046000806, "quantity": 1, "line_item_id": 1071823194, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000804;
    fulfillment_request.message = "Fulfill this ASAP please.";
    fulfillment_request.fulfillment_order_line_items = [
      {
        "id": 1058737509,
        "quantity": 1
      },
      {
        "id": 1058737510,
        "quantity": 1
      }
    ];
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillment_orders/1046000804/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please.", "fulfillment_order_line_items": [{"id": 1058737509, "quantity": 1}, {"id": 1058737510, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000807, "shop_id": 548380009, "order_id": 1073459980, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000801, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737515, "shop_id": 548380009, "fulfillment_order_id": 1046000807, "quantity": 1, "line_item_id": 1071823195, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737516, "shop_id": 548380009, "fulfillment_order_id": 1046000807, "quantity": 1, "line_item_id": 1071823196, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737517, "shop_id": 548380009, "fulfillment_order_id": 1046000807, "quantity": 1, "line_item_id": 1071823197, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-03-30T19:54:30-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000807, "shop_id": 548380009, "order_id": 1073459980, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000801, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737515, "shop_id": 548380009, "fulfillment_order_id": 1046000807, "quantity": 1, "line_item_id": 1071823195, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737516, "shop_id": 548380009, "fulfillment_order_id": 1046000807, "quantity": 1, "line_item_id": 1071823196, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737517, "shop_id": 548380009, "fulfillment_order_id": 1046000807, "quantity": 1, "line_item_id": 1071823197, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-03-30T19:54:30-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": null}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000807;
    fulfillment_request.message = "Fulfill this ASAP please.";
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillment_orders/1046000807/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000808, "shop_id": 548380009, "order_id": 1073459981, "assigned_location_id": 24826418, "request_status": "accepted", "status": "in_progress", "supported_actions": ["request_cancellation", "create_fulfillment"], "destination": {"id": 1046000802, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737518, "shop_id": 548380009, "fulfillment_order_id": 1046000808, "quantity": 1, "line_item_id": 1071823198, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737519, "shop_id": 548380009, "fulfillment_order_id": 1046000808, "quantity": 1, "line_item_id": 1071823199, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737520, "shop_id": 548380009, "fulfillment_order_id": 1046000808, "quantity": 1, "line_item_id": 1071823200, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000808;
    await fulfillment_request.accept({
      body: {"fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillment_orders/1046000808/fulfillment_request/accept.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000809, "shop_id": 548380009, "order_id": 1073459982, "assigned_location_id": 24826418, "request_status": "rejected", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000803, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737521, "shop_id": 548380009, "fulfillment_order_id": 1046000809, "quantity": 1, "line_item_id": 1071823201, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737522, "shop_id": 548380009, "fulfillment_order_id": 1046000809, "quantity": 1, "line_item_id": 1071823202, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737523, "shop_id": 548380009, "fulfillment_order_id": 1046000809, "quantity": 1, "line_item_id": 1071823203, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000809;
    await fulfillment_request.reject({
      body: {"fulfillment_request": {"message": "Not enough inventory on hand to complete the work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillment_orders/1046000809/fulfillment_request/reject.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Not enough inventory on hand to complete the work."} }
    }).toMatchMadeHttpRequest();
  });

});
