import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {PriceRule} from '../../2022-01';

describe('PriceRule resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const price_rule = new PriceRule({session: test_session});
    price_rule.title = "SUMMERSALE10OFF";
    price_rule.target_type = "line_item";
    price_rule.target_selection = "all";
    price_rule.allocation_method = "across";
    price_rule.value_type = "fixed_amount";
    price_rule.value = "-10.0";
    price_rule.customer_selection = "all";
    price_rule.starts_at = "2017-01-19T17:59:10Z";
    await price_rule.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: { "price_rule": {title: "SUMMERSALE10OFF", target_type: "line_item", target_selection: "all", allocation_method: "across", value_type: "fixed_amount", value: "-10.0", customer_selection: "all", starts_at: "2017-01-19T17:59:10Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const price_rule = new PriceRule({session: test_session});
    price_rule.title = "15OFFCOLLECTION";
    price_rule.target_type = "line_item";
    price_rule.target_selection = "entitled";
    price_rule.allocation_method = "across";
    price_rule.value_type = "percentage";
    price_rule.value = "-15.0";
    price_rule.customer_selection = "all";
    price_rule.entitled_collection_ids = [
      841564295
    ];
    price_rule.starts_at = "2017-01-19T17:59:10Z";
    await price_rule.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: { "price_rule": {title: "15OFFCOLLECTION", target_type: "line_item", target_selection: "entitled", allocation_method: "across", value_type: "percentage", value: "-15.0", customer_selection: "all", entitled_collection_ids: [841564295], starts_at: "2017-01-19T17:59:10Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const price_rule = new PriceRule({session: test_session});
    price_rule.title = "FREESHIPPING";
    price_rule.target_type = "shipping_line";
    price_rule.target_selection = "all";
    price_rule.allocation_method = "each";
    price_rule.value_type = "percentage";
    price_rule.value = "-100.0";
    price_rule.usage_limit = 20;
    price_rule.customer_selection = "all";
    price_rule.prerequisite_subtotal_range = {
      greater_than_or_equal_to: "50.0"
    };
    price_rule.starts_at = "2017-01-19T17:59:10Z";
    await price_rule.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: { "price_rule": {title: "FREESHIPPING", target_type: "shipping_line", target_selection: "all", allocation_method: "each", value_type: "percentage", value: "-100.0", usage_limit: 20, customer_selection: "all", prerequisite_subtotal_range: {greater_than_or_equal_to: "50.0"}, starts_at: "2017-01-19T17:59:10Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const price_rule = new PriceRule({session: test_session});
    price_rule.title = "5OFFCUSTOMERGROUP";
    price_rule.target_type = "line_item";
    price_rule.target_selection = "all";
    price_rule.allocation_method = "across";
    price_rule.value_type = "fixed_amount";
    price_rule.value = "-5.0";
    price_rule.customer_selection = "prerequisite";
    price_rule.prerequisite_saved_search_ids = [
      789629109
    ];
    price_rule.starts_at = "2017-01-19T17:59:10Z";
    await price_rule.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: { "price_rule": {title: "5OFFCUSTOMERGROUP", target_type: "line_item", target_selection: "all", allocation_method: "across", value_type: "fixed_amount", value: "-5.0", customer_selection: "prerequisite", prerequisite_saved_search_ids: [789629109], starts_at: "2017-01-19T17:59:10Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const price_rule = new PriceRule({session: test_session});
    price_rule.title = "Buy2iPodsGetiPodTouchForFree";
    price_rule.value_type = "percentage";
    price_rule.value = "-100.0";
    price_rule.customer_selection = "all";
    price_rule.target_type = "line_item";
    price_rule.target_selection = "entitled";
    price_rule.allocation_method = "each";
    price_rule.starts_at = "2018-03-22T00:00:00-00:00";
    price_rule.prerequisite_collection_ids = [
      841564295
    ];
    price_rule.entitled_product_ids = [
      921728736
    ];
    price_rule.prerequisite_to_entitlement_quantity_ratio = {
      prerequisite_quantity: 2,
      entitled_quantity: 1
    };
    price_rule.allocation_limit = 3;
    await price_rule.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: { "price_rule": {title: "Buy2iPodsGetiPodTouchForFree", value_type: "percentage", value: "-100.0", customer_selection: "all", target_type: "line_item", target_selection: "entitled", allocation_method: "each", starts_at: "2018-03-22T00:00:00-00:00", prerequisite_collection_ids: [841564295], entitled_product_ids: [921728736], prerequisite_to_entitlement_quantity_ratio: {prerequisite_quantity: 2, entitled_quantity: 1}, allocation_limit: 3} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PriceRule.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const price_rule = new PriceRule({session: test_session});
    price_rule.id = 507328175;
    price_rule.title = "WINTER SALE";
    await price_rule.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/price_rules/507328175.json',
      query: '',
      headers,
      data: { "price_rule": {id: 507328175, title: "WINTER SALE"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PriceRule.find({
      session: test_session,
      id: 507328175,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/price_rules/507328175.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PriceRule.delete({
      session: test_session,
      id: 507328175,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/price_rules/507328175.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PriceRule.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/price_rules/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
