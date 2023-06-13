import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {CarrierService} from '../../2021-07';

describe('CarrierService resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_service": {"id": 1036894963, "name": "Shipping Rate Provider", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894963", "format": "json", "callback_url": "http://shippingrateprovider.com/"}}));

    const carrier_service = new CarrierService({session: test_session});
    carrier_service.name = "Shipping Rate Provider";
    carrier_service.callback_url = "http://shippingrateprovider.com";
    carrier_service.service_discovery = true;
    await carrier_service.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/carrier_services.json',
      query: '',
      headers,
      data: { "carrier_service": {"name": "Shipping Rate Provider", "callback_url": "http://shippingrateprovider.com", "service_discovery": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_services": [{"id": 1036894965, "name": "Purolator", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894965", "format": "json", "callback_url": "http://example.com/"}, {"id": 260046840, "name": "ups_shipping", "active": true, "service_discovery": true, "carrier_service_type": "legacy", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/260046840"}]}));

    await CarrierService.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/carrier_services.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_service": {"active": false, "id": 1036894964, "name": "Some new name", "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894964", "format": "json", "callback_url": "http://example.com/"}}));

    const carrier_service = new CarrierService({session: test_session});
    carrier_service.id = 1036894964;
    carrier_service.name = "Some new name";
    carrier_service.active = false;
    await carrier_service.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/carrier_services/1036894964.json',
      query: '',
      headers,
      data: { "carrier_service": {"id": 1036894964, "name": "Some new name", "active": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"carrier_service": {"id": 1036894966, "name": "Purolator", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894966", "format": "json", "callback_url": "http://example.com/"}}));

    await CarrierService.find({
      session: test_session,
      id: 1036894966,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/carrier_services/1036894966.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await CarrierService.delete({
      session: test_session,
      id: 1036894967,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/carrier_services/1036894967.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
