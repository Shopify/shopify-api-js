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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillments": [{"id": 255858046, "order_id": 450789469, "status": "failure", "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:14:40-05:00", "tracking_company": "USPS", "shipment_status": null, "location_id": 655441491, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"price": "3.98", "rate": 0.06, "title": "State Tax", "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}]}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillments": [{"id": 1069019890, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:20-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:20-05:00", "tracking_company": "TNT", "shipment_status": null, "location_id": 487838322, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"price": "3.98", "rate": 0.06, "title": "State Tax", "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}, {"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"price": "3.98", "rate": 0.06, "title": "State Tax", "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}, {"id": 703073504, "variant_id": 457924702, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008BLACK", "variant_title": "black", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - black", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "admin_graphql_api_id": "gid://shopify/LineItem/703073504", "tax_lines": [{"price": "3.98", "rate": 0.06, "title": "State Tax", "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789", "tracking_numbers": ["123456789"], "tracking_url": "https://www.tnt.com/express/en_us/site/tracking.html?searchType=con&cons=123456789", "tracking_urls": ["https://www.tnt.com/express/en_us/site/tracking.html?searchType=con&cons=123456789"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019890"}]}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019892, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:28-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:28-05:00", "tracking_company": "TNT", "shipment_status": null, "location_id": 487838322, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}, {"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}, {"id": 703073504, "variant_id": 457924702, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008BLACK", "variant_title": "black", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - black", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/703073504", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789", "tracking_numbers": ["123456789"], "tracking_url": "https://shipping.xyz/track.php?num=123456789", "tracking_urls": ["https://shipping.xyz/track.php?num=123456789", "https://anothershipper.corp/track.php?code=abc"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019892"}}));

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
      data: { "fulfillment": {"location_id": 487838322, "tracking_number": "123456789", "tracking_urls": ["https://shipping.xyz/track.php?num=123456789", "https://anothershipper.corp/track.php?code=abc"], "notify_customer": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019893, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:32-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:32-05:00", "tracking_company": null, "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019893"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = null;
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": null, "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019894, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:34-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:34-05:00", "tracking_company": null, "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "88b451840563b72cc15d3fcb6179f302", "tracking_numbers": ["88b451840563b72cc15d3fcb6179f302", "aee587edbd98ad725d27974c808ec7d6", "94e71192ecf091ea5c25b69c385c2b1b"], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019894"}}));

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
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_numbers": ["88b451840563b72cc15d3fcb6179f302", "aee587edbd98ad725d27974c808ec7d6", "94e71192ecf091ea5c25b69c385c2b1b"], "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019895, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:39-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:39-05:00", "tracking_company": "Jack Black's Pack, Stack and Track", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": "http://www.packagetrackr.com/track/somecarrier/1234567", "tracking_urls": ["http://www.packagetrackr.com/track/somecarrier/1234567"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019895"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_url = "http://www.packagetrackr.com/track/somecarrier/1234567";
    fulfillment.tracking_company = "Jack Black's Pack, Stack and Track";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_url": "http://www.packagetrackr.com/track/somecarrier/1234567", "tracking_company": "Jack Black's Pack, Stack and Track", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019896, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:46-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:46-05:00", "tracking_company": "4PX", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789", "tracking_numbers": ["123456789"], "tracking_url": "http://track.4px.com", "tracking_urls": ["http://track.4px.com"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019896"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "123456789";
    fulfillment.tracking_company = "4PX";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "123456789", "tracking_company": "4PX", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019897, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:50-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:50-05:00", "tracking_company": "fed ex", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789010", "tracking_numbers": ["123456789010"], "tracking_url": "https://www.fedex.com/fedextrack/?trknbr=123456789010", "tracking_urls": ["https://www.fedex.com/fedextrack/?trknbr=123456789010"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019897"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "123456789010";
    fulfillment.tracking_company = "fed ex";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "123456789010", "tracking_company": "fed ex", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019898, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:53-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:53-05:00", "tracking_company": "fed ex", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789010", "tracking_numbers": ["123456789010"], "tracking_url": "https://www.new-fedex-tracking.com/?number=123456789010", "tracking_urls": ["https://www.new-fedex-tracking.com/?number=123456789010"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019898"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "123456789010";
    fulfillment.tracking_company = "fed ex";
    fulfillment.tracking_url = "https://www.new-fedex-tracking.com/?number=123456789010";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "123456789010", "tracking_company": "fed ex", "tracking_url": "https://www.new-fedex-tracking.com/?number=123456789010", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019899, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:55-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:55-05:00", "tracking_company": "Chinese Post", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "RR123456789CN", "tracking_numbers": ["RR123456789CN"], "tracking_url": "http://www.track-chinapost.com/result_china.php?order_no=RR123456789CN", "tracking_urls": ["http://www.track-chinapost.com/result_china.php?order_no=RR123456789CN"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019899"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "RR123456789CN";
    fulfillment.tracking_company = "Chinese Post";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "RR123456789CN", "tracking_company": "Chinese Post", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019900, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:22:58-05:00", "service": "manual", "updated_at": "2022-02-03T17:22:58-05:00", "tracking_company": "Custom Tracking Company", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1234567", "tracking_numbers": ["1234567"], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019900"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "1234567";
    fulfillment.tracking_company = "Custom Tracking Company";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "1234567", "tracking_company": "Custom Tracking Company", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019901, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:23:01-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:01-05:00", "tracking_company": "USPS", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "CJ274101086US", "tracking_numbers": ["CJ274101086US"], "tracking_url": "http://www.custom-tracking.com/?tracking_number=CJ274101086US", "tracking_urls": ["http://www.custom-tracking.com/?tracking_number=CJ274101086US"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019901"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = "CJ274101086US";
    fulfillment.tracking_url = "http://www.custom-tracking.com/?tracking_number=CJ274101086US";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "CJ274101086US", "tracking_url": "http://www.custom-tracking.com/?tracking_number=CJ274101086US", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019902, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:23:04-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:04-05:00", "tracking_company": null, "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019902"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = null;
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": null, "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019903, "order_id": 450789469, "status": "success", "created_at": "2022-02-03T17:23:07-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:07-05:00", "tracking_company": null, "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019903"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_number = null;
    fulfillment.line_items = [
      {
        "id": 518995019,
        "quantity": 1
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": null, "line_items": [{"id": 518995019, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillments": [{"id": 1069019891, "order_id": 1073459998, "status": "success", "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:14:40-05:00", "tracking_company": "UPS", "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823238, "variant_id": 43729076, "title": "Draft", "quantity": 1, "sku": "draft-151", "variant_title": "151cm", "vendor": null, "fulfillment_service": "manual", "product_id": 108828309, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Draft - 151cm", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 10, "price": "10.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823238", "tax_lines": []}], "tracking_number": "#\u26201\u2622\n---\n4321\n", "tracking_numbers": ["#\u26201\u2622\n---\n4321\n"], "tracking_url": "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321", "tracking_urls": ["https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321"], "receipt": {}, "name": "#1033.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019891"}]}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"count": 1}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 255858046, "order_id": 450789469, "status": "failure", "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:14:40-05:00", "tracking_company": "USPS", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"location_id": 655441491, "id": 255858046, "order_id": 450789469, "status": "failure", "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:15-05:00", "tracking_company": "USPS", "shipment_status": null, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "987654321", "tracking_numbers": ["987654321"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=987654321", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=987654321"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

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
      data: { "fulfillment": {"tracking_number": "987654321", "id": 255858046} }
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019905, "order_id": 1073459999, "status": "success", "created_at": "2022-02-03T17:23:10-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:10-05:00", "tracking_company": "my-shipping-company", "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823241, "variant_id": 389013007, "title": "Crafty Shoes - Red", "quantity": 1, "sku": "crappy_shoes_red", "variant_title": "Small", "vendor": null, "fulfillment_service": "manual", "product_id": 910489600, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Crafty Shoes - Red - Small", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 10, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823241", "tax_lines": []}], "tracking_number": "1562678", "tracking_numbers": ["1562678"], "tracking_url": "https://www.my-shipping-company.com", "tracking_urls": ["https://www.my-shipping-company.com"], "receipt": {}, "name": "#1033.2", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019905"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.message = "The package was shipped this morning.";
    fulfillment.notify_customer = false;
    fulfillment.tracking_info = {
      "number": 1562678,
      "url": "https://www.my-shipping-company.com",
      "company": "my-shipping-company"
    };
    fulfillment.line_items_by_fulfillment_order = [
      {
        "fulfillment_order_id": 1046000873,
        "fulfillment_order_line_items": [
          {
            "id": 1058737644,
            "quantity": 1
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
      data: { "fulfillment": {"message": "The package was shipped this morning.", "notify_customer": false, "tracking_info": {"number": 1562678, "url": "https://www.my-shipping-company.com", "company": "my-shipping-company"}, "line_items_by_fulfillment_order": [{"fulfillment_order_id": 1046000873, "fulfillment_order_line_items": [{"id": 1058737644, "quantity": 1}]}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_20', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"id": 1069019907, "order_id": 1073460000, "status": "success", "created_at": "2022-02-03T17:23:13-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:13-05:00", "tracking_company": "my-shipping-company", "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823243, "variant_id": 389013007, "title": "Crafty Shoes - Red", "quantity": 1, "sku": "crappy_shoes_red", "variant_title": "Small", "vendor": null, "fulfillment_service": "manual", "product_id": 910489600, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Crafty Shoes - Red - Small", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 10, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823243", "tax_lines": []}], "tracking_number": "1562678", "tracking_numbers": ["1562678"], "tracking_url": "https://www.my-shipping-company.com", "tracking_urls": ["https://www.my-shipping-company.com"], "receipt": {}, "name": "#1033.2", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019907"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.message = "The package was shipped this morning.";
    fulfillment.notify_customer = false;
    fulfillment.tracking_info = {
      "number": 1562678,
      "url": "https://www.my-shipping-company.com",
      "company": "my-shipping-company"
    };
    fulfillment.line_items_by_fulfillment_order = [
      {
        "fulfillment_order_id": 1046000874
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"message": "The package was shipped this morning.", "notify_customer": false, "tracking_info": {"number": 1562678, "url": "https://www.my-shipping-company.com", "company": "my-shipping-company"}, "line_items_by_fulfillment_order": [{"fulfillment_order_id": 1046000874}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_21', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"tracking_company": "my-company", "location_id": 24826418, "id": 1069019908, "order_id": 1073460001, "status": "success", "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:18-05:00", "shipment_status": null, "line_items": [{"id": 1071823244, "variant_id": 43729076, "title": "Draft", "quantity": 1, "sku": "draft-151", "variant_title": "151cm", "vendor": null, "fulfillment_service": "manual", "product_id": 108828309, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Draft - 151cm", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 10, "price": "10.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823244", "tax_lines": []}], "tracking_number": "1111", "tracking_numbers": ["1111"], "tracking_url": "http://www.my-url.com", "tracking_urls": ["http://www.my-url.com"], "receipt": {}, "name": "#1033.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019908"}}));

    const fulfillment = new Fulfillment({session: test_session});
    fulfillment.id = 1069019908;
    await fulfillment.update_tracking({
      body: {"fulfillment": {"notify_customer": true, "tracking_info": {"number": "1111", "url": "http://www.my-url.com", "company": "my-company"}}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/fulfillments/1069019908/update_tracking.json',
      query: '',
      headers,
      data: { "fulfillment": {"notify_customer": true, "tracking_info": {"number": "1111", "url": "http://www.my-url.com", "company": "my-company"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_22', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"status": "success", "location_id": 655441491, "id": 255858046, "order_id": 450789469, "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:21-05:00", "tracking_company": "USPS", "shipment_status": null, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"status": "open", "location_id": 655441491, "id": 255858046, "order_id": 450789469, "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:25-05:00", "tracking_company": "USPS", "shipment_status": null, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"order_id": 450789469, "status": "cancelled", "location_id": 655441491, "id": 255858046, "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:31-05:00", "tracking_company": "USPS", "shipment_status": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

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
    fetchMock.mockResponseOnce(JSON.stringify({"fulfillment": {"order_id": 1073460002, "status": "cancelled", "location_id": 24826418, "id": 1069019909, "created_at": "2022-02-03T17:14:40-05:00", "service": "manual", "updated_at": "2022-02-03T17:23:33-05:00", "tracking_company": "UPS", "shipment_status": null, "line_items": [{"id": 1071823246, "variant_id": 43729076, "title": "Draft", "quantity": 1, "sku": "draft-151", "variant_title": "151cm", "vendor": null, "fulfillment_service": "manual", "product_id": 108828309, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Draft - 151cm", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 10, "price": "10.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823246", "tax_lines": []}], "tracking_number": "#\u26201\u2622\n---\n4321\n", "tracking_numbers": ["#\u26201\u2622\n---\n4321\n"], "tracking_url": "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321", "tracking_urls": ["https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321"], "receipt": {}, "name": "#1033.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019909"}}));

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
