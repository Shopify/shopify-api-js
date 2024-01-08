/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-01';

describe('CarrierService resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'this_is_a_test_token';

  it('test_1', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"carrier_service": {"id": 1036894960, "name": "Shipping Rate Provider", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894960", "format": "json", "callback_url": "http://shipping.example.com/"}}));

    const carrier_service = new shopify.rest.CarrierService({session: session});
    carrier_service.name = "Shipping Rate Provider";
    carrier_service.callback_url = "http://shipping.example.com";
    carrier_service.service_discovery = true;
    await carrier_service.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/carrier_services.json',
      query: '',
      headers,
      data: { "carrier_service": {"name": "Shipping Rate Provider", "callback_url": "http://shipping.example.com", "service_discovery": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"carrier_services": [{"id": 1036894957, "name": "Purolator", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894957", "format": "json", "callback_url": "http://example.com/"}, {"id": 260046840, "name": "ups_shipping", "active": true, "service_discovery": true, "carrier_service_type": "legacy", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/260046840"}]}));

    await shopify.rest.CarrierService.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/carrier_services.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"carrier_service": {"active": false, "id": 1036894958, "name": "Some new name", "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894958", "format": "json", "callback_url": "http://example.com/"}}));

    const carrier_service = new shopify.rest.CarrierService({session: session});
    carrier_service.id = 1036894958;
    carrier_service.name = "Some new name";
    carrier_service.active = false;
    await carrier_service.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-01/carrier_services/1036894958.json',
      query: '',
      headers,
      data: { "carrier_service": {"name": "Some new name", "active": false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({"carrier_service": {"id": 1036894954, "name": "Purolator", "active": true, "service_discovery": true, "carrier_service_type": "api", "admin_graphql_api_id": "gid://shopify/DeliveryCarrierService/1036894954", "format": "json", "callback_url": "http://example.com/"}}));

    await shopify.rest.CarrierService.find({
      session: session,
      id: 1036894954,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/carrier_services/1036894954.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.January23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.CarrierService.delete({
      session: session,
      id: 1036894955,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-01/carrier_services/1036894955.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
