import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {StorefrontAccessToken} from '../../2021-07';

describe('StorefrontAccessToken resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"storefront_access_token": {"access_token": "0db00803dd4e5b98676e060f7997d07f", "access_scope": "unauthenticated_read_product_listings", "created_at": "2022-02-03T17:16:52-05:00", "id": 1003304191, "admin_graphql_api_id": "gid://shopify/StorefrontAccessToken/1003304191", "title": "Test"}}));

    const storefront_access_token = new StorefrontAccessToken({session: test_session});
    storefront_access_token.title = "Test";
    await storefront_access_token.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/storefront_access_tokens.json',
      query: '',
      headers,
      data: { "storefront_access_token": {"title": "Test"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"storefront_access_tokens": [{"access_token": "378d95641257a4ab3feff967ee234f4d", "access_scope": "unauthenticated_read_product_listings", "created_at": "2022-02-03T17:14:40-05:00", "id": 755357713, "admin_graphql_api_id": "gid://shopify/StorefrontAccessToken/755357713", "title": "API Client Extension"}]}));

    await StorefrontAccessToken.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/storefront_access_tokens.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await StorefrontAccessToken.delete({
      session: test_session,
      id: 755357713,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/storefront_access_tokens/755357713.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
