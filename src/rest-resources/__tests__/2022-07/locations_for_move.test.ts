/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {LocationsForMove} from '../../2022-07';

describe('LocationsForMove resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"locations_for_move": [{"location": {"id": 1072404544, "name": "Alpha Location"}, "message": "Current location.", "movable": false}, {"location": {"id": 1072404545, "name": "Bravo Location"}, "message": "No items are stocked at this location.", "movable": false}]}));

    await LocationsForMove.all({
      session: test_session,
      fulfillment_order_id: 1046000830,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-07/fulfillment_orders/1046000830/locations_for_move.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
