import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ProductResourceFeedback} from '../../2022-01';

describe('ProductResourceFeedback resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product_resource_feedback = new ProductResourceFeedback({session: test_session});
    product_resource_feedback.product_id = 632910392;
    product_resource_feedback.state = "requires_action";
    product_resource_feedback.messages = [
      "Needs at least one image."
    ];
    product_resource_feedback.resource_updated_at = "2022-02-03T16:53:36-05:00";
    product_resource_feedback.feedback_generated_at = "2022-02-03T22:11:14.477009Z";
    await product_resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/products/632910392/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {state: "requires_action", messages: ["Needs at least one image."], resource_updated_at: "2022-02-03T16:53:36-05:00", feedback_generated_at: "2022-02-03T22:11:14.477009Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product_resource_feedback = new ProductResourceFeedback({session: test_session});
    product_resource_feedback.product_id = 632910392;
    product_resource_feedback.state = "success";
    product_resource_feedback.resource_updated_at = "2022-02-03T16:53:36-05:00";
    product_resource_feedback.feedback_generated_at = "2022-02-03T22:11:15.898793Z";
    await product_resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/products/632910392/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {state: "success", resource_updated_at: "2022-02-03T16:53:36-05:00", feedback_generated_at: "2022-02-03T22:11:15.898793Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await ProductResourceFeedback.all({
      session: test_session,
      product_id: 632910392,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/products/632910392/resource_feedback.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
