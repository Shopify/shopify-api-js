import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {FulfillmentOrder} from '../../2021-07';

describe('FulfillmentOrder resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_orders": [{"id": 1046000809, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000804, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737540, "shop_id": 548380009, "fulfillment_order_id": 1046000809, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}]}));

    await FulfillmentOrder.all({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders/450789469/fulfillment_orders.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000810, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "open", "supported_actions": ["cancel_fulfillment_order"], "destination": {"id": 1046000805, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737541, "shop_id": 548380009, "fulfillment_order_id": 1046000810, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    await FulfillmentOrder.find({
      session: test_session,
      id: 1046000810,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000810.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000811, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000806, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737542, "shop_id": 548380009, "fulfillment_order_id": 1046000811, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "replacement_fulfillment_order": {"id": 1046000812, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000807, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737543, "shop_id": 548380009, "fulfillment_order_id": 1046000812, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000811;
    await fulfillment_order.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000811/cancel.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000814, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "closed", "status": "incomplete", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000809, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737545, "shop_id": 548380009, "fulfillment_order_id": 1046000814, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000814;
    await fulfillment_order.close({
      body: {"fulfillment_order": {"message": "Not enough inventory to complete this work."}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000814/close.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"message": "Not enough inventory to complete this work."} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"original_fulfillment_order": {"id": 1046000815, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 487838322, "request_status": "submitted", "status": "closed", "supported_actions": [], "destination": {"id": 1046000810, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737546, "shop_id": 548380009, "fulfillment_order_id": 1046000815, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "manual", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}, "moved_fulfillment_order": {"id": 1046000816, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 655441491, "request_status": "unsubmitted", "status": "open", "supported_actions": ["create_fulfillment", "move"], "destination": {"id": 1046000811, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737547, "shop_id": 548380009, "fulfillment_order_id": 1046000816, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "manual", "assigned_location": {"address1": "50 Rideau Street", "address2": null, "city": "Ottawa", "country_code": "CA", "location_id": 655441491, "name": "50 Rideau Street", "phone": null, "province": "Ontario", "zip": "K1N 9J7"}, "merchant_requests": []}, "remaining_fulfillment_order": null}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000815;
    await fulfillment_order.move({
      body: {"fulfillment_order": {"new_location_id": 655441491}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000815/move.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_location_id": 655441491} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000817, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "open", "supported_actions": ["request_fulfillment", "create_fulfillment"], "destination": {"id": 1046000812, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737548, "shop_id": 548380009, "fulfillment_order_id": 1046000817, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": null, "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000817;
    await fulfillment_order.open({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000817/open.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment_order": {"id": 1046000818, "shop_id": 548380009, "order_id": 450789469, "assigned_location_id": 24826418, "request_status": "unsubmitted", "status": "scheduled", "supported_actions": ["mark_as_open"], "destination": {"id": 1046000813, "address1": "Chestnut Street 92", "address2": "", "city": "Louisville", "company": null, "country": "United States", "email": "bob.norman@hostmail.com", "first_name": "Bob", "last_name": "Norman", "phone": "555-625-1199", "province": "Kentucky", "zip": "40202"}, "line_items": [{"id": 1058737549, "shop_id": 548380009, "fulfillment_order_id": 1046000818, "quantity": 1, "line_item_id": 518995019, "inventory_item_id": 49148385, "fulfillable_quantity": 1, "variant_id": 49148385}], "fulfillment_service_handle": "mars-fulfillment", "fulfill_at": "2023-04-10T20:00:00-04:00", "assigned_location": {"address1": null, "address2": null, "city": null, "country_code": "DE", "location_id": 24826418, "name": "Apple Api Shipwire", "phone": null, "province": null, "zip": null}, "merchant_requests": []}}));

    const fulfillment_order = new FulfillmentOrder({session: test_session});
    fulfillment_order.id = 1046000818;
    await fulfillment_order.reschedule({
      body: {"fulfillment_order": {"new_fulfill_at": "2023-04-11"}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/fulfillment_orders/1046000818/reschedule.json',
      query: '',
      headers,
      data: { "fulfillment_order": {"new_fulfill_at": "2023-04-11"} }
    }).toMatchMadeHttpRequest();
  });

});
