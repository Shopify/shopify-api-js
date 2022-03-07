import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {DraftOrder} from '../../2021-10';

describe('DraftOrder resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.line_items = [
      {
        variant_id: 447654529,
        quantity: 1
      }
    ];
    await draft_order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/draft_orders.json',
      query: '',
      headers,
      data: { "draft_order": {line_items: [{variant_id: 447654529, quantity: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.line_items = [
      {
        title: "Custom Tee",
        price: "20.00",
        quantity: 2
      }
    ];
    draft_order.applied_discount = {
      description: "Custom discount",
      value_type: "fixed_amount",
      value: "10.0",
      amount: "10.00",
      title: "Custom"
    };
    draft_order.customer = {
      id: 207119551
    };
    draft_order.use_customer_default_address = true;
    await draft_order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/draft_orders.json',
      query: '',
      headers,
      data: { "draft_order": {line_items: [{title: "Custom Tee", price: "20.00", quantity: 2}], applied_discount: {description: "Custom discount", value_type: "fixed_amount", value: "10.0", amount: "10.00", title: "Custom"}, customer: {id: 207119551}, use_customer_default_address: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.line_items = [
      {
        title: "Custom Tee",
        price: "20.00",
        quantity: 1,
        applied_discount: {
          description: "Custom discount",
          value_type: "fixed_amount",
          value: "10.0",
          amount: "10.0",
          title: "Custom"
        }
      }
    ];
    await draft_order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/draft_orders.json',
      query: '',
      headers,
      data: { "draft_order": {line_items: [{title: "Custom Tee", price: "20.00", quantity: 1, applied_discount: {description: "Custom discount", value_type: "fixed_amount", value: "10.0", amount: "10.0", title: "Custom"}}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.line_items = [
      {
        title: "Custom Tee",
        price: "20.00",
        quantity: 1,
        applied_discount: {
          description: "Custom discount",
          value_type: "percentage",
          value: "10.0",
          amount: "2.0",
          title: "Custom"
        }
      }
    ];
    await draft_order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/draft_orders.json',
      query: '',
      headers,
      data: { "draft_order": {line_items: [{title: "Custom Tee", price: "20.00", quantity: 1, applied_discount: {description: "Custom discount", value_type: "percentage", value: "10.0", amount: "2.0", title: "Custom"}}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.line_items = [
      {
        title: "Custom Tee",
        price: "20.00",
        quantity: 2
      }
    ];
    draft_order.customer = {
      id: 207119551
    };
    draft_order.use_customer_default_address = true;
    await draft_order.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/draft_orders.json',
      query: '',
      headers,
      data: { "draft_order": {line_items: [{title: "Custom Tee", price: "20.00", quantity: 2}], customer: {id: 207119551}, use_customer_default_address: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DraftOrder.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/draft_orders.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.id = 994118539;
    draft_order.note = "Customer contacted us about a custom engraving on this iPod";
    await draft_order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539.json',
      query: '',
      headers,
      data: { "draft_order": {id: 994118539, note: "Customer contacted us about a custom engraving on this iPod"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.id = 994118539;
    draft_order.applied_discount = {
      description: "Custom discount",
      value_type: "percentage",
      value: "10.0",
      amount: "19.90",
      title: "Custom"
    };
    await draft_order.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539.json',
      query: '',
      headers,
      data: { "draft_order": {id: 994118539, applied_discount: {description: "Custom discount", value_type: "percentage", value: "10.0", amount: "19.90", title: "Custom"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DraftOrder.find({
      session: test_session,
      id: 994118539,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DraftOrder.delete({
      session: test_session,
      id: 994118539,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DraftOrder.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/draft_orders/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.id = 994118539;
    await draft_order.send_invoice({
      body: {draft_order_invoice: {to: "first@example.com", from: "j.smith@example.com", bcc: ["j.smith@example.com"], subject: "Apple Computer Invoice", custom_message: "Thank you for ordering!"}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539/send_invoice.json',
      query: '',
      headers,
      data: {draft_order_invoice: {to: "first@example.com", from: "j.smith@example.com", bcc: ["j.smith@example.com"], subject: "Apple Computer Invoice", custom_message: "Thank you for ordering!"}}
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.id = 994118539;
    await draft_order.send_invoice({
      body: {draft_order_invoice: {}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539/send_invoice.json',
      query: '',
      headers,
      data: {draft_order_invoice: {}}
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.id = 994118539;
    await draft_order.complete({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539/complete.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const draft_order = new DraftOrder({session: test_session});
    draft_order.id = 994118539;
    await draft_order.complete({
      payment_pending: "true",
    });

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/draft_orders/994118539/complete.json',
      query: 'payment_pending=true',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
