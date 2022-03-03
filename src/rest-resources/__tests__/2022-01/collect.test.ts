import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Collect} from '../../2022-01';

describe('Collect resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const collect = new Collect({session: test_session});
    collect.product_id = 921728736;
    collect.collection_id = 841564295;
    await collect.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/collects.json',
      query: '',
      headers,
      data: { "collect": {product_id: 921728736, collection_id: 841564295} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collects.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.all({
      session: test_session,
      product_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collects.json',
      query: 'product_id=632910392',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.all({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collects.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.delete({
      session: test_session,
      id: 455204334,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/collects/455204334.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.find({
      session: test_session,
      id: 455204334,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collects/455204334.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collects/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.count({
      session: test_session,
      product_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collects/count.json',
      query: 'product_id=632910392',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.count({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/collects/count.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
