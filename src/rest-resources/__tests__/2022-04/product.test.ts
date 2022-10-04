/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Product} from '../../2022-04';

describe('Product resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"products": [{"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}, {"id": 921728736, "title": "IPod Touch 8GB", "body_html": "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-touch", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2008-09-25T20:00:00-04:00", "template_suffix": null, "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/921728736", "variants": [{"id": 447654529, "product_id": 921728736, "title": "Black", "price": "199.00", "sku": "IPOD2009BLACK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "shipwire-app", "inventory_management": "shipwire-app", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 447654529, "inventory_quantity": 13, "old_inventory_quantity": 13, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/447654529"}], "options": [{"id": 891236591, "product_id": 921728736, "name": "Title", "position": 1, "values": ["Black"]}], "images": [], "image": null}]}));

    await Product.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"products": [{"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}, {"id": 921728736, "title": "IPod Touch 8GB", "body_html": "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-touch", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2008-09-25T20:00:00-04:00", "template_suffix": null, "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/921728736", "variants": [{"id": 447654529, "product_id": 921728736, "title": "Black", "price": "199.00", "sku": "IPOD2009BLACK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "shipwire-app", "inventory_management": "shipwire-app", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 447654529, "inventory_quantity": 13, "old_inventory_quantity": 13, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/447654529"}], "options": [{"id": 891236591, "product_id": 921728736, "name": "Title", "position": 1, "values": ["Black"]}], "images": [], "image": null}]}));

    await Product.all({
      session: test_session,
      ids: "632910392,921728736",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: 'ids=632910392%2C921728736',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"products": [{"id": 632910392, "title": "IPod Nano - 8GB", "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}]}, {"id": 921728736, "title": "IPod Touch 8GB", "images": []}]}));

    await Product.all({
      session: test_session,
      fields: "id,images,title",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: 'fields=id%2Cimages%2Ctitle',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"products": [{"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}]}));

    await Product.all({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"products": [{"id": 921728736, "title": "IPod Touch 8GB", "body_html": "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-touch", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2008-09-25T20:00:00-04:00", "template_suffix": null, "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/921728736", "variants": [{"id": 447654529, "product_id": 921728736, "title": "Black", "price": "199.00", "sku": "IPOD2009BLACK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "shipwire-app", "inventory_management": "shipwire-app", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 447654529, "inventory_quantity": 13, "old_inventory_quantity": 13, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/447654529"}], "options": [{"id": 891236591, "product_id": 921728736, "name": "Title", "position": 1, "values": ["Black"]}], "images": [], "image": null}]}));

    await Product.all({
      session: test_session,
      since_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: 'since_id=632910392',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"products": [{"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}, {"id": 921728736, "title": "IPod Touch 8GB", "body_html": "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-touch", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2008-09-25T20:00:00-04:00", "template_suffix": null, "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/921728736", "variants": [{"id": 447654529, "product_id": 921728736, "title": "Black", "price": "199.00", "sku": "IPOD2009BLACK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "shipwire-app", "inventory_management": "shipwire-app", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 447654529, "inventory_quantity": 13, "old_inventory_quantity": 13, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/447654529"}], "options": [{"id": 891236591, "product_id": 921728736, "name": "Title", "position": 1, "values": ["Black"]}], "images": [], "image": null}]}));

    await Product.all({
      session: test_session,
      presentment_currencies: "USD",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: 'presentment_currencies=USD',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559591, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:24-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:24-04:00", "published_at": "2022-09-28T16:39:24-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Barnes & Noble, Big Air, John's Fav", "admin_graphql_api_id": "gid://shopify/Product/1071559591", "variants": [{"id": 1070325046, "product_id": 1071559591, "title": "Default Title", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Default Title", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:24-04:00", "updated_at": "2022-09-28T16:39:24-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325046, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325046"}], "options": [{"id": 1055547204, "product_id": 1071559591, "name": "Title", "position": 1, "values": ["Default Title"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.tags = [
      "Barnes & Noble",
      "Big Air",
      "John's Fav"
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "tags": ["Barnes & Noble", "Big Air", "John's Fav"]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559592, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:26-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:26-04:00", "published_at": null, "template_suffix": null, "status": "active", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559592", "variants": [{"id": 1070325047, "product_id": 1071559592, "title": "Default Title", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Default Title", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:26-04:00", "updated_at": "2022-09-28T16:39:26-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325047, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325047"}], "options": [{"id": 1055547205, "product_id": 1071559592, "name": "Title", "position": 1, "values": ["Default Title"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.published = false;
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "published": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559593, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:28-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:28-04:00", "published_at": null, "template_suffix": null, "status": "draft", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559593", "variants": [{"id": 1070325048, "product_id": 1071559593, "title": "Default Title", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Default Title", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:28-04:00", "updated_at": "2022-09-28T16:39:28-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325048, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325048"}], "options": [{"id": 1055547206, "product_id": 1071559593, "name": "Title", "position": 1, "values": ["Default Title"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.status = "draft";
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "status": "draft"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559594, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:29-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:30-04:00", "published_at": "2022-09-28T16:39:29-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559594", "variants": [{"id": 1070325049, "product_id": 1071559594, "title": "First", "price": "10.00", "sku": "123", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "First", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:30-04:00", "updated_at": "2022-09-28T16:39:30-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325049, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "10.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325049"}, {"id": 1070325050, "product_id": 1071559594, "title": "Second", "price": "20.00", "sku": "123", "position": 2, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Second", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:30-04:00", "updated_at": "2022-09-28T16:39:30-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325050, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "20.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325050"}], "options": [{"id": 1055547207, "product_id": 1071559594, "name": "Title", "position": 1, "values": ["First", "Second"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.variants = [
      {
        "option1": "First",
        "price": "10.00",
        "sku": "123"
      },
      {
        "option1": "Second",
        "price": "20.00",
        "sku": "123"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "variants": [{"option1": "First", "price": "10.00", "sku": "123"}, {"option1": "Second", "price": "20.00", "sku": "123"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559595, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:32-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:32-04:00", "published_at": "2022-09-28T16:39:32-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559595", "variants": [{"id": 1070325051, "product_id": 1071559595, "title": "Blue / 155", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Blue", "option2": "155", "option3": null, "created_at": "2022-09-28T16:39:32-04:00", "updated_at": "2022-09-28T16:39:32-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325051, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325051"}, {"id": 1070325052, "product_id": 1071559595, "title": "Black / 159", "price": "0.00", "sku": "", "position": 2, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Black", "option2": "159", "option3": null, "created_at": "2022-09-28T16:39:32-04:00", "updated_at": "2022-09-28T16:39:32-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325052, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325052"}], "options": [{"id": 1055547208, "product_id": 1071559595, "name": "Color", "position": 1, "values": ["Blue", "Black"]}, {"id": 1055547209, "product_id": 1071559595, "name": "Size", "position": 2, "values": ["155", "159"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.variants = [
      {
        "option1": "Blue",
        "option2": "155"
      },
      {
        "option1": "Black",
        "option2": "159"
      }
    ];
    product.options = [
      {
        "name": "Color",
        "values": [
          "Blue",
          "Black"
        ]
      },
      {
        "name": "Size",
        "values": [
          "155",
          "159"
        ]
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "variants": [{"option1": "Blue", "option2": "155"}, {"option1": "Black", "option2": "159"}], "options": [{"name": "Color", "values": ["Blue", "Black"]}, {"name": "Size", "values": ["155", "159"]}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559596, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:34-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:34-04:00", "published_at": "2022-09-28T16:39:34-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559596", "variants": [{"id": 1070325053, "product_id": 1071559596, "title": "Default Title", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Default Title", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:34-04:00", "updated_at": "2022-09-28T16:39:34-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325053, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325053"}], "options": [{"id": 1055547210, "product_id": 1071559596, "name": "Title", "position": 1, "values": ["Default Title"]}], "images": [{"id": 1001473898, "product_id": 1071559596, "position": 1, "created_at": "2022-09-28T16:39:34-04:00", "updated_at": "2022-09-28T16:39:34-04:00", "alt": null, "width": 1, "height": 1, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/df3e567d6f16d040326c7a0ea29a4f41.gif?v=1664397574", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/1001473898"}], "image": {"id": 1001473898, "product_id": 1071559596, "position": 1, "created_at": "2022-09-28T16:39:34-04:00", "updated_at": "2022-09-28T16:39:34-04:00", "alt": null, "width": 1, "height": 1, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/df3e567d6f16d040326c7a0ea29a4f41.gif?v=1664397574", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/1001473898"}}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.images = [
      {
        "attachment": "R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\n"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "images": [{"attachment": "R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\n"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559597, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:36-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:37-04:00", "published_at": "2022-09-28T16:39:36-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559597", "variants": [{"id": 1070325054, "product_id": 1071559597, "title": "Default Title", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Default Title", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:36-04:00", "updated_at": "2022-09-28T16:39:36-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325054, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325054"}], "options": [{"id": 1055547211, "product_id": 1071559597, "name": "Title", "position": 1, "values": ["Default Title"]}], "images": [{"id": 1001473899, "product_id": 1071559597, "position": 1, "created_at": "2022-09-28T16:39:36-04:00", "updated_at": "2022-09-28T16:39:36-04:00", "alt": null, "width": 110, "height": 140, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/rails_logo20220928-1971383-vfpdob.gif?v=1664397576", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/1001473899"}], "image": {"id": 1001473899, "product_id": 1071559597, "position": 1, "created_at": "2022-09-28T16:39:36-04:00", "updated_at": "2022-09-28T16:39:36-04:00", "alt": null, "width": 110, "height": 140, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/rails_logo20220928-1971383-vfpdob.gif?v=1664397576", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/1001473899"}}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.images = [
      {
        "src": "http://example.com/rails_logo.gif"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "images": [{"src": "http://example.com/rails_logo.gif"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559598, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:40-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:40-04:00", "published_at": "2022-09-28T16:39:40-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559598", "variants": [{"id": 1070325055, "product_id": 1071559598, "title": "Default Title", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Default Title", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:40-04:00", "updated_at": "2022-09-28T16:39:40-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325055, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325055"}], "options": [{"id": 1055547212, "product_id": 1071559598, "name": "Title", "position": 1, "values": ["Default Title"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.metafields_global_title_tag = "Product SEO Title";
    product.metafields_global_description_tag = "Product SEO Description";
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "metafields_global_title_tag": "Product SEO Title", "metafields_global_description_tag": "Product SEO Description"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 1071559599, "title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "created_at": "2022-09-28T16:39:42-04:00", "handle": "burton-custom-freestyle-151", "updated_at": "2022-09-28T16:39:42-04:00", "published_at": "2022-09-28T16:39:42-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "", "admin_graphql_api_id": "gid://shopify/Product/1071559599", "variants": [{"id": 1070325056, "product_id": 1071559599, "title": "Default Title", "price": "0.00", "sku": "", "position": 1, "inventory_policy": "deny", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": null, "option1": "Default Title", "option2": null, "option3": null, "created_at": "2022-09-28T16:39:42-04:00", "updated_at": "2022-09-28T16:39:42-04:00", "taxable": true, "barcode": null, "grams": 0, "image_id": null, "weight": 0.0, "weight_unit": "lb", "inventory_item_id": 1070325056, "inventory_quantity": 0, "old_inventory_quantity": 0, "presentment_prices": [{"price": {"amount": "0.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/1070325056"}], "options": [{"id": 1055547213, "product_id": 1071559599, "name": "Title", "position": 1, "values": ["Default Title"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.metafields = [
      {
        "key": "new",
        "value": "newvalue",
        "type": "single_line_text_field",
        "namespace": "global"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products.json',
      query: '',
      headers,
      data: { "product": {"title": "Burton Custom Freestyle 151", "body_html": "<strong>Good snowboard!</strong>", "vendor": "Burton", "product_type": "Snowboard", "metafields": [{"key": "new", "value": "newvalue", "type": "single_line_text_field", "namespace": "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_16', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await Product.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_17', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 1}));

    await Product.count({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products/count.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_18', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    await Product.find({
      session: test_session,
      id: 632910392,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}]}}));

    await Product.find({
      session: test_session,
      id: 632910392,
      fields: "id,images,title",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: 'fields=id%2Cimages%2Ctitle',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_20', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "New product title", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:20-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.title = "New product title";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"title": "New product title"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_21', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:22-04:00", "published_at": null, "template_suffix": null, "status": "draft", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.status = "draft";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"status": "draft"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_22', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:24-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Barnes & Noble, John's Fav", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.tags = "Barnes & Noble, John's Fav";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"tags": "Barnes & Noble, John's Fav"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_23', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:26-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:26-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [], "image": null}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.images = [];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"images": []} }
    }).toMatchMadeHttpRequest();
  });

  it('test_24', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:30-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}, {"id": 1001473901, "product_id": 632910392, "position": 4, "created_at": "2022-09-28T16:40:30-04:00", "updated_at": "2022-09-28T16:40:30-04:00", "alt": null, "width": 110, "height": 140, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/rails_logo20220928-1971383-urea82.gif?v=1664397630", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/1001473901"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.images = [
      {
        "id": 850703190
      },
      {
        "id": 562641783
      },
      {
        "id": 378407906
      },
      {
        "src": "http://example.com/rails_logo.gif"
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"images": [{"id": 850703190}, {"id": 562641783}, {"id": 378407906}, {"src": "http://example.com/rails_logo.gif"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_25', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:33-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 378407906, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:33-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397633", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 850703190, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:33-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397633", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}], "image": {"id": 378407906, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:33-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397633", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.images = [
      {
        "id": 850703190,
        "position": 3
      },
      {
        "id": 562641783,
        "position": 2
      },
      {
        "id": 378407906,
        "position": 1
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"images": [{"id": 850703190, "position": 3}, {"id": 562641783, "position": 2}, {"id": 378407906, "position": 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_26', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:36-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:36-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:36-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:36-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:36-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Black", "Green", "Red", "Pink"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.variants = [
      {
        "id": 457924702
      },
      {
        "id": 39072856
      },
      {
        "id": 49148385
      },
      {
        "id": 808950810
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"variants": [{"id": 457924702}, {"id": 39072856}, {"id": 49148385}, {"id": 808950810}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_27', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "Updated Product Title", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:40-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "2000.00", "sku": "Updating the Product SKU", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:40:40-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.title = "Updated Product Title";
    product.variants = [
      {
        "id": 808950810,
        "price": "2000.00",
        "sku": "Updating the Product SKU"
      },
      {
        "id": 49148385
      },
      {
        "id": 39072856
      },
      {
        "id": 457924702
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"title": "Updated Product Title", "variants": [{"id": 808950810, "price": "2000.00", "sku": "Updating the Product SKU"}, {"id": 49148385}, {"id": 39072856}, {"id": 457924702}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_28', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:37:04-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.metafields_global_title_tag = "Brand new title";
    product.metafields_global_description_tag = "Brand new description";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"metafields_global_title_tag": "Brand new title", "metafields_global_description_tag": "Brand new description"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_29', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:45-04:00", "published_at": "2022-09-28T16:40:45-04:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.published = true;
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"published": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_30', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:47-04:00", "published_at": null, "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.published = false;
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"published": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_31', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product": {"id": 632910392, "title": "IPod Nano - 8GB", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "vendor": "Apple", "product_type": "Cult Products", "created_at": "2022-09-28T16:37:04-04:00", "handle": "ipod-nano", "updated_at": "2022-09-28T16:40:49-04:00", "published_at": "2007-12-31T19:00:00-05:00", "template_suffix": null, "status": "active", "published_scope": "web", "tags": "Emotive, Flash Memory, MP3, Music", "admin_graphql_api_id": "gid://shopify/Product/632910392", "variants": [{"id": 808950810, "product_id": 632910392, "title": "Pink", "price": "199.00", "sku": "IPOD2008PINK", "position": 1, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Pink", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_pink", "grams": 567, "image_id": 562641783, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 808950810, "inventory_quantity": 10, "old_inventory_quantity": 10, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/808950810"}, {"id": 49148385, "product_id": 632910392, "title": "Red", "price": "199.00", "sku": "IPOD2008RED", "position": 2, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Red", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_red", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 49148385, "inventory_quantity": 20, "old_inventory_quantity": 20, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/49148385"}, {"id": 39072856, "product_id": 632910392, "title": "Green", "price": "199.00", "sku": "IPOD2008GREEN", "position": 3, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Green", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_green", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 39072856, "inventory_quantity": 30, "old_inventory_quantity": 30, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/39072856"}, {"id": 457924702, "product_id": 632910392, "title": "Black", "price": "199.00", "sku": "IPOD2008BLACK", "position": 4, "inventory_policy": "continue", "compare_at_price": null, "fulfillment_service": "manual", "inventory_management": "shopify", "option1": "Black", "option2": null, "option3": null, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "taxable": true, "barcode": "1234_black", "grams": 567, "image_id": null, "weight": 1.25, "weight_unit": "lb", "inventory_item_id": 457924702, "inventory_quantity": 40, "old_inventory_quantity": 40, "presentment_prices": [{"price": {"amount": "199.00", "currency_code": "USD"}, "compare_at_price": null}], "requires_shipping": true, "admin_graphql_api_id": "gid://shopify/ProductVariant/457924702"}], "options": [{"id": 594680422, "product_id": 632910392, "name": "Color", "position": 1, "values": ["Pink", "Red", "Green", "Black"]}], "images": [{"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}, {"id": 562641783, "product_id": 632910392, "position": 2, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1664397424", "variant_ids": [808950810], "admin_graphql_api_id": "gid://shopify/ProductImage/562641783"}, {"id": 378407906, "product_id": 632910392, "position": 3, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/378407906"}], "image": {"id": 850703190, "product_id": 632910392, "position": 1, "created_at": "2022-09-28T16:37:04-04:00", "updated_at": "2022-09-28T16:37:04-04:00", "alt": null, "width": 123, "height": 456, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664397424", "variant_ids": [], "admin_graphql_api_id": "gid://shopify/ProductImage/850703190"}}}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.metafields = [
      {
        "key": "new",
        "value": "newvalue",
        "type": "single_line_text_field",
        "namespace": "global"
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: { "product": {"metafields": [{"key": "new", "value": "newvalue", "type": "single_line_text_field", "namespace": "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_32', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.delete({
      session: test_session,
      id: 632910392,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-04/products/632910392.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
