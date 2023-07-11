/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April22,
    restResources,
  });
});

describe('Fulfillment resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    queueMockResponse(JSON.stringify({"fulfillments": [{"id": 255858046, "order_id": 450789469, "status": "failure", "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:27:29-04:00", "tracking_company": "USPS", "shipment_status": null, "location_id": 655441491, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "duties": [], "tax_lines": [{"price": "3.98", "rate": 0.06, "title": "State Tax", "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}]}));

    await shopify.rest.Fulfillment.all({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"fulfillments": [{"id": 1069019905, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:52-04:00", "service": "shipwire-app", "updated_at": "2023-06-14T14:40:52-04:00", "tracking_company": "TNT", "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "shipwire-app", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shipwire-app", "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "duties": [], "tax_lines": [{"price": "3.98", "rate": 0.06, "title": "State Tax", "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789", "tracking_numbers": ["123456789"], "tracking_url": "https://www.tnt.com/express/en_us/site/tracking.html?searchType=con&cons=123456789", "tracking_urls": ["https://www.tnt.com/express/en_us/site/tracking.html?searchType=con&cons=123456789"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019905"}]}));

    await shopify.rest.Fulfillment.all({
      session: session,
      order_id: 450789469,
      since_id: "255858046",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: 'since_id=255858046',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019907, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:58-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:58-04:00", "tracking_company": null, "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019907"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": null, "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019914, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:41:13-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:13-04:00", "tracking_company": "TNT", "shipment_status": null, "location_id": 487838322, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}, {"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}, {"id": 703073504, "variant_id": 457924702, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008BLACK", "variant_title": "black", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - black", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/703073504", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789", "tracking_numbers": ["123456789"], "tracking_url": "https://shipping.xyz/track.php?num=123456789", "tracking_urls": ["https://shipping.xyz/track.php?num=123456789", "https://anothershipper.corp/track.php?code=abc"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019914"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 487838322, "tracking_number": "123456789", "tracking_urls": ["https://shipping.xyz/track.php?num=123456789", "https://anothershipper.corp/track.php?code=abc"], "notify_customer": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019918, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:41:32-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:32-04:00", "tracking_company": "Jack Black Pack, Stack and Track", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": "http://www.packagetrackr.com/track/somecarrier/1234567", "tracking_urls": ["http://www.packagetrackr.com/track/somecarrier/1234567"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019918"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_url = "http://www.packagetrackr.com/track/somecarrier/1234567";
    fulfillment.tracking_company = "Jack Black Pack, Stack and Track";
    fulfillment.line_items = [
      {
        "id": 518995019
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_url": "http://www.packagetrackr.com/track/somecarrier/1234567", "tracking_company": "Jack Black Pack, Stack and Track", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019901, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:43-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:43-04:00", "tracking_company": "Deutsche Post", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "cb6f81775c4ddea52fa845b453f33845", "tracking_numbers": ["cb6f81775c4ddea52fa845b453f33845", "d42e6f236e0547e61e55c6c10e9efa6a", "2c78938d6c37bcc38939aef2552e9391"], "tracking_url": "https://www.packet.deutschepost.com/webapp/public/packet_traceit.xhtml?barcode=cb6f81775c4ddea52fa845b453f33845", "tracking_urls": ["https://www.packet.deutschepost.com/webapp/public/packet_traceit.xhtml?barcode=cb6f81775c4ddea52fa845b453f33845", "https://www.packet.deutschepost.com/webapp/public/packet_traceit.xhtml?barcode=d42e6f236e0547e61e55c6c10e9efa6a", "https://www.packet.deutschepost.com/webapp/public/packet_traceit.xhtml?barcode=2c78938d6c37bcc38939aef2552e9391"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019901"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.order_id = 450789469;
    fulfillment.location_id = 655441491;
    fulfillment.tracking_numbers = [
      "cb6f81775c4ddea52fa845b453f33845",
      "d42e6f236e0547e61e55c6c10e9efa6a",
      "2c78938d6c37bcc38939aef2552e9391"
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_numbers": ["cb6f81775c4ddea52fa845b453f33845", "d42e6f236e0547e61e55c6c10e9efa6a", "2c78938d6c37bcc38939aef2552e9391"], "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019892, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:08-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:08-04:00", "tracking_company": "Chinese Post", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "RR123456789CN", "tracking_numbers": ["RR123456789CN"], "tracking_url": "http://www.track-chinapost.com/result_china.php?order_no=RR123456789CN", "tracking_urls": ["http://www.track-chinapost.com/result_china.php?order_no=RR123456789CN"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019892"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "RR123456789CN", "tracking_company": "Chinese Post", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019897, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:28-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:28-04:00", "tracking_company": "Custom Tracking Company", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1234567", "tracking_numbers": ["1234567"], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019897"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "1234567", "tracking_company": "Custom Tracking Company", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019900, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:37-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:37-04:00", "tracking_company": "4PX", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789", "tracking_numbers": ["123456789"], "tracking_url": "http://track.4px.com", "tracking_urls": ["http://track.4px.com"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019900"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "123456789", "tracking_company": "4PX", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019895, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:23-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:23-04:00", "tracking_company": "fed ex", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789010", "tracking_numbers": ["123456789010"], "tracking_url": "https://www.fedex.com/fedextrack/?trknbr=123456789010", "tracking_urls": ["https://www.fedex.com/fedextrack/?trknbr=123456789010"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019895"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "123456789010", "tracking_company": "fed ex", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019894, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:20-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:20-04:00", "tracking_company": "fed ex", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "123456789010", "tracking_numbers": ["123456789010"], "tracking_url": "https://www.new-fedex-tracking.com/?number=123456789010", "tracking_urls": ["https://www.new-fedex-tracking.com/?number=123456789010"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019894"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "123456789010", "tracking_company": "fed ex", "tracking_url": "https://www.new-fedex-tracking.com/?number=123456789010", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019896, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:25-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:25-04:00", "tracking_company": "USPS", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "CJ274101086US", "tracking_numbers": ["CJ274101086US"], "tracking_url": "http://www.custom-tracking.com/?tracking_number=CJ274101086US", "tracking_urls": ["http://www.custom-tracking.com/?tracking_number=CJ274101086US"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019896"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": "CJ274101086US", "tracking_url": "http://www.custom-tracking.com/?tracking_number=CJ274101086US", "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019906, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:56-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:56-04:00", "tracking_company": null, "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019906"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": null, "line_items": [{"id": 518995019}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019915, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:41:25-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:25-04:00", "tracking_company": null, "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 518995019, "variant_id": 49148385, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008RED", "variant_title": "red", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - red", "variant_inventory_management": "shopify", "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.33", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.33", "currency_code": "USD"}, "presentment_money": {"amount": "3.33", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/518995019", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": null, "tracking_numbers": [], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019915"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
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
      path: '/admin/api/2022-04/orders/450789469/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"location_id": 655441491, "tracking_number": null, "line_items": [{"id": 518995019, "quantity": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    queueMockResponse(JSON.stringify({"fulfillments": [{"id": 1069019902, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:27:29-04:00", "tracking_company": "UPS", "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823210, "variant_id": 43729076, "title": "Draft", "quantity": 1, "sku": "draft-151", "variant_title": "151cm", "vendor": null, "fulfillment_service": "manual", "product_id": 108828309, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Draft - 151cm", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823210", "tax_lines": []}], "tracking_number": "#\u26201\u2622\n---\n4321\n", "tracking_numbers": ["#\u26201\u2622\n---\n4321\n"], "tracking_url": "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321", "tracking_urls": ["https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019902"}]}));

    await shopify.rest.Fulfillment.all({
      session: session,
      fulfillment_order_id: 1046000848,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/fulfillment_orders/1046000848/fulfillments.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_16', async () => {
    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Fulfillment.count({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_17', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 255858046, "order_id": 450789469, "status": "failure", "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:27:29-04:00", "tracking_company": "USPS", "shipment_status": null, "location_id": 655441491, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

    await shopify.rest.Fulfillment.find({
      session: session,
      order_id: 450789469,
      id: 255858046,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments/255858046.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_18', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"location_id": 655441491, "id": 255858046, "order_id": 450789469, "status": "failure", "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:05-04:00", "tracking_company": "USPS", "shipment_status": null, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 1, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "987654321", "tracking_numbers": ["987654321"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=987654321", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=987654321"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    fulfillment.tracking_number = "987654321";
    await fulfillment.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments/255858046.json',
      query: '',
      headers,
      data: { "fulfillment": {"tracking_number": "987654321"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019909, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:41:01-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:01-04:00", "tracking_company": null, "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823215, "variant_id": 389013007, "title": "Crafty Shoes - Red", "quantity": 1, "sku": "crappy_shoes_red", "variant_title": "Small", "vendor": null, "fulfillment_service": "manual", "product_id": 910489600, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Crafty Shoes - Red - Small", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823215", "tax_lines": []}], "tracking_number": "MS1562678", "tracking_numbers": ["MS1562678"], "tracking_url": "https://www.my-shipping-company.com?tracking_number=MS1562678", "tracking_urls": ["https://www.my-shipping-company.com?tracking_number=MS1562678"], "receipt": {}, "name": "#1001.2", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019909"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.line_items_by_fulfillment_order = [
      {
        "fulfillment_order_id": 1046000853
      }
    ];
    fulfillment.tracking_info = {
      "number": "MS1562678",
      "url": "https://www.my-shipping-company.com?tracking_number=MS1562678"
    };
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"line_items_by_fulfillment_order": [{"fulfillment_order_id": 1046000853}], "tracking_info": {"number": "MS1562678", "url": "https://www.my-shipping-company.com?tracking_number=MS1562678"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_20', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019917, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:41:28-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:28-04:00", "tracking_company": "UPS", "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823221, "variant_id": 389013007, "title": "Crafty Shoes - Red", "quantity": 1, "sku": "crappy_shoes_red", "variant_title": "Small", "vendor": null, "fulfillment_service": "manual", "product_id": 910489600, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Crafty Shoes - Red - Small", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823221", "tax_lines": []}], "tracking_number": "1Z001985YW99744790", "tracking_numbers": ["1Z001985YW99744790"], "tracking_url": "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW99744790", "tracking_urls": ["https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW99744790"], "receipt": {}, "name": "#1001.2", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019917"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.line_items_by_fulfillment_order = [
      {
        "fulfillment_order_id": 1046000863
      }
    ];
    fulfillment.tracking_info = {
      "number": "1Z001985YW99744790"
    };
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"line_items_by_fulfillment_order": [{"fulfillment_order_id": 1046000863}], "tracking_info": {"number": "1Z001985YW99744790"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_21', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019899, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:32-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:32-04:00", "tracking_company": null, "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823209, "variant_id": 389013007, "title": "Crafty Shoes - Red", "quantity": 1, "sku": "crappy_shoes_red", "variant_title": "Small", "vendor": null, "fulfillment_service": "manual", "product_id": 910489600, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Crafty Shoes - Red - Small", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823209", "tax_lines": []}], "tracking_number": "MS1562678", "tracking_numbers": ["MS1562678"], "tracking_url": "https://www.my-shipping-company.com?tracking=MS1562678", "tracking_urls": ["https://www.my-shipping-company.com?tracking=MS1562678"], "receipt": {}, "name": "#1001.2", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019899"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.message = "The package was shipped this morning.";
    fulfillment.notify_customer = false;
    fulfillment.tracking_info = {
      "number": "MS1562678",
      "url": "https://www.my-shipping-company.com?tracking=MS1562678"
    };
    fulfillment.line_items_by_fulfillment_order = [
      {
        "fulfillment_order_id": 1046000845
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"message": "The package was shipped this morning.", "notify_customer": false, "tracking_info": {"number": "MS1562678", "url": "https://www.my-shipping-company.com?tracking=MS1562678"}, "line_items_by_fulfillment_order": [{"fulfillment_order_id": 1046000845}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_22', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019904, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:40:49-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:49-04:00", "tracking_company": "UPS", "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823213, "variant_id": 389013007, "title": "Crafty Shoes - Red", "quantity": 1, "sku": "crappy_shoes_red", "variant_title": "Small", "vendor": null, "fulfillment_service": "manual", "product_id": 910489600, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Crafty Shoes - Red - Small", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823213", "tax_lines": []}], "tracking_number": "1Z001985YW99744790", "tracking_numbers": ["1Z001985YW99744790"], "tracking_url": "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW99744790", "tracking_urls": ["https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW99744790"], "receipt": {}, "name": "#1001.2", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019904"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.message = "The package was shipped this morning.";
    fulfillment.notify_customer = false;
    fulfillment.tracking_info = {
      "number": "1Z001985YW99744790",
      "company": "UPS"
    };
    fulfillment.line_items_by_fulfillment_order = [
      {
        "fulfillment_order_id": 1046000849,
        "fulfillment_order_line_items": [
          {
            "id": 1058737608,
            "quantity": 1
          }
        ]
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"message": "The package was shipped this morning.", "notify_customer": false, "tracking_info": {"number": "1Z001985YW99744790", "company": "UPS"}, "line_items_by_fulfillment_order": [{"fulfillment_order_id": 1046000849, "fulfillment_order_line_items": [{"id": 1058737608, "quantity": 1}]}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_23', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"id": 1069019912, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:41:08-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:08-04:00", "tracking_company": null, "shipment_status": null, "location_id": 24826418, "line_items": [{"id": 1071823217, "variant_id": 389013007, "title": "Crafty Shoes - Red", "quantity": 1, "sku": "crappy_shoes_red", "variant_title": "Small", "vendor": null, "fulfillment_service": "manual", "product_id": 910489600, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Crafty Shoes - Red - Small", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 0, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823217", "tax_lines": []}], "tracking_number": null, "tracking_numbers": [], "tracking_url": null, "tracking_urls": [], "receipt": {}, "name": "#1001.2", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019912"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.line_items_by_fulfillment_order = [
      {
        "fulfillment_order_id": 1046000855
      }
    ];
    await fulfillment.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments.json',
      query: '',
      headers,
      data: { "fulfillment": {"line_items_by_fulfillment_order": [{"fulfillment_order_id": 1046000855}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_24', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"tracking_company": "UPS", "location_id": 24826418, "id": 1069019919, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:34-04:00", "shipment_status": null, "line_items": [{"id": 1071823222, "variant_id": 43729076, "title": "Draft", "quantity": 1, "sku": "draft-151", "variant_title": "151cm", "vendor": null, "fulfillment_service": "manual", "product_id": 108828309, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Draft - 151cm", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823222", "tax_lines": []}], "tracking_number": "1Z001985YW99744790", "tracking_numbers": ["1Z001985YW99744790"], "tracking_url": "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW99744790", "tracking_urls": ["https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=1Z001985YW99744790"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019919"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.id = 1069019919;
    await fulfillment.update_tracking({
      body: {"fulfillment": {"notify_customer": true, "tracking_info": {"company": "UPS", "number": "1Z001985YW99744790"}}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments/1069019919/update_tracking.json',
      query: '',
      headers,
      data: { "fulfillment": {"notify_customer": true, "tracking_info": {"company": "UPS", "number": "1Z001985YW99744790"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_25', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"tracking_company": null, "location_id": 24826418, "id": 1069019893, "order_id": 450789469, "status": "success", "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:18-04:00", "shipment_status": null, "line_items": [{"id": 1071823206, "variant_id": 43729076, "title": "Draft", "quantity": 1, "sku": "draft-151", "variant_title": "151cm", "vendor": null, "fulfillment_service": "manual", "product_id": 108828309, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Draft - 151cm", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823206", "tax_lines": []}], "tracking_number": "1111", "tracking_numbers": ["1111"], "tracking_url": "http://www.my-url.com", "tracking_urls": ["http://www.my-url.com"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019893"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.id = 1069019893;
    await fulfillment.update_tracking({
      body: {"fulfillment": {"notify_customer": true, "tracking_info": {"number": "1111", "url": "http://www.my-url.com"}}},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments/1069019893/update_tracking.json',
      query: '',
      headers,
      data: { "fulfillment": {"notify_customer": true, "tracking_info": {"number": "1111", "url": "http://www.my-url.com"}} }
    }).toMatchMadeHttpRequest();
  });

  it('test_26', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"status": "success", "location_id": 655441491, "id": 255858046, "order_id": 450789469, "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:18-04:00", "tracking_company": "USPS", "shipment_status": null, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    await fulfillment.complete({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments/255858046/complete.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_27', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"status": "open", "location_id": 655441491, "id": 255858046, "order_id": 450789469, "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:40:12-04:00", "tracking_company": "USPS", "shipment_status": null, "origin_address": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "channel_liable": null, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    await fulfillment.open({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments/255858046/open.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_28', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"order_id": 450789469, "status": "cancelled", "location_id": 655441491, "id": 255858046, "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:21-04:00", "tracking_company": "USPS", "shipment_status": null, "line_items": [{"id": 466157049, "variant_id": 39072856, "title": "IPod Nano - 8gb", "quantity": 1, "sku": "IPOD2008GREEN", "variant_title": "green", "vendor": null, "fulfillment_service": "manual", "product_id": 632910392, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "IPod Nano - 8gb - green", "variant_inventory_management": "shopify", "properties": [{"name": "Custom Engraving Front", "value": "Happy Birthday"}, {"name": "Custom Engraving Back", "value": "Merry Christmas"}], "product_exists": true, "fulfillable_quantity": 0, "grams": 200, "price": "199.00", "total_discount": "0.00", "fulfillment_status": null, "price_set": {"shop_money": {"amount": "199.00", "currency_code": "USD"}, "presentment_money": {"amount": "199.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [{"amount": "3.34", "discount_application_index": 0, "amount_set": {"shop_money": {"amount": "3.34", "currency_code": "USD"}, "presentment_money": {"amount": "3.34", "currency_code": "USD"}}}], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/466157049", "tax_lines": [{"title": "State Tax", "price": "3.98", "rate": 0.06, "price_set": {"shop_money": {"amount": "3.98", "currency_code": "USD"}, "presentment_money": {"amount": "3.98", "currency_code": "USD"}}}]}], "tracking_number": "1Z2345", "tracking_numbers": ["1Z2345"], "tracking_url": "https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345", "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=1Z2345"], "receipt": {"testcase": true, "authorization": "123456"}, "name": "#1001.0", "admin_graphql_api_id": "gid://shopify/Fulfillment/255858046"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.order_id = 450789469;
    fulfillment.id = 255858046;
    await fulfillment.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/orders/450789469/fulfillments/255858046/cancel.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_29', async () => {
    queueMockResponse(JSON.stringify({"fulfillment": {"order_id": 450789469, "status": "cancelled", "location_id": 24826418, "id": 1069019913, "created_at": "2023-06-14T14:27:29-04:00", "service": "manual", "updated_at": "2023-06-14T14:41:10-04:00", "tracking_company": "UPS", "shipment_status": null, "line_items": [{"id": 1071823218, "variant_id": 43729076, "title": "Draft", "quantity": 1, "sku": "draft-151", "variant_title": "151cm", "vendor": null, "fulfillment_service": "manual", "product_id": 108828309, "requires_shipping": true, "taxable": true, "gift_card": false, "name": "Draft - 151cm", "variant_inventory_management": null, "properties": [], "product_exists": true, "fulfillable_quantity": 1, "grams": 0, "price": "10.00", "total_discount": "0.00", "fulfillment_status": "fulfilled", "price_set": {"shop_money": {"amount": "10.00", "currency_code": "USD"}, "presentment_money": {"amount": "10.00", "currency_code": "USD"}}, "total_discount_set": {"shop_money": {"amount": "0.00", "currency_code": "USD"}, "presentment_money": {"amount": "0.00", "currency_code": "USD"}}, "discount_allocations": [], "duties": [], "admin_graphql_api_id": "gid://shopify/LineItem/1071823218", "tax_lines": []}], "tracking_number": "#\u26201\u2622\n---\n4321\n", "tracking_numbers": ["#\u26201\u2622\n---\n4321\n"], "tracking_url": "https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321", "tracking_urls": ["https://www.ups.com/WebTracking?loc=en_US&requester=ST&trackNums=#\u26201\u2622---4321"], "receipt": {}, "name": "#1001.1", "admin_graphql_api_id": "gid://shopify/Fulfillment/1069019913"}}));

    const fulfillment = new shopify.rest.Fulfillment({session: session});
    fulfillment.id = 1069019913;
    await fulfillment.cancel({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/fulfillments/1069019913/cancel.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
