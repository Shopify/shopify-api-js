/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

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
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"resource_feedback": {"created_at": "2023-10-03T13:32:05-04:00", "updated_at": "2023-10-03T13:32:05-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2023-10-03T13:32:04-04:00", "state": "requires_action"}}));

    const resource_feedback = new shopify.rest.ResourceFeedback({session: session});
    resource_feedback.state = "requires_action";
    resource_feedback.messages = [
      "is not connected. Connect your account to use this sales channel."
    ];
    resource_feedback.feedback_generated_at = "2023-10-03T17:32:04.934710Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "requires_action", "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2023-10-03T17:32:04.934710Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"resource_feedback": {"created_at": "2023-10-03T13:32:04-04:00", "updated_at": "2023-10-03T13:32:04-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": [], "feedback_generated_at": "2023-10-03T13:32:04-04:00", "state": "success"}}));

    const resource_feedback = new shopify.rest.ResourceFeedback({session: session});
    resource_feedback.state = "success";
    resource_feedback.feedback_generated_at = "2023-10-03T17:32:04.362807Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "success", "feedback_generated_at": "2023-10-03T17:32:04.362807Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"resource_feedback": [{"created_at": "2023-10-03T13:32:03-04:00", "updated_at": "2023-10-03T13:32:03-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2023-10-03T12:32:03-04:00", "state": "requires_action"}]}));

    await shopify.rest.ResourceFeedback.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/resource_feedback.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
