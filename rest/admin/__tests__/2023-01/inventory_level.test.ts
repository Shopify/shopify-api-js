/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2023-01';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.January23,
    restResources,
  });
});

describe('InventoryLevel resource', () => {
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
    queueMockResponse(JSON.stringify({"inventory_levels": [{"inventory_item_id": 49148385, "location_id": 655441491, "available": 2, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=49148385"}, {"inventory_item_id": 808950810, "location_id": 655441491, "available": 1, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=808950810"}, {"inventory_item_id": 457924702, "location_id": 655441491, "available": 4, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=457924702"}, {"inventory_item_id": 39072856, "location_id": 655441491, "available": 3, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=39072856"}]}));

    await shopify.rest.InventoryLevel.all({
      session: session,
      location_ids: "655441491",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/inventory_levels.json',
      query: 'location_ids=655441491',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"inventory_levels": [{"inventory_item_id": 808950810, "location_id": 487838322, "available": 9, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/548380009?inventory_item_id=808950810"}, {"inventory_item_id": 808950810, "location_id": 655441491, "available": 1, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=808950810"}]}));

    await shopify.rest.InventoryLevel.all({
      session: session,
      inventory_item_ids: "808950810",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/inventory_levels.json',
      query: 'inventory_item_ids=808950810',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"inventory_levels": [{"inventory_item_id": 808950810, "location_id": 487838322, "available": 9, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/548380009?inventory_item_id=808950810"}, {"inventory_item_id": 39072856, "location_id": 487838322, "available": 27, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/548380009?inventory_item_id=39072856"}, {"inventory_item_id": 808950810, "location_id": 655441491, "available": 1, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=808950810"}, {"inventory_item_id": 39072856, "location_id": 655441491, "available": 3, "updated_at": "2023-07-05T18:38:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=39072856"}]}));

    await shopify.rest.InventoryLevel.all({
      session: session,
      inventory_item_ids: "808950810,39072856",
      location_ids: "655441491,487838322",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-01/inventory_levels.json',
      query: 'inventory_item_ids=808950810%2C39072856&location_ids=655441491%2C487838322',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    queueMockResponse(JSON.stringify({"inventory_level": {"inventory_item_id": 808950810, "location_id": 655441491, "available": 6, "updated_at": "2023-07-05T18:44:56-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=808950810"}}));

    const inventory_level = new shopify.rest.InventoryLevel({session: session});

    await inventory_level.adjust({
      body: {"location_id": 655441491, "inventory_item_id": 808950810, "available_adjustment": 5},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/inventory_levels/adjust.json',
      query: '',
      headers,
      data: {"location_id": 655441491, "inventory_item_id": 808950810, "available_adjustment": 5}
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    queueMockResponse(JSON.stringify({}));

    await shopify.rest.InventoryLevel.delete({
      session: session,
      inventory_item_id: "808950810",
      location_id: "655441491",
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-01/inventory_levels.json',
      query: 'inventory_item_id=808950810&location_id=655441491',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    queueMockResponse(JSON.stringify({"inventory_level": {"inventory_item_id": 457924702, "location_id": 844681632, "available": 0, "updated_at": "2023-07-05T18:45:03-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/844681632?inventory_item_id=457924702"}}));

    const inventory_level = new shopify.rest.InventoryLevel({session: session});

    await inventory_level.connect({
      body: {"location_id": 844681632, "inventory_item_id": 457924702},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/inventory_levels/connect.json',
      query: '',
      headers,
      data: {"location_id": 844681632, "inventory_item_id": 457924702}
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    queueMockResponse(JSON.stringify({"inventory_level": {"inventory_item_id": 808950810, "location_id": 655441491, "available": 42, "updated_at": "2023-07-05T18:45:05-04:00", "admin_graphql_api_id": "gid://shopify/InventoryLevel/655441491?inventory_item_id=808950810"}}));

    const inventory_level = new shopify.rest.InventoryLevel({session: session});

    await inventory_level.set({
      body: {"location_id": 655441491, "inventory_item_id": 808950810, "available": 42},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-01/inventory_levels/set.json',
      query: '',
      headers,
      data: {"location_id": 655441491, "inventory_item_id": 808950810, "available": 42}
    }).toMatchMadeHttpRequest();
  });

});
