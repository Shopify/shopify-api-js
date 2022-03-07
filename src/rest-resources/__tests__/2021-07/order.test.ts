import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Order} from '../../2021-07';

describe('Order resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.all({
      session: test_session,
      status: "any",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: 'status=any',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.all({
      session: test_session,
      ids: "1073459980",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: 'ids=1073459980',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.all({
      session: test_session,
      financial_status: "authorized",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: 'financial_status=authorized',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.all({
      session: test_session,
      updated_at_min: "2005-07-31T15:57:11-04:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: 'updated_at_min=2005-07-31T15%3A57%3A11-04%3A00',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.all({
      session: test_session,
      fields: "created_at,id,name,total-price",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: 'fields=created_at%2Cid%2Cname%2Ctotal-price',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.all({
      session: test_session,
      since_id: "123",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: 'since_id=123',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.find({
      session: test_session,
      id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.find({
      session: test_session,
      id: 450789469,
      fields: "id,line_items,name,total_price",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: 'fields=id%2Cline_items%2Cname%2Ctotal_price',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.note = "Customer contacted us about a custom engraving on this iPod";
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, note: "Customer contacted us about a custom engraving on this iPod"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.note_attributes = [
      {
        name: "colour",
        value: "red"
      }
    ];
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, note_attributes: [{name: "colour", value: "red"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.email = "a-different@email.com";
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, email: "a-different@email.com"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.phone = " 15145556677";
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, phone: " 15145556677"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.buyer_accepts_marketing = true;
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, buyer_accepts_marketing: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.shipping_address = {
      address1: "123 Ship Street",
      city: "Shipsville"
    };
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, shipping_address: {address1: "123 Ship Street", city: "Shipsville"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.customer = null;
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, customer: null} }
    }).toMatchMadeHttpRequest();
  });

  it('test_16', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.tags = "External, Inbound, Outbound";
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, tags: "External, Inbound, Outbound"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_17', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    order.metafields = [
      {
        key: "new",
        value: "newvalue",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: { "order": {id: 450789469, metafields: [{key: "new", value: "newvalue", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_18', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.delete({
      session: test_session,
      id: 450789469,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/orders/450789469.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.count({
      session: test_session,
      status: "any",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders/count.json',
      query: 'status=any',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_20', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Order.count({
      session: test_session,
      financial_status: "authorized",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/orders/count.json',
      query: 'financial_status=authorized',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_21', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    await order.close({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders/450789469/close.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_22', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    await order.open({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders/450789469/open.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_23', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    await order.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders/450789469/cancel.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_24', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    await order.cancel({
      body: {amount: "10.00", currency: "USD"},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders/450789469/cancel.json',
      query: '',
      headers,
      data: {amount: "10.00", currency: "USD"}
    }).toMatchMadeHttpRequest();
  });

  it('test_25', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.id = 450789469;
    await order.cancel({
      body: {refund: {note: "Customer made a mistake", shipping: {full_refund: true}, refund_line_items: [{line_item_id: 466157049, quantity: 1, restock_type: "cancel", location_id: 24826418}], transactions: [{parent_id: 1068278509, amount: "10.00", kind: "refund", gateway: "bogus"}, {parent_id: 1068278510, amount: "100.00", kind: "refund", gateway: "gift_card"}]}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders/450789469/cancel.json',
      query: '',
      headers,
      data: {refund: {note: "Customer made a mistake", shipping: {full_refund: true}, refund_line_items: [{line_item_id: 466157049, quantity: 1, restock_type: "cancel", location_id: 24826418}], transactions: [{parent_id: 1068278509, amount: "10.00", kind: "refund", gateway: "bogus"}, {parent_id: 1068278510, amount: "100.00", kind: "refund", gateway: "gift_card"}]}}
    }).toMatchMadeHttpRequest();
  });

  it('test_26', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.line_items = [
      {
        variant_id: 447654529,
        quantity: 1
      }
    ];
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {line_items: [{variant_id: 447654529, quantity: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_27', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.email = "foo@example.com";
    order.fulfillment_status = "fulfilled";
    order.send_receipt = true;
    order.send_fulfillment_receipt = true;
    order.line_items = [
      {
        variant_id: 457924702,
        quantity: 1
      }
    ];
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {email: "foo@example.com", fulfillment_status: "fulfilled", send_receipt: true, send_fulfillment_receipt: true, line_items: [{variant_id: 457924702, quantity: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_28', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.email = "foo@example.com";
    order.fulfillment_status = "fulfilled";
    order.line_items = [
      {
        variant_id: 447654529,
        quantity: 1
      }
    ];
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {email: "foo@example.com", fulfillment_status: "fulfilled", line_items: [{variant_id: 447654529, quantity: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_29', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.email = "foo@example.com";
    order.fulfillment_status = "fulfilled";
    order.fulfillments = [
      {
        location_id: 24826418
      }
    ];
    order.line_items = [
      {
        variant_id: 447654529,
        quantity: 1
      }
    ];
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {email: "foo@example.com", fulfillment_status: "fulfilled", fulfillments: [{location_id: 24826418}], line_items: [{variant_id: 447654529, quantity: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_30', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.line_items = [
      {
        title: "Big Brown Bear Boots",
        price: 74.99,
        grams: "1300",
        quantity: 3,
        tax_lines: [
          {
            price: 13.5,
            rate: 0.06,
            title: "State tax"
          }
        ]
      }
    ];
    order.transactions = [
      {
        kind: "sale",
        status: "success",
        amount: 238.47
      }
    ];
    order.total_tax = 13.5;
    order.currency = "EUR";
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {line_items: [{title: "Big Brown Bear Boots", price: 74.99, grams: "1300", quantity: 3, tax_lines: [{price: 13.5, rate: 0.06, title: "State tax"}]}], transactions: [{kind: "sale", status: "success", amount: 238.47}], total_tax: 13.5, currency: "EUR"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_31', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.line_items = [
      {
        title: "Red Leather Coat",
        price: 129.99,
        grams: "1700",
        quantity: 1
      },
      {
        title: "Blue Suede Shoes",
        price: 85.95,
        grams: "750",
        quantity: 1,
        taxable: false
      },
      {
        title: "Raspberry Beret",
        price: 19.99,
        grams: "320",
        quantity: 2
      }
    ];
    order.tax_lines = [
      {
        price: 10.2,
        rate: 0.06,
        title: "State tax"
      },
      {
        price: 4.25,
        rate: 0.025,
        title: "County tax"
      }
    ];
    order.total_tax = 14.45;
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {line_items: [{title: "Red Leather Coat", price: 129.99, grams: "1700", quantity: 1}, {title: "Blue Suede Shoes", price: 85.95, grams: "750", quantity: 1, taxable: false}, {title: "Raspberry Beret", price: 19.99, grams: "320", quantity: 2}], tax_lines: [{price: 10.2, rate: 0.06, title: "State tax"}, {price: 4.25, rate: 0.025, title: "County tax"}], total_tax: 14.45} }
    }).toMatchMadeHttpRequest();
  });

  it('test_32', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.line_items = [
      {
        variant_id: 447654529,
        quantity: 1
      }
    ];
    order.customer = {
      id: 207119551
    };
    order.financial_status = "pending";
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {line_items: [{variant_id: 447654529, quantity: 1}], customer: {id: 207119551}, financial_status: "pending"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_33', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.line_items = [
      {
        variant_id: 447654529,
        quantity: 1
      }
    ];
    order.customer = {
      first_name: "Paul",
      last_name: "Norman",
      email: "paul.norman@example.com"
    };
    order.billing_address = {
      first_name: "John",
      last_name: "Smith",
      address1: "123 Fake Street",
      phone: "555-555-5555",
      city: "Fakecity",
      province: "Ontario",
      country: "Canada",
      zip: "K2P 1L4"
    };
    order.shipping_address = {
      first_name: "Jane",
      last_name: "Smith",
      address1: "123 Fake Street",
      phone: "777-777-7777",
      city: "Fakecity",
      province: "Ontario",
      country: "Canada",
      zip: "K2P 1L4"
    };
    order.email = "jane@example.com";
    order.transactions = [
      {
        kind: "authorization",
        status: "success",
        amount: 50.0
      }
    ];
    order.financial_status = "partially_paid";
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {line_items: [{variant_id: 447654529, quantity: 1}], customer: {first_name: "Paul", last_name: "Norman", email: "paul.norman@example.com"}, billing_address: {first_name: "John", last_name: "Smith", address1: "123 Fake Street", phone: "555-555-5555", city: "Fakecity", province: "Ontario", country: "Canada", zip: "K2P 1L4"}, shipping_address: {first_name: "Jane", last_name: "Smith", address1: "123 Fake Street", phone: "777-777-7777", city: "Fakecity", province: "Ontario", country: "Canada", zip: "K2P 1L4"}, email: "jane@example.com", transactions: [{kind: "authorization", status: "success", amount: 50.0}], financial_status: "partially_paid"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_34', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const order = new Order({session: test_session});
    order.line_items = [
      {
        variant_id: 447654529,
        quantity: 1
      }
    ];
    order.email = "jane@example.com";
    order.phone = "18885551234";
    order.billing_address = {
      first_name: "John",
      last_name: "Smith",
      address1: "123 Fake Street",
      phone: "555-555-5555",
      city: "Fakecity",
      province: "Ontario",
      country: "Canada",
      zip: "K2P 1L4"
    };
    order.shipping_address = {
      first_name: "Jane",
      last_name: "Smith",
      address1: "123 Fake Street",
      phone: "777-777-7777",
      city: "Fakecity",
      province: "Ontario",
      country: "Canada",
      zip: "K2P 1L4"
    };
    order.transactions = [
      {
        kind: "sale",
        status: "success",
        amount: 50.0
      }
    ];
    order.financial_status = "paid";
    order.discount_codes = [
      {
        code: "FAKE30",
        amount: "9.00",
        type: "percentage"
      }
    ];
    await order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/orders.json',
      query: '',
      headers,
      data: { "order": {line_items: [{variant_id: 447654529, quantity: 1}], email: "jane@example.com", phone: "18885551234", billing_address: {first_name: "John", last_name: "Smith", address1: "123 Fake Street", phone: "555-555-5555", city: "Fakecity", province: "Ontario", country: "Canada", zip: "K2P 1L4"}, shipping_address: {first_name: "Jane", last_name: "Smith", address1: "123 Fake Street", phone: "777-777-7777", city: "Fakecity", province: "Ontario", country: "Canada", zip: "K2P 1L4"}, transactions: [{kind: "sale", status: "success", amount: 50.0}], financial_status: "paid", discount_codes: [{code: "FAKE30", amount: "9.00", type: "percentage"}]} }
    }).toMatchMadeHttpRequest();
  });

});
