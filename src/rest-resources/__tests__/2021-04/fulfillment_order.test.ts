import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentOrder} from '../../2021-04';

describe('FulfillmentOrder resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_orders": [{"id": 1046000846, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000833, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737593, "shop_id": 548380009, "fulfillment_order_id": 1046000846, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}]}));

    await FulfillmentOrder.all({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/orders/450789469/fulfillment_orders.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000847, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000834, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737594, "shop_id": 548380009, "fulfillment_order_id": 1046000847, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    await FulfillmentOrder.find({
      session: test_session,
      id: 1046000847,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000847.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000848, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000835, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737595, "shop_id": 548380009, "fulfillment_order_id": 1046000848, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "replacement_fulfillment_order": {"id": 1046000849, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000836, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737596, "shop_id": 548380009, "fulfillment_order_id": 1046000849, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000848;
    await fulfillment_order.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000848/cancel.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000851, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "closed", "status": "incomplete", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000838, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737598, "shop_id": 548380009, "fulfillment_order_id": 1046000851, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000851;
    await fulfillment_order.close({
      body: {"fulfillment_order": {"message": "Not enough inventory to complete this work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000851/close.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"message": "Not enough inventory to complete this work."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000852, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 487838322, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000839, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737599, "shop_id": 548380009, "fulfillment_order_id": 1046000852, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "manual", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "moved_fulfillment_order": {"id": 1046000853, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 655441491, "request_status": "unsubmitted", "status": "open", "supported_actions": ["create_fulfillment", "move"], "destination": {"id": 1046000840, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737600, "shop_id": 548380009, "fulfillment_order_id": 1046000853, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "manual", "assigned_location": {"address1": "50 Rideau Street", "address2": null, "city": "Ottawa", "country_code": "CA", "location_id": 655441491, "name": "50 Rideau Street", "phone": null, "province": "Ontario", "zip": "K1N 9J7"}, "merchant_requests": []}, "remaining_fulfillment_order": null}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000852;
    await fulfillment_order.move({
      body: {"fulfillment_order": {"new_location_id": 655441491}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000852/move.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_location_id": 655441491} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000854, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000841, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737601, "shop_id": 548380009, "fulfillment_order_id": 1046000854, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000854;
    await fulfillment_order.open({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000854/open.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000855, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "scheduled", "supported_actions": ["mark_as_open"], "destination": {"id": 1046000842, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737602, "shop_id": 548380009, "fulfillment_order_id": 1046000855, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": "2023-03-03T00:00:00-05:00", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000855;
    await fulfillment_order.reschedule({
      body: {"fulfillment_order": {"new_fulfill_at": "2023-03-03"}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-04/fulfillment_orders/1046000855/reschedule.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_fulfill_at": "2023-03-03"} }
    }).toMatchMadeHttpRequest();
  });

});
