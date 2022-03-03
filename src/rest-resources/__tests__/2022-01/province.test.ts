import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Province} from '../../2022-01';

describe('Province resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Province.all({
      session: test_session,
      country_id: 879921427,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries/879921427/provinces.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Province.all({
      session: test_session,
      country_id: 879921427,
      since_id: "536137098",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries/879921427/provinces.json',
      query: 'since_id=536137098',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Province.count({
      session: test_session,
      country_id: 879921427,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries/879921427/provinces/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Province.find({
      session: test_session,
      country_id: 879921427,
      id: 224293623,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries/879921427/provinces/224293623.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const province = new Province({session: test_session});
    province.country_id = 879921427;
    province.id = 224293623;
    province.tax = 0.09;
    await province.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/countries/879921427/provinces/224293623.json',
      query: '',
      headers,
      data: { "province": {id: 224293623, tax: 0.09} }
    }).toMatchMadeHttpRequest();
  });

});
