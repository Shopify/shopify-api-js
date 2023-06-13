import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CancellationRequest} from '../../2021-04';

describe('CancellationRequest resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000837, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "cancellation_requested", "status": "in_progress", "supported_actions": ["cancel_fulfillment_order", "create_fulfillment"], "destination": {"id": 1046000824, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737575, "shop_id": 548380009, "fulfillment_order_id": 1046000837, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const cancellation_request = new CancellationRequest({session: test_session});
    cancellation_request.fulfillment_order_id = 1046000837;
    cancellation_request.message = "The customer changed his mind.";
    await cancellation_request.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000837/cancellation_request.json',
      query: '',
      headers,
      data: { "cancellation_request": {"message": "The customer changed his mind."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000838, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "cancellation_accepted", "status": "cancelled", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000825, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737576, "shop_id": 548380009, "fulfillment_order_id": 1046000838, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const cancellation_request = new CancellationRequest({session: test_session});
    cancellation_request.fulfillment_order_id = 1046000838;
    await cancellation_request.accept({
      body: {"cancellation_request": {"message": "We had not started any processing yet."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000838/cancellation_request/accept.json',
      query: '',
      headers,
      data: { "cancellation_request": {"message": "We had not started any processing yet."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000839, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "cancellation_rejected", "status": "in_progress", "supported_actions": ["create_fulfillment"], "destination": {"id": 1046000826, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "origin": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "line_items": [{"id": 1058737577, "shop_id": 548380009, "fulfillment_order_id": 1046000839, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "outgoing_requests": [], "fulfillment_service_handle": "shipwire-app"}}));

    const cancellation_request = new CancellationRequest({session: test_session});
    cancellation_request.fulfillment_order_id = 1046000839;
    await cancellation_request.reject({
      body: {"cancellation_request": {"message": "We have already send the shipment out."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000839/cancellation_request/reject.json',
      query: '',
      headers,
      data: { "cancellation_request": {"message": "We have already send the shipment out."} }
    }).toMatchMadeHttpRequest();
  });

});
