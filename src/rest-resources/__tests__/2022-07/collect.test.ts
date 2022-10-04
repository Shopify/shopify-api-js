/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Collect} from '../../2022-07';

describe('Collect resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collect": {"id": 1071559580, "collection_id": 841564295, "product_id": 921728736, "created_at": "2022-10-03T13:19:30-04:00", "updated_at": "2022-10-03T13:19:30-04:00", "position": 2, "sort_value": "0000000002"}}));

    const collect = new Collect({session: test_session});
    collect.product_id = 921728736;
    collect.collection_id = 841564295;
    await collect.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/collects.json',
      query: '',
      headers,
      data: { "collect": {"product_id": 921728736, "collection_id": 841564295} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Collect.delete({
      session: test_session,
      id: 455204334,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-07/collects/455204334.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collect": {"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}}));

    await Collect.find({
      session: test_session,
      id: 455204334,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/collects/455204334.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collects": [{"id": 358268117, "collection_id": 482865238, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 773559378, "collection_id": 395646240, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}]}));

    await Collect.all({
      session: test_session,
      product_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/collects.json',
      query: 'product_id=632910392',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collects": [{"id": 358268117, "collection_id": 482865238, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 773559378, "collection_id": 395646240, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 800915878, "collection_id": 482865238, "product_id": 921728736, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}]}));

    await Collect.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/collects.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"collects": [{"id": 455204334, "collection_id": 841564295, "product_id": 632910392, "created_at": null, "updated_at": null, "position": 1, "sort_value": "0000000001"}, {"id": 1071559581, "collection_id": 841564295, "product_id": 921728736, "created_at": "2022-10-03T13:19:33-04:00", "updated_at": "2022-10-03T13:19:33-04:00", "position": 2, "sort_value": "0000000002"}]}));

    await Collect.all({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/collects.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 1}));

    await Collect.count({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/collects/count.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await Collect.count({
      session: test_session,
      product_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/collects/count.json',
      query: 'product_id=632910392',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

    await Collect.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/collects/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
