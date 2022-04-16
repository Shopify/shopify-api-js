import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ProductListing} from '../../2021-10';

describe('ProductListing resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product_listings": [{"product_id": 632910392, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00", "body_html": "<p>It's the small iPod with one very big idea: Video. Now the world's most popular music player, available in 4GB and 8GB models, lets you enjoy TV shows, movies, video podcasts, and more. The larger, brighter display means amazing picture quality. In six eye-catching colors, iPod nano is stunning all around. And with models starting at just $149, little speaks volumes.</p>", "handle": "ipod-nano", "product_type": "Cult Products", "title": "IPod Nano - 8GB", "vendor": "Apple", "available": true, "tags": "Emotive, Flash Memory, MP3, Music", "published_at": "2017-08-31T20:00:00-04:00", "variants": [{"id": 808950810, "title": "Pink", "option_values": [{"option_id": 594680422, "name": "Color", "value": "Pink"}], "price": "199.00", "formatted_price": "$199.00", "compare_at_price": null, "grams": 567, "requires_shipping": true, "sku": "IPOD2008PINK", "barcode": "1234_pink", "taxable": true, "position": 1, "available": true, "inventory_policy": "continue", "inventory_quantity": 10, "inventory_management": "shopify", "fulfillment_service": "manual", "weight": 1.25, "weight_unit": "lb", "image_id": 562641783, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00"}, {"id": 49148385, "title": "Red", "option_values": [{"option_id": 594680422, "name": "Color", "value": "Red"}], "price": "199.00", "formatted_price": "$199.00", "compare_at_price": null, "grams": 567, "requires_shipping": true, "sku": "IPOD2008RED", "barcode": "1234_red", "taxable": true, "position": 2, "available": true, "inventory_policy": "continue", "inventory_quantity": 20, "inventory_management": "shopify", "fulfillment_service": "manual", "weight": 1.25, "weight_unit": "lb", "image_id": null, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00"}, {"id": 39072856, "title": "Green", "option_values": [{"option_id": 594680422, "name": "Color", "value": "Green"}], "price": "199.00", "formatted_price": "$199.00", "compare_at_price": null, "grams": 567, "requires_shipping": true, "sku": "IPOD2008GREEN", "barcode": "1234_green", "taxable": true, "position": 3, "available": true, "inventory_policy": "continue", "inventory_quantity": 30, "inventory_management": "shopify", "fulfillment_service": "manual", "weight": 1.25, "weight_unit": "lb", "image_id": null, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00"}, {"id": 457924702, "title": "Black", "option_values": [{"option_id": 594680422, "name": "Color", "value": "Black"}], "price": "199.00", "formatted_price": "$199.00", "compare_at_price": null, "grams": 567, "requires_shipping": true, "sku": "IPOD2008BLACK", "barcode": "1234_black", "taxable": true, "position": 4, "available": true, "inventory_policy": "continue", "inventory_quantity": 40, "inventory_management": "shopify", "fulfillment_service": "manual", "weight": 1.25, "weight_unit": "lb", "image_id": null, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00"}], "images": [{"id": 850703190, "created_at": "2022-03-11T10:52:46-05:00", "position": 1, "updated_at": "2022-03-11T10:52:46-05:00", "product_id": 632910392, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1647013966", "variant_ids": [], "width": 123, "height": 456}, {"id": 562641783, "created_at": "2022-03-11T10:52:46-05:00", "position": 2, "updated_at": "2022-03-11T10:52:46-05:00", "product_id": 632910392, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano-2.png?v=1647013966", "variant_ids": [808950810], "width": 123, "height": 456}, {"id": 378407906, "created_at": "2022-03-11T10:52:46-05:00", "position": 3, "updated_at": "2022-03-11T10:52:46-05:00", "product_id": 632910392, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1647013966", "variant_ids": [], "width": 123, "height": 456}], "options": [{"id": 594680422, "name": "Color", "product_id": 632910392, "position": 1, "values": ["Pink", "Red", "Green", "Black"]}]}, {"product_id": 921728736, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00", "body_html": "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>", "handle": "ipod-touch", "product_type": "Cult Products", "title": "IPod Touch 8GB", "vendor": "Apple", "available": true, "tags": "", "published_at": "2017-08-31T20:00:00-04:00", "variants": [{"id": 447654529, "title": "Black", "option_values": [{"option_id": 891236591, "name": "Title", "value": "Black"}], "price": "199.00", "formatted_price": "$199.00", "compare_at_price": null, "grams": 567, "requires_shipping": true, "sku": "IPOD2009BLACK", "barcode": "1234_black", "taxable": true, "position": 1, "available": true, "inventory_policy": "continue", "inventory_quantity": 13, "inventory_management": "shipwire-app", "fulfillment_service": "shipwire-app", "weight": 1.25, "weight_unit": "lb", "image_id": null, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00"}], "images": [], "options": [{"id": 891236591, "name": "Title", "product_id": 921728736, "position": 1, "values": ["Black"]}]}]}));

    await ProductListing.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/product_listings.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product_ids": [921728736, 632910392]}));

    await ProductListing.product_ids({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/product_listings/product_ids.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await ProductListing.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/product_listings/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product_listing": {"product_id": 921728736, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00", "body_html": "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>", "handle": "ipod-touch", "product_type": "Cult Products", "title": "IPod Touch 8GB", "vendor": "Apple", "available": true, "tags": "", "published_at": "2017-08-31T20:00:00-04:00", "variants": [{"id": 447654529, "title": "Black", "option_values": [{"option_id": 891236591, "name": "Title", "value": "Black"}], "price": "199.00", "formatted_price": "$199.00", "compare_at_price": null, "grams": 567, "requires_shipping": true, "sku": "IPOD2009BLACK", "barcode": "1234_black", "taxable": true, "position": 1, "available": true, "inventory_policy": "continue", "inventory_quantity": 13, "inventory_management": "shipwire-app", "fulfillment_service": "shipwire-app", "weight": 1.25, "weight_unit": "lb", "image_id": null, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00"}], "images": [], "options": [{"id": 891236591, "name": "Title", "product_id": 921728736, "position": 1, "values": ["Black"]}]}}));

    await ProductListing.find({
      session: test_session,
      product_id: 921728736,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/product_listings/921728736.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product_listing": {"product_id": 921728736, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00", "body_html": "<p>The iPod Touch has the iPhone's multi-touch interface, with a physical home button off the touch screen. The home screen has a list of buttons for the available applications.</p>", "handle": "ipod-touch", "product_type": "Cult Products", "title": "IPod Touch 8GB", "vendor": "Apple", "available": true, "tags": "", "published_at": "2017-08-31T20:00:00-04:00", "variants": [{"id": 447654529, "title": "Black", "option_values": [{"option_id": 891236591, "name": "Title", "value": "Black"}], "price": "199.00", "formatted_price": "$199.00", "compare_at_price": null, "grams": 567, "requires_shipping": true, "sku": "IPOD2009BLACK", "barcode": "1234_black", "taxable": true, "position": 1, "available": true, "inventory_policy": "continue", "inventory_quantity": 13, "inventory_management": "shipwire-app", "fulfillment_service": "shipwire-app", "weight": 1.25, "weight_unit": "lb", "image_id": null, "created_at": "2022-03-11T10:52:46-05:00", "updated_at": "2022-03-11T10:52:46-05:00"}], "images": [], "options": [{"id": 891236591, "name": "Title", "product_id": 921728736, "position": 1, "values": ["Black"]}]}}));

    const product_listing = new ProductListing({session: test_session});
    product_listing.product_id = 921728736;
    await product_listing.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/product_listings/921728736.json',
      query: '',
      headers,
      data: { "product_listing": {"product_id": 921728736} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ProductListing.delete({
      session: test_session,
      product_id: 921728736,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-10/product_listings/921728736.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
