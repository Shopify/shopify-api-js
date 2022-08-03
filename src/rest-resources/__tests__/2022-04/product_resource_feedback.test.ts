import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {ProductResourceFeedback} from '../../2022-04';

describe('ProductResourceFeedback resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.April22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"resource_feedback": {"created_at": "2022-03-11T11:30:40-05:00", "updated_at": "2022-03-11T11:30:40-05:00", "resource_id": 632910392, "resource_type": "Product", "resource_updated_at": "2022-03-11T11:29:03-05:00", "messages": ["Needs at least one image."], "feedback_generated_at": "2022-03-11T11:30:39-05:00", "state": "requires_action"}}));

    const product_resource_feedback = new ProductResourceFeedback({session: test_session});
    product_resource_feedback.product_id = 632910392;
    product_resource_feedback.state = "requires_action";
    product_resource_feedback.messages = [
      "Needs at least one image."
    ];
    product_resource_feedback.resource_updated_at = "2022-03-11T11:29:03-05:00";
    product_resource_feedback.feedback_generated_at = "2022-03-11T16:30:39.280650Z";
    await product_resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products/632910392/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "requires_action", "messages": ["Needs at least one image."], "resource_updated_at": "2022-03-11T11:29:03-05:00", "feedback_generated_at": "2022-03-11T16:30:39.280650Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"resource_feedback": {"created_at": "2022-03-11T11:30:41-05:00", "updated_at": "2022-03-11T11:30:41-05:00", "resource_id": 632910392, "resource_type": "Product", "resource_updated_at": "2022-03-11T11:29:03-05:00", "messages": [], "feedback_generated_at": "2022-03-11T11:30:40-05:00", "state": "success"}}));

    const product_resource_feedback = new ProductResourceFeedback({session: test_session});
    product_resource_feedback.product_id = 632910392;
    product_resource_feedback.state = "success";
    product_resource_feedback.resource_updated_at = "2022-03-11T11:29:03-05:00";
    product_resource_feedback.feedback_generated_at = "2022-03-11T16:30:40.391897Z";
    await product_resource_feedback.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-04/products/632910392/resource_feedback.json',
      query: '',
      headers,
      data: { "resource_feedback": {"state": "success", "resource_updated_at": "2022-03-11T11:29:03-05:00", "feedback_generated_at": "2022-03-11T16:30:40.391897Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"resource_feedback": [{"created_at": "2022-03-11T11:30:44-05:00", "updated_at": "2022-03-11T11:30:44-05:00", "resource_id": 632910392, "resource_type": "Product", "resource_updated_at": "2022-03-11T11:29:03-05:00", "messages": ["Needs at least one image."], "feedback_generated_at": "2022-03-11T10:30:44-05:00", "state": "requires_action"}]}));

    await ProductResourceFeedback.all({
      session: test_session,
      product_id: 632910392,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-04/products/632910392/resource_feedback.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
