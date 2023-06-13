/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Redirect} from '../../2022-04';

describe('Redirect resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirects": [{"id": 950115854, "path": "/ibook", "target": "/products/macbook"}]}));

    await Redirect.all({
      session: test_session,
      since_id: "668809255",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/redirects.json',
      query: 'since_id=668809255',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirects": [{"id": 304339089, "path": "/products.php", "target": "/products"}, {"id": 668809255, "path": "/leopard", "target": "/pages/macosx"}, {"id": 950115854, "path": "/ibook", "target": "/products/macbook"}]}));

    await Redirect.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/redirects.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 3}));

    await Redirect.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/redirects/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirect": {"id": 668809255, "path": "/leopard", "target": "/pages/macosx"}}));

    await Redirect.find({
      session: test_session,
      id: 668809255,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/redirects/668809255.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirect": {"path": "/powermac", "target": "/pages/macpro", "id": 950115854}}));

    const redirect = new Redirect({session: test_session});
    redirect.id = 950115854;
    redirect.path = "/powermac";
    redirect.target = "/pages/macpro";
    await redirect.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/redirects/950115854.json',
      query: '',
      headers,
      data: { "redirect": {"path": "/powermac", "target": "/pages/macpro"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirect": {"path": "/tiger", "target": "/pages/macosx", "id": 668809255}}));

    const redirect = new Redirect({session: test_session});
    redirect.id = 668809255;
    redirect.path = "/tiger";
    await redirect.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/redirects/668809255.json',
      query: '',
      headers,
      data: { "redirect": {"path": "/tiger"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirect": {"target": "/pages/macpro", "path": "/leopard", "id": 668809255}}));

    const redirect = new Redirect({session: test_session});
    redirect.id = 668809255;
    redirect.target = "/pages/macpro";
    await redirect.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/redirects/668809255.json',
      query: '',
      headers,
      data: { "redirect": {"target": "/pages/macpro"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Redirect.delete({
      session: test_session,
      id: 668809255,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-04/redirects/668809255.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirect": {"id": 984542199, "path": "/ipod", "target": "/pages/itunes"}}));

    const redirect = new Redirect({session: test_session});
    redirect.path = "/ipod";
    redirect.target = "/pages/itunes";
    await redirect.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/redirects.json',
      query: '',
      headers,
      data: { "redirect": {"path": "/ipod", "target": "/pages/itunes"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"redirect": {"id": 984542200, "path": "/forums", "target": "http://forums.apple.com/"}}));

    const redirect = new Redirect({session: test_session});
    redirect.path = "http://www.apple.com/forums";
    redirect.target = "http://forums.apple.com";
    await redirect.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/redirects.json',
      query: '',
      headers,
      data: { "redirect": {"path": "http://www.apple.com/forums", "target": "http://forums.apple.com"} }
    }).toMatchMadeHttpRequest();
  });

});
