/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-04';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.April22,
    restResources,
  });
});

describe('InventoryItem resource', () => {
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
    queueMockResponse(JSON.stringify({"inventory_items": [{"id": 39072856, "sku": "IPOD2008GREEN", "created_at": "2023-06-14T14:13:28-04:00", "updated_at": "2023-06-14T14:13:28-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/39072856"}, {"id": 457924702, "sku": "IPOD2008BLACK", "created_at": "2023-06-14T14:13:28-04:00", "updated_at": "2023-06-14T14:13:28-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/457924702"}, {"id": 808950810, "sku": "IPOD2008PINK", "created_at": "2023-06-14T14:13:28-04:00", "updated_at": "2023-06-14T14:13:28-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}]}));

    await shopify.rest.InventoryItem.all({
      session: session,
      ids: "808950810,39072856,457924702",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/inventory_items.json',
      query: 'ids=808950810%2C39072856%2C457924702',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"inventory_item": {"id": 808950810, "sku": "IPOD2008PINK", "created_at": "2023-06-14T14:13:28-04:00", "updated_at": "2023-06-14T14:13:28-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}}));

    await shopify.rest.InventoryItem.find({
      session: session,
      id: 808950810,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/inventory_items/808950810.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"inventory_item": {"id": 808950810, "sku": "new sku", "created_at": "2023-06-14T14:13:28-04:00", "updated_at": "2023-06-14T14:14:36-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}}));

    const inventory_item = new shopify.rest.InventoryItem({session: session});
    inventory_item.id = 808950810;
    inventory_item.sku = "new sku";
    await inventory_item.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/inventory_items/808950810.json',
      query: '',
      headers,
      data: { "inventory_item": {"sku": "new sku"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"inventory_item": {"id": 808950810, "sku": "IPOD2008PINK", "created_at": "2023-06-14T14:13:28-04:00", "updated_at": "2023-06-14T14:13:28-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}}));

    const inventory_item = new shopify.rest.InventoryItem({session: session});
    inventory_item.id = 808950810;
    inventory_item.cost = "25.00";
    await inventory_item.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-04/inventory_items/808950810.json',
      query: '',
      headers,
      data: { "inventory_item": {"cost": "25.00"} }
    }).toMatchMadeHttpRequest();
  });

});
