/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-04';

describe('DiscountCode resource', () => {
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
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"discount_code": {"id": 1054381139, "price_rule_id": 507328175, "code": "SUMMERSALE10OFF", "usage_count": 0, "created_at": "2024-01-02T08:58:18-05:00", "updated_at": "2024-01-02T08:58:18-05:00"}}));

    const discount_code = new shopify.rest.DiscountCode({session: session});
    discount_code.price_rule_id = 507328175;
    discount_code.code = "SUMMERSALE10OFF";
    await discount_code.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/discount_codes.json',
      query: '',
      headers,
      data: { "discount_code": {"code": "SUMMERSALE10OFF"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"discount_codes": [{"id": 507328175, "price_rule_id": 507328175, "code": "SUMMERSALE10OFF", "usage_count": 0, "created_at": "2024-01-02T08:56:04-05:00", "updated_at": "2024-01-02T08:56:04-05:00"}]}));

    await shopify.rest.DiscountCode.all({
      session: session,
      price_rule_id: 507328175,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/discount_codes.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"discount_code": {"id": 507328175, "price_rule_id": 507328175, "code": "WINTERSALE20OFF", "usage_count": 0, "created_at": "2024-01-02T08:56:04-05:00", "updated_at": "2024-01-02T08:58:12-05:00"}}));

    const discount_code = new shopify.rest.DiscountCode({session: session});
    discount_code.price_rule_id = 507328175;
    discount_code.id = 507328175;
    discount_code.code = "WINTERSALE20OFF";
    await discount_code.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/discount_codes/507328175.json',
      query: '',
      headers,
      data: { "discount_code": {"code": "WINTERSALE20OFF"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"discount_code": {"id": 507328175, "price_rule_id": 507328175, "code": "SUMMERSALE10OFF", "usage_count": 0, "created_at": "2024-01-02T08:56:04-05:00", "updated_at": "2024-01-02T08:56:04-05:00"}}));

    await shopify.rest.DiscountCode.find({
      session: session,
      price_rule_id: 507328175,
      id: 507328175,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/discount_codes/507328175.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.DiscountCode.delete({
      session: session,
      price_rule_id: 507328175,
      id: 507328175,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/discount_codes/507328175.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 2}));

    await shopify.rest.DiscountCode.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/discount_codes/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"discount_code_creation": {"id": 989355119, "price_rule_id": 507328175, "started_at": null, "completed_at": null, "created_at": "2024-01-02T08:58:20-05:00", "updated_at": "2024-01-02T08:58:20-05:00", "status": "queued", "codes_count": 3, "imported_count": 0, "failed_count": 0, "logs": []}}));

    const discount_code = new shopify.rest.DiscountCode({session: session});
    discount_code.price_rule_id = 507328175;
    await discount_code.batch({
      body: {"discount_codes": [{"code": "SUMMER1"}, {"code": "SUMMER2"}, {"code": "SUMMER3"}]},
    });

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/batch.json',
      query: '',
      headers,
      data: {"discount_codes": [{"code": "SUMMER1"}, {"code": "SUMMER2"}, {"code": "SUMMER3"}]}
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"discount_code_creation": {"id": 173232803, "price_rule_id": 507328175, "started_at": null, "completed_at": null, "created_at": "2024-01-02T08:56:04-05:00", "updated_at": "2024-01-02T08:56:04-05:00", "status": "queued", "codes_count": 3, "imported_count": 0, "failed_count": 0, "logs": []}}));

    await shopify.rest.DiscountCode.get_all({
      session: session,
      price_rule_id: 507328175,
      batch_id: 173232803,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/batch/173232803.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.April23, restResources}),
    );

    queueMockResponse(JSON.stringify({"discount_codes": [{"id": null, "code": "foo", "errors": {}}, {"id": null, "code": "", "errors": {}}, {"id": null, "code": "bar", "errors": {}}]}));

    await shopify.rest.DiscountCode.all({
      session: session,
      price_rule_id: 507328175,
      batch_id: 173232803,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-04/price_rules/507328175/batch/173232803/discount_codes.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
