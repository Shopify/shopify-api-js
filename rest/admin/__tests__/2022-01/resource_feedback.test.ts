/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {testConfig, queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi, Shopify} from '../../../../lib';

import {restResources} from '../../2022-01';

let shopify: Shopify<typeof restResources>;

beforeEach(() => {
  shopify = shopifyApi({
    ...testConfig,
    apiVersion: ApiVersion.January22,
    restResources,
  });
});

describe('ResourceFeedback resource', () => {
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
    queueMockResponse(JSON.stringify({"resource_feedback": {"created_at": "2022-10-03T12:45:53-04:00", "updated_at": "2022-10-03T12:45:53-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2022-10-03T12:45:51-04:00", "state": "requires_action"}}));

    const resource_feedback = new shopify.rest.ResourceFeedback({session: session});
    resource_feedback.state = "requires_action";
    resource_feedback.messages = [
      "is not connected. Connect your account to use this sales channel."
    ];
    resource_feedback.feedback_generated_at = "2022-10-03T16:45:51.594730Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "requires_action", "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2022-10-03T16:45:51.594730Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    queueMockResponse(JSON.stringify({"resource_feedback": {"created_at": "2022-10-03T12:45:55-04:00", "updated_at": "2022-10-03T12:45:55-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": [], "feedback_generated_at": "2022-10-03T12:45:53-04:00", "state": "success"}}));

    const resource_feedback = new shopify.rest.ResourceFeedback({session: session});
    resource_feedback.state = "success";
    resource_feedback.feedback_generated_at = "2022-10-03T16:45:53.872041Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "success", "feedback_generated_at": "2022-10-03T16:45:53.872041Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    queueMockResponse(JSON.stringify({"resource_feedback": [{"created_at": "2022-10-03T12:45:57-04:00", "updated_at": "2022-10-03T12:45:57-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2022-10-03T11:45:57-04:00", "state": "requires_action"}]}));

    await shopify.rest.ResourceFeedback.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/resource_feedback.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
