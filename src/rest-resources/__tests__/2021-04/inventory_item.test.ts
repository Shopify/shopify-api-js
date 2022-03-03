import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {InventoryItem} from '../../2021-04';

describe('InventoryItem resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await InventoryItem.all({
      session: test_session,
      ids: "808950810,39072856,457924702",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/inventory_items.json',
      query: 'ids=808950810%2C39072856%2C457924702',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await InventoryItem.find({
      session: test_session,
      id: 808950810,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-04/inventory_items/808950810.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const inventory_item = new InventoryItem({session: test_session});
    inventory_item.id = 808950810;
    inventory_item.sku = "new sku";
    await inventory_item.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-04/inventory_items/808950810.json',
      query: '',
      headers,
      data: { "inventory_item": {id: 808950810, sku: "new sku"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const inventory_item = new InventoryItem({session: test_session});
    inventory_item.id = 808950810;
    inventory_item.cost = "25.00";
    await inventory_item.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-04/inventory_items/808950810.json',
      query: '',
      headers,
      data: { "inventory_item": {id: 808950810, cost: "25.00"} }
    }).toMatchMadeHttpRequest();
  });

});
