/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('OrderRisk resource', () => {
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
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"risk": {"id": 1029151490, "order_id": 450789469, "checkout_id": 901414060, "source": "External", "score": "1.0", "recommendation": "cancel", "display": true, "cause_cancel": true, "message": "This order came from an anonymous proxy", "merchant_message": "This order came from an anonymous proxy"}}));

    const order_risk = new shopify.rest.OrderRisk({session: session});
    order_risk.order_id = 450789469;
    order_risk.message = "This order came from an anonymous proxy";
    order_risk.recommendation = "cancel";
    order_risk.score = "1.0";
    order_risk.source = "External";
    order_risk.cause_cancel = true;
    order_risk.display = true;
    await order_risk.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/risks.json',
      query: '',
      headers,
      data: { "risk": {"message": "This order came from an anonymous proxy", "recommendation": "cancel", "score": "1.0", "source": "External", "cause_cancel": true, "display": true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"risks": [{"id": 284138680, "order_id": 450789469, "checkout_id": null, "source": "External", "score": "1.0", "recommendation": "cancel", "display": true, "cause_cancel": true, "message": "This order was placed from a proxy IP", "merchant_message": "This order was placed from a proxy IP"}, {"id": 1029151489, "order_id": 450789469, "checkout_id": 901414060, "source": "External", "score": "1.0", "recommendation": "cancel", "display": true, "cause_cancel": true, "message": "This order came from an anonymous proxy", "merchant_message": "This order came from an anonymous proxy"}]}));

    await shopify.rest.OrderRisk.all({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/risks.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"risk": {"id": 284138680, "order_id": 450789469, "checkout_id": null, "source": "External", "score": "1.0", "recommendation": "cancel", "display": true, "cause_cancel": true, "message": "This order was placed from a proxy IP", "merchant_message": "This order was placed from a proxy IP"}}));

    await shopify.rest.OrderRisk.find({
      session: session,
      order_id: 450789469,
      id: 284138680,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/risks/284138680.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"risk": {"order_id": 450789469, "cause_cancel": false, "message": "After further review, this is a legitimate order", "recommendation": "accept", "score": "0.0", "source": "External", "id": 284138680, "checkout_id": null, "display": true, "merchant_message": "After further review, this is a legitimate order"}}));

    const order_risk = new shopify.rest.OrderRisk({session: session});
    order_risk.order_id = 450789469;
    order_risk.id = 284138680;
    order_risk.message = "After further review, this is a legitimate order";
    order_risk.recommendation = "accept";
    order_risk.source = "External";
    order_risk.cause_cancel = false;
    order_risk.score = "0.0";
    await order_risk.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/orders/450789469/risks/284138680.json',
      query: '',
      headers,
      data: { "risk": {"message": "After further review, this is a legitimate order", "recommendation": "accept", "source": "External", "cause_cancel": false, "score": "0.0"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.OrderRisk.delete({
      session: session,
      order_id: 450789469,
      id: 284138680,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/orders/450789469/risks/284138680.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
