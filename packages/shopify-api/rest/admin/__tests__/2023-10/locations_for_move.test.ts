/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-10';

describe('LocationsForMove resource', () => {
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
      testConfig({apiVersion: ApiVersion.October23, restResources}),
    );

    queueMockResponse(JSON.stringify({"locations_for_move": [{"location": {"id": 1072404542, "name": "Alpha Location"}, "message": "Current location.", "movable": false}, {"location": {"id": 1072404543, "name": "Bravo Location"}, "message": "No items are stocked at this location.", "movable": false}]}));

    await shopify.rest.LocationsForMove.all({
      session: session,
      fulfillment_order_id: 1046000782,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-10/fulfillment_orders/1046000782/locations_for_move.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
