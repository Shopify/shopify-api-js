import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Variant} from '../../2021-07';

describe('Variant resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Variant.all({
      session: test_session,
      product_id: 632910392,
      since_id: "49148385",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants.json',
      query: 'since_id=49148385',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Variant.all({
      session: test_session,
      product_id: 632910392,
      presentment_currencies: "USD,CAD",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants.json',
      query: 'presentment_currencies=USD%2CCAD',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Variant.all({
      session: test_session,
      product_id: 632910392,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Variant.count({
      session: test_session,
      product_id: 632910392,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Variant.find({
      session: test_session,
      id: 808950810,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/variants/808950810.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const variant = new Variant({session: test_session});
    variant.id = 808950810;
    variant.option1 = "Not Pink";
    variant.price = "99.00";
    await variant.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/variants/808950810.json',
      query: '',
      headers,
      data: { "variant": {id: 808950810, option1: "Not Pink", price: "99.00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const variant = new Variant({session: test_session});
    variant.id = 808950810;
    variant.image_id = 562641783;
    await variant.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/variants/808950810.json',
      query: '',
      headers,
      data: { "variant": {id: 808950810, image_id: 562641783} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const variant = new Variant({session: test_session});
    variant.id = 808950810;
    variant.metafields = [
      {
        key: "new",
        value: "newvalue",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await variant.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/variants/808950810.json',
      query: '',
      headers,
      data: { "variant": {id: 808950810, metafields: [{key: "new", value: "newvalue", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const variant = new Variant({session: test_session});
    variant.product_id = 632910392;
    variant.option1 = "Yellow";
    variant.price = "1.00";
    await variant.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants.json',
      query: '',
      headers,
      data: { "variant": {option1: "Yellow", price: "1.00"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const variant = new Variant({session: test_session});
    variant.product_id = 632910392;
    variant.image_id = 850703190;
    variant.option1 = "Purple";
    await variant.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants.json',
      query: '',
      headers,
      data: { "variant": {image_id: 850703190, option1: "Purple"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const variant = new Variant({session: test_session});
    variant.product_id = 632910392;
    variant.option1 = "Blue";
    variant.metafields = [
      {
        key: "new",
        value: "newvalue",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await variant.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants.json',
      query: '',
      headers,
      data: { "variant": {option1: "Blue", metafields: [{key: "new", value: "newvalue", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Variant.delete({
      session: test_session,
      product_id: 632910392,
      id: 808950810,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/products/632910392/variants/808950810.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
