/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-10';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.October22,
    restResources,
  });
});

describe('CollectionListing resource', () => {
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
    queueMockResponse(JSON.stringify({"collection_listings": [{"collection_id": 482865238, "updated_at": "2023-07-05T18:38:03-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "smart-ipods", "image": {"created_at": "2023-07-05T18:38:03-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1688596683"}, "title": "Smart iPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}, {"collection_id": 841564295, "updated_at": "2023-07-05T18:38:03-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "ipods", "image": {"created_at": "2023-07-05T18:38:03-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1688596683"}, "title": "IPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}, {"collection_id": 395646240, "updated_at": "2023-07-05T18:38:03-04:00", "body_html": "<p>The best selling ipod ever. Again</p>", "default_product_image": {"id": 850703190, "created_at": "2023-07-05T18:38:03-04:00", "position": 1, "updated_at": "2023-07-05T18:38:03-04:00", "product_id": 632910392, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1688596683", "variant_ids": [], "width": 123, "height": 456}, "handle": "ipods_two", "image": null, "title": "IPods Two", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}, {"collection_id": 691652237, "updated_at": "2023-07-05T18:38:03-04:00", "body_html": "<p>No ipods here</p>", "default_product_image": null, "handle": "non-ipods", "image": null, "title": "Non Ipods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}]}));

    await shopify.rest.CollectionListing.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/collection_listings.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"product_ids": [632910392]}));

    await shopify.rest.CollectionListing.product_ids({
      session: session,
      collection_id: 841564295,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/collection_listings/841564295/product_ids.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"collection_listing": {"collection_id": 482865238, "updated_at": "2023-07-05T18:38:03-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "smart-ipods", "image": {"created_at": "2023-07-05T18:38:03-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1688596683"}, "title": "Smart iPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}}));

    await shopify.rest.CollectionListing.find({
      session: session,
      collection_id: 482865238,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/collection_listings/482865238.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"collection_listing": {"collection_id": 482865238, "updated_at": "2023-07-05T18:38:03-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "smart-ipods", "image": {"created_at": "2023-07-05T18:38:03-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1688596683"}, "title": "Smart iPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}}));

    const collection_listing = new shopify.rest.CollectionListing({session: session});
    collection_listing.collection_id = 482865238;
    await collection_listing.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/collection_listings/482865238.json',
      query: '',
      headers,
      data: { "collection_listing": {} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({}));

    await shopify.rest.CollectionListing.delete({
      session: session,
      collection_id: 482865238,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/collection_listings/482865238.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
