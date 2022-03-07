import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {PaymentGateway} from '../../2021-10';

describe('PaymentGateway resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.October21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PaymentGateway.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/payment_gateways.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PaymentGateway.all({
      session: test_session,
      disabled: "false",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/payment_gateways.json',
      query: 'disabled=false',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const payment_gateway = new PaymentGateway({session: test_session});
    payment_gateway.credential1 = "someone@example.com";
    payment_gateway.provider_id = 7;
    await payment_gateway.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-10/payment_gateways.json',
      query: '',
      headers,
      data: { "payment_gateway": {credential1: "someone@example.com", provider_id: 7} }
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PaymentGateway.find({
      session: test_session,
      id: 431363653,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-10/payment_gateways/431363653.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const payment_gateway = new PaymentGateway({session: test_session});
    payment_gateway.id = 170508070;
    payment_gateway.sandbox = true;
    await payment_gateway.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-10/payment_gateways/170508070.json',
      query: '',
      headers,
      data: { "payment_gateway": {id: 170508070, sandbox: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await PaymentGateway.delete({
      session: test_session,
      id: 170508070,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-10/payment_gateways/170508070.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
