import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentRequest} from '../../2021-10';

describe('FulfillmentRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000777, "shop_id": 548380009, "order_id": 1073459964, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000777, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737481, "shop_id": 548380009, "fulfillment_order_id": 1046000777, "quantity": 1, "line_item_id": 1071823174, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737482, "shop_id": 548380009, "fulfillment_order_id": 1046000777, "quantity": 1, "line_item_id": 1071823175, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737483, "shop_id": 548380009, "fulfillment_order_id": 1046000777, "quantity": 1, "line_item_id": 1071823176, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000778, "shop_id": 548380009, "order_id": 1073459964, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000778, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737484, "shop_id": 548380009, "fulfillment_order_id": 1046000778, "quantity": 1, "line_item_id": 1071823174, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737485, "shop_id": 548380009, "fulfillment_order_id": 1046000778, "quantity": 1, "line_item_id": 1071823175, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-04-05T12:56:15-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": {"id": 1046000779, "shop_id": 548380009, "order_id": 1073459964, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000779, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737486, "shop_id": 548380009, "fulfillment_order_id": 1046000779, "quantity": 1, "line_item_id": 1071823176, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000777;
    fulfillment_request.message = "Fulfill this ASAP please.";
    fulfillment_request.fulfillment_order_line_items = [
      {
        "id": 1058737481,
        "quantity": 1
      },
      {
        "id": 1058737482,
        "quantity": 1
      }
    ];
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000777/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please.", "fulfillment_order_line_items": [{"id": 1058737481, "quantity": 1}, {"id": 1058737482, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000780, "shop_id": 548380009, "order_id": 1073459965, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000780, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737487, "shop_id": 548380009, "fulfillment_order_id": 1046000780, "quantity": 1, "line_item_id": 1071823177, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737488, "shop_id": 548380009, "fulfillment_order_id": 1046000780, "quantity": 1, "line_item_id": 1071823178, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737489, "shop_id": 548380009, "fulfillment_order_id": 1046000780, "quantity": 1, "line_item_id": 1071823179, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-04-05T12:56:17-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "submitted_fulfillment_order": {"id": 1046000780, "shop_id": 548380009, "order_id": 1073459965, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000780, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737487, "shop_id": 548380009, "fulfillment_order_id": 1046000780, "quantity": 1, "line_item_id": 1071823177, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737488, "shop_id": 548380009, "fulfillment_order_id": 1046000780, "quantity": 1, "line_item_id": 1071823178, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737489, "shop_id": 548380009, "fulfillment_order_id": 1046000780, "quantity": 1, "line_item_id": 1071823179, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [{"message": "Fulfill this ASAP please.", "request_options": {"notify_customer": false}, "sent_at": "2022-04-05T12:56:17-04:00", "kind": "fulfillment_request"}], "fulfillment_service_handle": "shipwire-app"}, "unsubmitted_fulfillment_order": null}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000780;
    fulfillment_request.message = "Fulfill this ASAP please.";
    await fulfillment_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000780/fulfillment_request.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Fulfill this ASAP please."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000781, "shop_id": 548380009, "order_id": 1073459966, "assigned_location_id": 24826418, "request_status": "accepted", "status": "in_progress", "supported_actions": ["request_cancellation", "create_fulfillment"], "destination": {"id": 1046000781, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737490, "shop_id": 548380009, "fulfillment_order_id": 1046000781, "quantity": 1, "line_item_id": 1071823180, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737491, "shop_id": 548380009, "fulfillment_order_id": 1046000781, "quantity": 1, "line_item_id": 1071823181, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737492, "shop_id": 548380009, "fulfillment_order_id": 1046000781, "quantity": 1, "line_item_id": 1071823182, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000781;
    await fulfillment_request.accept({
      body: {"fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000781/fulfillment_request/accept.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "We will start processing your fulfillment on the next business day."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000782, "shop_id": 548380009, "order_id": 1073459967, "assigned_location_id": 24826418, "request_status": "rejected", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000782, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@mail.example.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737493, "shop_id": 548380009, "fulfillment_order_id": 1046000782, "quantity": 1, "line_item_id": 1071823183, "inventory_item_id": 39072856, "fulfillable_quantity": 1, "variant_id": 39072856}, {"id": 1058737494, "shop_id": 548380009, "fulfillment_order_id": 1046000782, "quantity": 1, "line_item_id": 1071823184, "inventory_item_id": 457924702, "fulfillable_quantity": 1, "variant_id": 457924702}, {"id": 1058737495, "shop_id": 548380009, "fulfillment_order_id": 1046000782, "quantity": 1, "line_item_id": 1071823185, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const fulfillment_request = new FulfillmentRequest({session: test_session});
    fulfillment_request.fulfillment_order_id = 1046000782;
    await fulfillment_request.reject({
      body: {"fulfillment_request": {"message": "Not enough inventory on hand to complete the work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/fulfillment_orders/1046000782/fulfillment_request/reject.json',
      query: '',
      headers,
      data: { "fulfillment_request": {"message": "Not enough inventory on hand to complete the work."} }
    }).toMatchMadeHttpRequest();
  });

});
