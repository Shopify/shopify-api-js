/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Report} from '../../2022-01';

describe('Report resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.January22;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"reports": [{"id": 752357116, "name": "Custom App Report 2", "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales", "updated_at": "2022-10-03T12:44:45-04:00", "category": "custom_app_reports"}, {"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}]}));

    await Report.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/reports.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"reports": [{"id": 752357116, "name": "Custom App Report 2", "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales", "updated_at": "2022-10-03T12:44:45-04:00", "category": "custom_app_reports"}, {"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}]}));

    await Report.all({
      session: test_session,
      updated_at_min: "2005-07-31 15:57:11 EDT -04:00",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/reports.json',
      query: 'updated_at_min=2005-07-31+15%3A57%3A11+EDT+-04%3A00',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"reports": [{"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}]}));

    await Report.all({
      session: test_session,
      ids: "517154478",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/reports.json',
      query: 'ids=517154478',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"reports": [{"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}, {"id": 752357116, "name": "Custom App Report 2", "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales", "updated_at": "2022-10-03T12:44:45-04:00", "category": "custom_app_reports"}]}));

    await Report.all({
      session: test_session,
      since_id: "123",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/reports.json',
      query: 'since_id=123',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"reports": [{"id": 752357116, "shopify_ql": "SHOW total_sales BY order_id FROM sales ORDER BY total_sales"}, {"id": 517154478, "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today"}]}));

    await Report.all({
      session: test_session,
      fields: "id,shopify_ql",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/reports.json',
      query: 'fields=id%2Cshopify_ql',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"report": {"id": 1016888664, "name": "A new app report", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -1m UNTIL today ORDER BY total_sales", "updated_at": "2022-10-03T12:53:33-04:00", "category": "custom_app_reports"}}));

    const report = new Report({session: test_session});
    report.name = "A new app report";
    report.shopify_ql = "SHOW total_sales BY order_id FROM sales SINCE -1m UNTIL today ORDER BY total_sales";
    await report.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-01/reports.json',
      query: '',
      headers,
      data: { "report": {"name": "A new app report", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -1m UNTIL today ORDER BY total_sales"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"report": {"id": 517154478, "name": "Wholesale Sales Report", "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today", "updated_at": "2017-04-10T16:33:22-04:00", "category": "custom_app_reports"}}));

    await Report.find({
      session: test_session,
      id: 517154478,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/reports/517154478.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"report": {"id": 517154478, "shopify_ql": "SHOW total_sales BY order_id FROM sales WHERE api_client_id == 123 SINCE -1m UNTIL today"}}));

    await Report.find({
      session: test_session,
      id: 517154478,
      fields: "id,shopify_ql",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-01/reports/517154478.json',
      query: 'fields=id%2Cshopify_ql',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({"report": {"name": "Changed Report Name", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -12m UNTIL today ORDER BY total_sales", "id": 517154478, "updated_at": "2022-10-03T12:53:27-04:00", "category": "custom_app_reports"}}));

    const report = new Report({session: test_session});
    report.id = 517154478;
    report.name = "Changed Report Name";
    report.shopify_ql = "SHOW total_sales BY order_id FROM sales SINCE -12m UNTIL today ORDER BY total_sales";
    await report.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-01/reports/517154478.json',
      query: '',
      headers,
      data: { "report": {"name": "Changed Report Name", "shopify_ql": "SHOW total_sales BY order_id FROM sales SINCE -12m UNTIL today ORDER BY total_sales"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Report.delete({
      session: test_session,
      id: 517154478,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-01/reports/517154478.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
