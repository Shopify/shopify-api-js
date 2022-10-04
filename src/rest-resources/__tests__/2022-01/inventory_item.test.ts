/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {InventoryItem} from '../../2022-01';

describe('InventoryItem resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"inventory_items": [{"id": 39072856, "sku": "IPOD2008GREEN", "created_at": "2022-10-03T13:07:13-04:00", "updated_at": "2022-10-03T13:07:13-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/39072856"}, {"id": 457924702, "sku": "IPOD2008BLACK", "created_at": "2022-10-03T13:07:13-04:00", "updated_at": "2022-10-03T13:07:13-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/457924702"}, {"id": 808950810, "sku": "IPOD2008PINK", "created_at": "2022-10-03T13:07:13-04:00", "updated_at": "2022-10-03T13:07:13-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}]}));

    await InventoryItem.all({
      session: test_session,
      ids: "808950810,39072856,457924702",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/inventory_items.json',
      query: 'ids=808950810%2C39072856%2C457924702',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"inventory_item": {"id": 808950810, "sku": "IPOD2008PINK", "created_at": "2022-10-03T13:07:13-04:00", "updated_at": "2022-10-03T13:07:13-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}}));

    await InventoryItem.find({
      session: test_session,
      id: 808950810,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/inventory_items/808950810.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"inventory_item": {"id": 808950810, "sku": "new sku", "created_at": "2022-10-03T13:07:13-04:00", "updated_at": "2022-10-03T13:11:09-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}}));

    const inventory_item = new InventoryItem({session: test_session});
    inventory_item.id = 808950810;
    inventory_item.sku = "new sku";
    await inventory_item.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/inventory_items/808950810.json',
      query: '',
      headers,
      data: { "inventory_item": {"sku": "new sku"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"inventory_item": {"id": 808950810, "sku": "IPOD2008PINK", "created_at": "2022-10-03T13:07:13-04:00", "updated_at": "2022-10-03T13:07:13-04:00", "requires_shipping": true, "cost": "25.00", "country_code_of_origin": null, "province_code_of_origin": null, "harmonized_system_code": null, "tracked": true, "country_harmonized_system_codes": [], "admin_graphql_api_id": "gid://shopify/InventoryItem/808950810"}}));

    const inventory_item = new InventoryItem({session: test_session});
    inventory_item.id = 808950810;
    inventory_item.cost = "25.00";
    await inventory_item.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/inventory_items/808950810.json',
      query: '',
      headers,
      data: { "inventory_item": {"cost": "25.00"} }
    }).toMatchMadeHttpRequest();
  });

});
