/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CarrierService} from '../../2022-07';

describe('CarrierService resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_service": {"id": 1036894955, "name": "Shipping Rate Provider", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894955", "format": "json", "callback_url": "http://shipping.example.com/"}}));

    const carrier_service = new CarrierService({session: test_session});
    carrier_service.name = "Shipping Rate Provider";
    carrier_service.callback_url = "http://shipping.example.com";
    carrier_service.service_discovery = true;
    await carrier_service.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-07/carrier_services.json',
      query: '',
      headers,
      data: { "carrier_service": {"name": "Shipping Rate Provider", "callback_url": "http://shipping.example.com", "service_discovery": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_services": [{"id": 1036894957, "name": "Purolator", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894957", "format": "json", "callback_url": "http://example.com/"}, {"id": 260046840, "name": "ups_shipping", "active": true, "service_discovery": true, "carrier_service_type": "legacy", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/260046840"}]}));

    await CarrierService.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/carrier_services.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_service": {"active": false, "id": 1036894956, "name": "Some new name", "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894956", "format": "json", "callback_url": "http://example.com/"}}));

    const carrier_service = new CarrierService({session: test_session});
    carrier_service.id = 1036894956;
    carrier_service.name = "Some new name";
    carrier_service.active = false;
    await carrier_service.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-07/carrier_services/1036894956.json',
      query: '',
      headers,
      data: { "carrier_service": {"name": "Some new name", "active": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_service": {"id": 1036894958, "name": "Purolator", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894958", "format": "json", "callback_url": "http://example.com/"}}));

    await CarrierService.find({
      session: test_session,
      id: 1036894958,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/carrier_services/1036894958.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CarrierService.delete({
      session: test_session,
      id: 1036894959,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-07/carrier_services/1036894959.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
