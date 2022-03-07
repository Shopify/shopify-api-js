import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Fulfillment} from '../../2022-01';

describe('Fulfillment resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Fulfillment.all({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Fulfillment.all({
      session: test_session,
      order_id: 450789469,
      since_id: "255858046",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: 'since_id=255858046',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 487838322;
    fulfillment.tracking_number = "123456789";
    fulfillment.tracking_urls = [
      "https://shipping.xyz/track.php?num=123456789",
      "https://anothershipper.corp/track.php?code=abc"
    ];
    fulfillment.notify_customer = true;
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 487838322, tracking_number: "123456789", tracking_urls: ["https://shipping.xyz/track.php?num=123456789", "https://anothershipper.corp/track.php?code=abc"], notify_customer: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = null;
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: null, line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_numbers = [
      "88b451840563b72cc15d3fcb6179f302",
      "aee587edbd98ad725d27974c808ec7d6",
      "94e71192ecf091ea5c25b69c385c2b1b"
    ];
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_numbers: ["88b451840563b72cc15d3fcb6179f302", "aee587edbd98ad725d27974c808ec7d6", "94e71192ecf091ea5c25b69c385c2b1b"], line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_url = "http://www.packagetrackr.com/track/somecarrier/1234567";
    fulfillment.tracking_company = "Jack Black's Pack, Stack and Track";
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_url: "http://www.packagetrackr.com/track/somecarrier/1234567", tracking_company: "Jack Black's Pack, Stack and Track", line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "123456789";
    fulfillment.tracking_company = "4PX";
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: "123456789", tracking_company: "4PX", line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "123456789010";
    fulfillment.tracking_company = "fed ex";
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: "123456789010", tracking_company: "fed ex", line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "123456789010";
    fulfillment.tracking_company = "fed ex";
    fulfillment.tracking_url = "https://www.new-fedex-tracking.com/?number=123456789010";
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: "123456789010", tracking_company: "fed ex", tracking_url: "https://www.new-fedex-tracking.com/?number=123456789010", line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "RR123456789CN";
    fulfillment.tracking_company = "Chinese Post";
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: "RR123456789CN", tracking_company: "Chinese Post", line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "1234567";
    fulfillment.tracking_company = "Custom Tracking Company";
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: "1234567", tracking_company: "Custom Tracking Company", line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "CJ274101086US";
    fulfillment.tracking_url = "http://www.custom-tracking.com/?tracking_number=CJ274101086US";
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: "CJ274101086US", tracking_url: "http://www.custom-tracking.com/?tracking_number=CJ274101086US", line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = null;
    fulfillment.line_items = [
      {
        id: 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: null, line_items: [{id: 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = null;
    fulfillment.line_items = [
      {
        id: 518995019,
        quantity: 1
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {location_id: 655441491, tracking_number: null, line_items: [{id: 518995019, quantity: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Fulfillment.all({
      session: test_session,
      fulfillment_order_id: 1046000859,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/fulfillment_orders/1046000859/fulfillments.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_16', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Fulfillment.count({
      session: test_session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_17', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Fulfillment.find({
      session: test_session,
      order_id: 450789469,
      id: 255858046,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_18', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    fulfillment.tracking_number = "987654321";
    await fulfillment.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046.json',
      query: '',
      headers,
      data: { "fulfillment": {tracking_number: "987654321", id: 255858046} }
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.message = "The package was shipped this morning.";
    fulfillment.notify_customer = false;
    fulfillment.tracking_info = {
      number: 1562678,
      url: "https://www.my-shipping-company.com",
      company: "my-shipping-company"
    };
    fulfillment.line_items_by_fulfillment_order = [
      {
        fulfillment_order_id: 1046000873,
        fulfillment_order_line_items: [
          {
            id: 1058737644,
            quantity: 1
          }
        ]
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {message: "The package was shipped this morning.", notify_customer: false, tracking_info: {number: 1562678, url: "https://www.my-shipping-company.com", company: "my-shipping-company"}, line_items_by_fulfillment_order: [{fulfillment_order_id: 1046000873, fulfillment_order_line_items: [{id: 1058737644, quantity: 1}]}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_20', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.message = "The package was shipped this morning.";
    fulfillment.notify_customer = false;
    fulfillment.tracking_info = {
      number: 1562678,
      url: "https://www.my-shipping-company.com",
      company: "my-shipping-company"
    };
    fulfillment.line_items_by_fulfillment_order = [
      {
        fulfillment_order_id: 1046000874
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {message: "The package was shipped this morning.", notify_customer: false, tracking_info: {number: 1562678, url: "https://www.my-shipping-company.com", company: "my-shipping-company"}, line_items_by_fulfillment_order: [{fulfillment_order_id: 1046000874}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_21', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.id = 1069019908;
    await fulfillment.update_tracking({
      body: {fulfillment: {notify_customer: true, tracking_info: {number: "1111", url: "http://www.my-url.com", company: "my-company"}}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillments/1069019908/update_tracking.json',
      query: '',
      headers,
      data: { "fulfillment": {notify_customer: true, tracking_info: {number: "1111", url: "http://www.my-url.com", company: "my-company"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_22', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    await fulfillment.complete({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046/complete.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_23', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    await fulfillment.open({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046/open.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_24', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    await fulfillment.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments/255858046/cancel.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_25', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.id = 1069019909;
    await fulfillment.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillments/1069019909/cancel.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
