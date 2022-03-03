import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CollectionListing} from '../../2021-07';

describe('CollectionListing resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CollectionListing.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/collection_listings.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CollectionListing.product_ids({
      session: test_session,
      collection_id: 841564295,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/collection_listings/841564295/product_ids.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CollectionListing.find({
      session: test_session,
      collection_id: 482865238,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/collection_listings/482865238.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const collection_listing = new CollectionListing({session: test_session});
    collection_listing.collection_id = 482865238;
    await collection_listing.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/collection_listings/482865238.json',
      query: '',
      headers,
      data: { "collection_listing": {collection_id: 482865238} }
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
      path: '/admin/api/2021-07/collection_listings/482865238.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
