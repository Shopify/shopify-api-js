/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

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
    fetchMock.mockResponseOnce(JSON.stringify({"price_rule": {"id": 996341478, "value_type": "percentage", "value": "-100.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "entitled", "allocation_method": "each", "allocation_limit": 3, "once_per_customer": false, "usage_limit": null, "starts_at": "2018-03-21T20:00:00-04:00", "ends_at": null, "created_at": "2022-10-03T12:24:17-04:00", "updated_at": "2022-10-03T12:24:17-04:00", "entitled_product_ids": [921728736], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [841564295], "customer_segment_prerequisite_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": 2, "entitled_quantity": 1}, "prerequisite_to_entitlement_purchase": {"prerequisite_amount": null}, "title": "Buy2iPodsGetiPodTouchForFree", "admin_graphql_api_id": "gid://shopify/PriceRule/996341478"}}));

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
      "prerequisite_quantity": 2,
      "entitled_quantity": 1
    };
    price_rule.allocation_limit = 3;
    await price_rule.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: { "price_rule": {"title": "Buy2iPodsGetiPodTouchForFree", "value_type": "percentage", "value": "-100.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "entitled", "allocation_method": "each", "starts_at": "2018-03-22T00:00:00-00:00", "prerequisite_collection_ids": [841564295], "entitled_product_ids": [921728736], "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": 2, "entitled_quantity": 1}, "allocation_limit": 3} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"price_rule": {"id": 996341479, "value_type": "percentage", "value": "-100.0", "customer_selection": "all", "target_type": "shipping_line", "target_selection": "all", "allocation_method": "each", "allocation_limit": null, "once_per_customer": false, "usage_limit": 20, "starts_at": "2017-01-19T12:59:10-05:00", "ends_at": null, "created_at": "2022-10-03T12:24:18-04:00", "updated_at": "2022-10-03T12:24:18-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "customer_segment_prerequisite_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": {"greater_than_or_equal_to": "50.0"}, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "prerequisite_to_entitlement_purchase": {"prerequisite_amount": null}, "title": "FREESHIPPING", "admin_graphql_api_id": "gid://shopify/PriceRule/996341479"}}));

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
      "greater_than_or_equal_to": "50.0"
    };
    price_rule.starts_at = "2017-01-19T17:59:10Z";
    await price_rule.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: '',
      headers,
      data: { "price_rule": {"title": "FREESHIPPING", "target_type": "shipping_line", "target_selection": "all", "allocation_method": "each", "value_type": "percentage", "value": "-100.0", "usage_limit": 20, "customer_selection": "all", "prerequisite_subtotal_range": {"greater_than_or_equal_to": "50.0"}, "starts_at": "2017-01-19T17:59:10Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"price_rule": {"id": 996341480, "value_type": "fixed_amount", "value": "-10.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "all", "allocation_method": "across", "allocation_limit": null, "once_per_customer": false, "usage_limit": null, "starts_at": "2017-01-19T12:59:10-05:00", "ends_at": null, "created_at": "2022-10-03T12:24:22-04:00", "updated_at": "2022-10-03T12:24:22-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "customer_segment_prerequisite_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "prerequisite_to_entitlement_purchase": {"prerequisite_amount": null}, "title": "SUMMERSALE10OFF", "admin_graphql_api_id": "gid://shopify/PriceRule/996341480"}}));

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
      data: { "price_rule": {"title": "SUMMERSALE10OFF", "target_type": "line_item", "target_selection": "all", "allocation_method": "across", "value_type": "fixed_amount", "value": "-10.0", "customer_selection": "all", "starts_at": "2017-01-19T17:59:10Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"price_rule": {"id": 996341481, "value_type": "percentage", "value": "-15.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "entitled", "allocation_method": "across", "allocation_limit": null, "once_per_customer": false, "usage_limit": null, "starts_at": "2017-01-19T12:59:10-05:00", "ends_at": null, "created_at": "2022-10-03T12:24:29-04:00", "updated_at": "2022-10-03T12:24:29-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [841564295], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "customer_segment_prerequisite_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "prerequisite_to_entitlement_purchase": {"prerequisite_amount": null}, "title": "15OFFCOLLECTION", "admin_graphql_api_id": "gid://shopify/PriceRule/996341481"}}));

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
      data: { "price_rule": {"title": "15OFFCOLLECTION", "target_type": "line_item", "target_selection": "entitled", "allocation_method": "across", "value_type": "percentage", "value": "-15.0", "customer_selection": "all", "entitled_collection_ids": [841564295], "starts_at": "2017-01-19T17:59:10Z"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"price_rule": {"id": 507328175, "value_type": "fixed_amount", "value": "-10.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "all", "allocation_method": "across", "allocation_limit": null, "once_per_customer": false, "usage_limit": null, "starts_at": "2022-09-27T12:15:55-04:00", "ends_at": "2022-10-09T12:15:55-04:00", "created_at": "2022-10-03T12:15:55-04:00", "updated_at": "2022-10-03T12:24:20-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "customer_segment_prerequisite_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "prerequisite_to_entitlement_purchase": {"prerequisite_amount": null}, "title": "WINTER SALE", "admin_graphql_api_id": "gid://shopify/PriceRule/507328175"}}));

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
      data: { "price_rule": {"title": "WINTER SALE"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"price_rule": {"id": 507328175, "value_type": "fixed_amount", "value": "-10.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "all", "allocation_method": "across", "allocation_limit": null, "once_per_customer": false, "usage_limit": null, "starts_at": "2022-09-27T12:15:55-04:00", "ends_at": "2022-10-09T12:15:55-04:00", "created_at": "2022-10-03T12:15:55-04:00", "updated_at": "2022-10-03T12:15:55-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "customer_segment_prerequisite_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "prerequisite_to_entitlement_purchase": {"prerequisite_amount": null}, "title": "SUMMERSALE10OFF", "admin_graphql_api_id": "gid://shopify/PriceRule/507328175"}}));

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

  it('test_7', async () => {
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

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"price_rules": [{"id": 507328175, "value_type": "fixed_amount", "value": "-10.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "all", "allocation_method": "across", "allocation_limit": null, "once_per_customer": false, "usage_limit": null, "starts_at": "2022-09-27T12:15:55-04:00", "ends_at": "2022-10-09T12:15:55-04:00", "created_at": "2022-10-03T12:15:55-04:00", "updated_at": "2022-10-03T12:15:55-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "prerequisite_saved_search_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "title": "SUMMERSALE10OFF", "admin_graphql_api_id": "gid://shopify/PriceRule/507328175"}]}));

    await PriceRule.all({
      session: test_session,
      since_id: "106886545",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/price_rules.json',
      query: 'since_id=106886545',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"price_rules": [{"id": 507328175, "value_type": "fixed_amount", "value": "-10.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "all", "allocation_method": "across", "allocation_limit": null, "once_per_customer": false, "usage_limit": null, "starts_at": "2022-09-27T12:15:55-04:00", "ends_at": "2022-10-09T12:15:55-04:00", "created_at": "2022-10-03T12:15:55-04:00", "updated_at": "2022-10-03T12:15:55-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "prerequisite_saved_search_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "title": "SUMMERSALE10OFF", "admin_graphql_api_id": "gid://shopify/PriceRule/507328175"}, {"id": 106886544, "value_type": "fixed_amount", "value": "-10.0", "customer_selection": "all", "target_type": "line_item", "target_selection": "all", "allocation_method": "across", "allocation_limit": null, "once_per_customer": false, "usage_limit": null, "starts_at": "2022-10-01T12:15:55-04:00", "ends_at": "2022-10-05T12:15:55-04:00", "created_at": "2022-10-03T12:15:55-04:00", "updated_at": "2022-10-03T12:15:55-04:00", "entitled_product_ids": [], "entitled_variant_ids": [], "entitled_collection_ids": [], "entitled_country_ids": [], "prerequisite_product_ids": [], "prerequisite_variant_ids": [], "prerequisite_collection_ids": [], "prerequisite_saved_search_ids": [], "prerequisite_customer_ids": [], "prerequisite_subtotal_range": null, "prerequisite_quantity_range": null, "prerequisite_shipping_price_range": null, "prerequisite_to_entitlement_quantity_ratio": {"prerequisite_quantity": null, "entitled_quantity": null}, "title": "TENOFF", "admin_graphql_api_id": "gid://shopify/PriceRule/106886544"}]}));

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

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"count": 2}));

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
