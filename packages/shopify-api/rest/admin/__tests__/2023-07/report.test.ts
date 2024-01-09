/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2023-07';

describe('Report resource', () => {
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
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"reports": [{"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}, {"id": 752357116, "name": "Custom App Report 2", "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales", "updated_at": "2024-01-02T08:59:11-05:00", "category": "custom_app_reports"}]}));

    await shopify.rest.Report.all({
      session: session,
      since_id: "123",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/reports.json',
      query: 'since_id=123',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"reports": [{"id": 752357116, "name": "Custom App Report 2", "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales", "updated_at": "2024-01-02T08:59:11-05:00", "category": "custom_app_reports"}, {"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}]}));

    await shopify.rest.Report.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/reports.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"reports": [{"id": 752357116, "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales"}, {"id": 517154478, "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today"}]}));

    await shopify.rest.Report.all({
      session: session,
      fields: "id,shopify_ql",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/reports.json',
      query: 'fields=id%2Cshopify_ql',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"reports": [{"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}]}));

    await shopify.rest.Report.all({
      session: session,
      ids: "517154478",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/reports.json',
      query: 'ids=517154478',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"reports": [{"id": 752357116, "name": "Custom App Report 2", "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales", "updated_at": "2024-01-02T08:59:11-05:00", "category": "custom_app_reports"}, {"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}]}));

    await shopify.rest.Report.all({
      session: session,
      updated_at_min: "2005-07-31 15:57:11 EDT -04:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/reports.json',
      query: 'updated_at_min=2005-07-31+15%3A57%3A11+EDT+-04%3A00',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"report": {"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}}));

    await shopify.rest.Report.find({
      session: session,
      id: 517154478,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/reports/517154478.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"report": {"id": 517154478, "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today"}}));

    await shopify.rest.Report.find({
      session: session,
      id: 517154478,
      fields: "id,shopify_ql",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2023-07/reports/517154478.json',
      query: 'fields=id%2Cshopify_ql',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"report": {"name": "Changed Report Name", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -12m UNTIL today ORDER BY total_sales", "id": 517154478, "updated_at": "2024-01-02T09:02:57-05:00", "category": "custom_app_reports"}}));

    const report = new shopify.rest.Report({session: session});
    report.id = 517154478;
    report.name = "Changed Report Name";
    report.shopify_ql = "SHOW total_sales BY order_id FROM sales SINCE -12m UNTIL today ORDER BY total_sales";
    await report.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2023-07/reports/517154478.json',
      query: '',
      headers,
      data: { "report": {"name": "Changed Report Name", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -12m UNTIL today ORDER BY total_sales"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Report.delete({
      session: session,
      id: 517154478,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2023-07/reports/517154478.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.July23, restResources}),
    );

    queueMockResponse(JSON.stringify({"report": {"id": 1016888664, "name": "A new app report", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -1m UNTIL today ORDER BY total_sales", "updated_at": "2024-01-02T09:03:04-05:00", "category": "custom_app_reports"}}));

    const report = new shopify.rest.Report({session: session});
    report.name = "A new app report";
    report.shopify_ql = "SHOW total_sales BY order_id FROM sales SINCE -1m UNTIL today ORDER BY total_sales";
    await report.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2023-07/reports.json',
      query: '',
      headers,
      data: { "report": {"name": "A new app report", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -1m UNTIL today ORDER BY total_sales"} }
    }).toMatchMadeHttpRequest();
  });

});
