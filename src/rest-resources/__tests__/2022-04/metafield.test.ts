import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Metafield} from '../../2022-04';

describe('Metafield resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"metafields": [{"id": 721389482, "namespace": "affiliates", "key": "app_key", "value": "app_key", "value_type": "string", "description": null, "owner_id": 548380009, "created_at": "2022-03-11T11:02:04-05:00", "updated_at": "2022-03-11T11:02:04-05:00", "owner_resource": "shop", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/721389482"}]}));

    await Metafield.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/metafields.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"metafields": [{"id": 1063298190, "namespace": "inventory", "key": "warehouse", "value": 25, "value_type": "integer", "description": null, "owner_id": 548380009, "created_at": "2022-03-11T11:14:56-05:00", "updated_at": "2022-03-11T11:14:56-05:00", "owner_resource": "shop", "type": "number_integer", "admin_graphql_api_id": "gid://shopify/Metafield/1063298190"}]}));

    await Metafield.all({
      session: test_session,
      since_id: "721389482",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/metafields.json',
      query: 'since_id=721389482',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"metafield": {"id": 1063298193, "namespace": "inventory", "key": "warehouse", "value": 25, "value_type": "integer", "description": null, "owner_id": 548380009, "created_at": "2022-03-11T11:15:11-05:00", "updated_at": "2022-03-11T11:15:11-05:00", "owner_resource": "shop", "type": "number_integer", "admin_graphql_api_id": "gid://shopify/Metafield/1063298193"}}));

    const metafield = new Metafield({session: test_session});
    metafield.namespace = "inventory";
    metafield.key = "warehouse";
    metafield.value = 25;
    metafield.type = "number_integer";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "inventory", "key": "warehouse", "value": 25, "type": "number_integer"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"metafields": [{"id": 625663657, "namespace": "translation", "key": "title_fr", "value": "tbn", "description": "French product image title", "owner_id": 850703190, "created_at": "2022-03-11T11:02:04-05:00", "updated_at": "2022-03-11T11:02:04-05:00", "owner_resource": "product_image", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/625663657"}]}));

    await Metafield.all({
      session: test_session,
      metafield: {"owner_id": "850703190", "owner_resource": "product_image"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/metafields.json',
      query: 'metafield%5Bowner_id%5D=850703190&metafield%5Bowner_resource%5D=product_image',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 1}));

    await Metafield.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/metafields/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"metafield": {"id": 721389482, "namespace": "affiliates", "key": "app_key", "value": "app_key", "value_type": "string", "description": null, "owner_id": 548380009, "created_at": "2022-03-11T11:02:04-05:00", "updated_at": "2022-03-11T11:02:04-05:00", "owner_resource": "shop", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/721389482"}}));

    await Metafield.find({
      session: test_session,
      id: 721389482,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/metafields/721389482.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"metafield": {"value": "something new", "value_type": "string", "namespace": "affiliates", "key": "app_key", "id": 721389482, "description": null, "owner_id": 548380009, "created_at": "2022-03-11T11:02:04-05:00", "updated_at": "2022-03-11T11:15:17-05:00", "owner_resource": "shop", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/721389482"}}));

    const metafield = new Metafield({session: test_session});
    metafield.id = 721389482;
    metafield.value = "something new";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/metafields/721389482.json',
      query: '',
      headers,
      data: { "metafield": {"id": 721389482, "value": "something new", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Metafield.delete({
      session: test_session,
      id: 721389482,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-04/metafields/721389482.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
