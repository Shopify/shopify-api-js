import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ResourceFeedback} from '../../2021-10';

describe('ResourceFeedback resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"resource_feedback": {"created_at": "2022-03-30T19:20:15-04:00", "updated_at": "2022-03-30T19:20:15-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2022-03-30T19:20:14-04:00", "state": "requires_action"}}));

    const resource_feedback = new ResourceFeedback({session: test_session});
    resource_feedback.state = "requires_action";
    resource_feedback.messages = [
      "is not connected. Connect your account to use this sales channel."
    ];
    resource_feedback.feedback_generated_at = "2022-03-30T23:20:14.321460Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "requires_action", "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2022-03-30T23:20:14.321460Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"resource_feedback": {"created_at": "2022-03-30T19:20:16-04:00", "updated_at": "2022-03-30T19:20:16-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": [], "feedback_generated_at": "2022-03-30T19:20:15-04:00", "state": "success"}}));

    const resource_feedback = new ResourceFeedback({session: test_session});
    resource_feedback.state = "success";
    resource_feedback.feedback_generated_at = "2022-03-30T23:20:15.395706Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "success", "feedback_generated_at": "2022-03-30T23:20:15.395706Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"resource_feedback": [{"created_at": "2022-03-30T19:20:18-04:00", "updated_at": "2022-03-30T19:20:18-04:00", "resource_id": 548380009, "resource_type": "Shop", "resource_updated_at": null, "messages": ["is not connected. Connect your account to use this sales channel."], "feedback_generated_at": "2022-03-30T18:20:18-04:00", "state": "requires_action"}]}));

    await ResourceFeedback.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/resource_feedback.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
