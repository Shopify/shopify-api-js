/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CollectionListing} from '../../2022-01';

describe('CollectionListing resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collection_listings": [{"collection_id": 482865238, "updated_at": "2022-10-03T13:07:13-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "smart-ipods", "image": {"created_at": "2022-10-03T13:07:13-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1664816833"}, "title": "Smart iPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}, {"collection_id": 841564295, "updated_at": "2022-10-03T13:07:13-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "ipods", "image": {"created_at": "2022-10-03T13:07:13-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1664816833"}, "title": "IPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}, {"collection_id": 395646240, "updated_at": "2022-10-03T13:07:13-04:00", "body_html": "<p>The best selling ipod ever. Again</p>", "default_product_image": {"id": 850703190, "created_at": "2022-10-03T13:07:13-04:00", "position": 1, "updated_at": "2022-10-03T13:07:13-04:00", "product_id": 632910392, "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/products/ipod-nano.png?v=1664816833", "variant_ids": [], "width": 123, "height": 456}, "handle": "ipods_two", "image": null, "title": "IPods Two", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}, {"collection_id": 691652237, "updated_at": "2022-10-03T13:07:13-04:00", "body_html": "<p>No ipods here</p>", "default_product_image": null, "handle": "non-ipods", "image": null, "title": "Non Ipods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}]}));

    await CollectionListing.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collection_listings.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"product_ids": [632910392]}));

    await CollectionListing.product_ids({
      session: test_session,
      collection_id: 841564295,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collection_listings/841564295/product_ids.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collection_listing": {"collection_id": 482865238, "updated_at": "2022-10-03T13:07:13-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "smart-ipods", "image": {"created_at": "2022-10-03T13:07:13-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1664816833"}, "title": "Smart iPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}}));

    await CollectionListing.find({
      session: test_session,
      collection_id: 482865238,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collection_listings/482865238.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collection_listing": {"collection_id": 482865238, "updated_at": "2022-10-03T13:07:13-04:00", "body_html": "<p>The best selling ipod ever</p>", "default_product_image": null, "handle": "smart-ipods", "image": {"created_at": "2022-10-03T13:07:13-04:00", "src": "https://cdn.shopify.com/s/files/1/0005/4838/0009/collections/ipod_nano_8gb.jpg?v=1664816833"}, "title": "Smart iPods", "sort_order": "manual", "published_at": "2017-08-31T20:00:00-04:00"}}));

    const collection_listing = new CollectionListing({session: test_session});
    collection_listing.collection_id = 482865238;
    await collection_listing.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/collection_listings/482865238.json',
      query: '',
      headers,
      data: { "collection_listing": {} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CollectionListing.delete({
      session: test_session,
      collection_id: 482865238,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/collection_listings/482865238.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
