import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ResourceFeedback} from '../../2022-01';

describe('ResourceFeedback resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const resource_feedback = new ResourceFeedback({session: test_session});
    resource_feedback.state = "requires_action";
    resource_feedback.messages = [
      "is not connected. Connect your account to use this sales channel."
    ];
    resource_feedback.feedback_generated_at = "2022-02-03T22:00:23.179942Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {state: "requires_action", messages: ["is not connected. Connect your account to use this sales channel."], feedback_generated_at: "2022-02-03T22:00:23.179942Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const resource_feedback = new ResourceFeedback({session: test_session});
    resource_feedback.state = "success";
    resource_feedback.feedback_generated_at = "2022-02-03T22:00:24.490026Z";
    await resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {state: "success", feedback_generated_at: "2022-02-03T22:00:24.490026Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ResourceFeedback.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/resource_feedback.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
