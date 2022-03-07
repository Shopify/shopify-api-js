import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Country} from '../../2022-01';

describe('Country resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Country.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Country.all({
      session: test_session,
      since_id: "359115488",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries.json',
      query: 'since_id=359115488',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const country = new Country({session: test_session});
    country.code = "FR";
    await country.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/countries.json',
      query: '',
      headers,
      data: { "country": {code: "FR"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const country = new Country({session: test_session});
    country.code = "FR";
    country.tax = 0.2;
    await country.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/countries.json',
      query: '',
      headers,
      data: { "country": {code: "FR", tax: 0.2} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Country.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Country.find({
      session: test_session,
      id: 879921427,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/countries/879921427.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const country = new Country({session: test_session});
    country.id = 879921427;
    country.tax = 0.05;
    await country.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/countries/879921427.json',
      query: '',
      headers,
      data: { "country": {id: 879921427, tax: 0.05} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Country.delete({
      session: test_session,
      id: 879921427,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/countries/879921427.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
