/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-04';

describe('Location resource', () => {
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
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"locations": [{"id": 655441491, "name": "50 Rideau Street", "address1": "50 Rideau Street", "address2": null, "city": "Ottawa", "zip": "K1N 9J7", "province": "Ontario", "country": "CA", "phone": null, "created_at": "2024-01-02T09:28:43-05:00", "updated_at": "2024-01-02T09:28:43-05:00", "country_code": "CA", "country_name": "Canada", "province_code": "ON", "legacy": false, "active": true, "admin_graphql_api_id": "gid://shopify/Location/655441491", "localized_country_name": "Canada", "localized_province_name": "Ontario"}, {"id": 24826418, "name": "Apple Api Shipwire", "address1": null, "address2": null, "city": null, "zip": null, "province": null, "country": "DE", "phone": null, "created_at": "2024-01-02T09:28:43-05:00", "updated_at": "2024-01-02T09:28:43-05:00", "country_code": "DE", "country_name": "Germany", "province_code": null, "legacy": true, "active": true, "admin_graphql_api_id": "gid://shopify/Location/24826418", "localized_country_name": "Germany", "localized_province_name": null}, {"id": 844681632, "name": "Apple Cupertino", "address1": null, "address2": null, "city": null, "zip": null, "province": null, "country": "US", "phone": null, "created_at": "2024-01-02T09:28:43-05:00", "updated_at": "2024-01-02T09:28:43-05:00", "country_code": "US", "country_name": "United States", "province_code": null, "legacy": false, "active": true, "admin_graphql_api_id": "gid://shopify/Location/844681632", "localized_country_name": "United States", "localized_province_name": null}, {"id": 611870435, "name": "Apple Shipwire", "address1": null, "address2": null, "city": null, "zip": null, "province": null, "country": "DE", "phone": null, "created_at": "2024-01-02T09:28:43-05:00", "updated_at": "2024-01-02T09:28:43-05:00", "country_code": "DE", "country_name": "Germany", "province_code": null, "legacy": true, "active": true, "admin_graphql_api_id": "gid://shopify/Location/611870435", "localized_country_name": "Germany", "localized_province_name": null}, {"id": 487838322, "name": "Fifth Avenue AppleStore", "address1": null, "address2": null, "city": null, "zip": null, "province": null, "country": "US", "phone": null, "created_at": "2024-01-02T09:28:43-05:00", "updated_at": "2024-01-02T09:28:43-05:00", "country_code": "US", "country_name": "United States", "province_code": null, "legacy": false, "active": true, "admin_graphql_api_id": "gid://shopify/Location/487838322", "localized_country_name": "United States", "localized_province_name": null}]}));

    await shopify.rest.Location.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/locations.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"location": {"id": 487838322, "name": "Fifth Avenue AppleStore", "address1": null, "address2": null, "city": null, "zip": null, "province": null, "country": "US", "phone": null, "created_at": "2024-01-02T09:28:43-05:00", "updated_at": "2024-01-02T09:28:43-05:00", "country_code": "US", "country_name": "United States", "province_code": null, "legacy": false, "active": true, "admin_graphql_api_id": "gid://shopify/Location/487838322"}}));

    await shopify.rest.Location.find({
      session: session,
      id: 487838322,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/locations/487838322.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 5}));

    await shopify.rest.Location.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/locations/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"inventory_levels": [{"inventory_item_id": 49148385, "location_id": 487838322, "available": 18, "updated_at": "2024-01-02T09:28:43-05:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/548380009?inventory_item_id=49148385"}, {"inventory_item_id": 808950810, "location_id": 487838322, "available": 9, "updated_at": "2024-01-02T09:28:43-05:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/548380009?inventory_item_id=808950810"}, {"inventory_item_id": 457924702, "location_id": 487838322, "available": 36, "updated_at": "2024-01-02T09:28:43-05:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/548380009?inventory_item_id=457924702"}, {"inventory_item_id": 39072856, "location_id": 487838322, "available": 27, "updated_at": "2024-01-02T09:28:43-05:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/548380009?inventory_item_id=39072856"}]}));

    await shopify.rest.Location.inventory_levels({
      session: session,
      id: 487838322,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/locations/487838322/inventory_levels.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
