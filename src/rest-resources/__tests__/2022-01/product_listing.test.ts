import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ProductListing} from '../../2022-01';

describe('ProductListing resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ProductListing.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/product_listings.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ProductListing.product_ids({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/product_listings/product_ids.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ProductListing.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/product_listings/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ProductListing.find({
      session: test_session,
      product_id: 921728736,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/product_listings/921728736.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product_listing = new ProductListing({session: test_session});
    product_listing.product_id = 921728736;
    await product_listing.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/product_listings/921728736.json',
      query: '',
      headers,
      data: { "product_listing": {product_id: 921728736} }
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
      path: '/admin/api/2022-01/product_listings/921728736.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
