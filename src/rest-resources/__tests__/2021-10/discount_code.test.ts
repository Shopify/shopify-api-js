import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {DiscountCode} from '../../2021-10';

describe('DiscountCode resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const discount_code = new DiscountCode({session: test_session});
    discount_code.price_rule_id = 507328175;
    discount_code.code = "SUMMERSALE10OFF";
    await discount_code.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/discount_codes.json',
      query: '',
      headers,
      data: { "discount_code": {code: "SUMMERSALE10OFF"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DiscountCode.all({
      session: test_session,
      price_rule_id: 507328175,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/discount_codes.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const discount_code = new DiscountCode({session: test_session});
    discount_code.price_rule_id = 507328175;
    discount_code.id = 507328175;
    discount_code.code = "WINTERSALE20OFF";
    await discount_code.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/discount_codes/507328175.json',
      query: '',
      headers,
      data: { "discount_code": {id: 507328175, code: "WINTERSALE20OFF"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DiscountCode.find({
      session: test_session,
      price_rule_id: 507328175,
      id: 507328175,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/discount_codes/507328175.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DiscountCode.delete({
      session: test_session,
      price_rule_id: 507328175,
      id: 507328175,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/discount_codes/507328175.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DiscountCode.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/discount_codes/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const discount_code = new DiscountCode({session: test_session});
    discount_code.price_rule_id = 507328175;
    await discount_code.batch({
      body: {discount_codes: [{code: "SUMMER1"}, {code: "SUMMER2"}, {code: "SUMMER3"}]},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/batch.json',
      query: '',
      headers,
      data: {discount_codes: [{code: "SUMMER1"}, {code: "SUMMER2"}, {code: "SUMMER3"}]}
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DiscountCode.get_all({
      session: test_session,
      price_rule_id: 507328175,
      batch_id: 173232803,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/batch/173232803.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await DiscountCode.all({
      session: test_session,
      price_rule_id: 507328175,
      batch_id: 173232803,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/price_rules/507328175/batch/173232803/discount_codes.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
