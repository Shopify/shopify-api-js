import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CustomerSavedSearch} from '../../2021-07';

describe('CustomerSavedSearch resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerSavedSearch.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerSavedSearch.all({
      session: test_session,
      since_id: "20610973",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches.json',
      query: 'since_id=20610973',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer_saved_search = new CustomerSavedSearch({session: test_session});
    customer_saved_search.name = "Spent more than $50";
    customer_saved_search.query = "total_spent:>50";
    await customer_saved_search.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches.json',
      query: '',
      headers,
      data: { "customer_saved_search": {name: "Spent more than $50", query: "total_spent:>50"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer_saved_search = new CustomerSavedSearch({session: test_session});
    customer_saved_search.name = "Spent more than $50 and after 2013";
    customer_saved_search.query = "total_spent:>50 order_date:>=2013-01-01";
    await customer_saved_search.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches.json',
      query: '',
      headers,
      data: { "customer_saved_search": {name: "Spent more than $50 and after 2013", query: "total_spent:>50 order_date:>=2013-01-01"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerSavedSearch.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerSavedSearch.count({
      session: test_session,
      since_id: "20610973",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches/count.json',
      query: 'since_id=20610973',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerSavedSearch.find({
      session: test_session,
      id: 789629109,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches/789629109.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const customer_saved_search = new CustomerSavedSearch({session: test_session});
    customer_saved_search.id = 789629109;
    customer_saved_search.name = "This Name Has Been Changed";
    await customer_saved_search.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches/789629109.json',
      query: '',
      headers,
      data: { "customer_saved_search": {id: 789629109, name: "This Name Has Been Changed"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerSavedSearch.delete({
      session: test_session,
      id: 789629109,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches/789629109.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CustomerSavedSearch.customers({
      session: test_session,
      id: 789629109,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/customer_saved_searches/789629109/customers.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
