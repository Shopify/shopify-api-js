/***********************************************************************************************************************
* This file is auto-generated. If you have an issue, please create a GitHub issue.                                     *
***********************************************************************************************************************/

import {Session} from '../../../../lib/session/session';
import {queueMockResponse} from '../../../../lib/__tests__/test-helper';
import {testConfig} from '../../../../lib/__tests__/test-config';
import {ApiVersion} from '../../../../lib/types';
import {shopifyApi} from '../../../../lib';

import {restResources} from '../../2022-10';

describe('Metafield resource', () => {
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

    queueMockResponse(JSON.stringify({"metafields": []}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "382285388", "owner_resource": "blog"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=382285388&metafield%5Bowner_resource%5D=blog',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 519046726, "namespace": "notes", "key": "descriptionription", "value": "Collection description", "description": "Custom Collection notes", "owner_id": 482865238, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "collection", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/519046726"}, {"id": 624849518, "namespace": "global", "key": "description_tag", "value": "Some seo description value", "description": null, "owner_id": 482865238, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "collection", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/624849518"}, {"id": 1010236510, "namespace": "global", "key": "title_tag", "value": "Some seo title value", "description": null, "owner_id": 482865238, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "collection", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1010236510"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "482865238", "owner_resource": "collection"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=482865238&metafield%5Bowner_resource%5D=collection',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 220591908, "namespace": "discounts", "key": "returning_customer", "value": "no", "description": "Customer deserves discount", "owner_id": 207119551, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "customer", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/220591908"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "207119551", "owner_resource": "customer"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=207119551&metafield%5Bowner_resource%5D=customer',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 106172460, "namespace": "notes", "key": "note", "value": "B flat", "description": "This is for notes", "owner_id": 622762746, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "draft_order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/106172460"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "622762746", "owner_resource": "draft_order"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=622762746&metafield%5Bowner_resource%5D=draft_order',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 290519330, "namespace": "translation", "key": "title_fr", "value": "Le TOS", "description": "Page French title translation", "owner_id": 131092082, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "page", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/290519330"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "131092082", "owner_resource": "page"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=131092082&metafield%5Bowner_resource%5D=page',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 51714266, "namespace": "my_namespace", "key": "my_key", "value": "Hello", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/51714266"}, {"id": 116539875, "namespace": "descriptors", "key": "subtitle", "value": "The best ipod", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/116539875"}, {"id": 263497237, "namespace": "installments", "key": "disable", "value": true, "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "boolean", "admin_graphql_api_id": "gid://shopify/Metafield/263497237"}, {"id": 273160493, "namespace": "facts", "key": "isbn", "value": "978-0-14-004259-7", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/273160493"}, {"id": 524118066, "namespace": "facts", "key": "ean", "value": "0123456789012", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/524118066"}, {"id": 543636738, "namespace": "reviews", "key": "rating_count", "value": 1, "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "number_integer", "admin_graphql_api_id": "gid://shopify/Metafield/543636738"}, {"id": 572384404, "namespace": "reviews", "key": "rating", "value": "{\"value\": \"3.5\", \"scale_min\": \"1.0\", \"scale_max\": \"5.0\"}", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "rating", "admin_graphql_api_id": "gid://shopify/Metafield/572384404"}, {"id": 613330208, "namespace": "shopify_filter", "key": "display", "value": "retina", "description": "This field keeps track of the type of display", "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/613330208"}, {"id": 779326701, "namespace": "facts", "key": "upc", "value": "012345678901", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/779326701"}, {"id": 845366454, "namespace": "translations", "key": "title_fr", "value": "produit", "description": "French product title", "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/845366454"}, {"id": 861799889, "namespace": "my_other_fields", "key": "organic", "value": true, "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "boolean", "admin_graphql_api_id": "gid://shopify/Metafield/861799889"}, {"id": 870326793, "namespace": "descriptors", "key": "care_guide", "value": "Wash in cold water", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": null, "admin_graphql_api_id": "gid://shopify/Metafield/870326793"}, {"id": 908250163, "namespace": "my_other_fields", "key": "shipping_policy", "value": "Ships for free in Canada", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "multi_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/908250163"}, {"id": 925288667, "namespace": "my_other_fields", "key": "year_released", "value": 2019, "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "number_integer", "admin_graphql_api_id": "gid://shopify/Metafield/925288667"}, {"id": 1001077698, "namespace": "my_fields", "key": "best_for", "value": "travel", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1001077698"}, {"id": 1029402048, "namespace": "my_other_fields", "key": "ingredients", "value": "[\"apple\", \"music\", \"u2\"]", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "list.single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1029402048"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "632910392", "owner_resource": "product"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=632910392&metafield%5Bowner_resource%5D=product',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 625663657, "namespace": "translation", "key": "title_fr", "value": "tbn", "description": "French product image title", "owner_id": 850703190, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product_image", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/625663657"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "850703190", "owner_resource": "product_image"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=850703190&metafield%5Bowner_resource%5D=product_image',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": []}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "49148385", "owner_resource": "variants"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=49148385&metafield%5Bowner_resource%5D=variants',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": []}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "674387490", "owner_resource": "article"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=674387490&metafield%5Bowner_resource%5D=article',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 915396079, "namespace": "notes", "key": "buyer", "value": "Notes about this buyer", "description": "This field is for buyer notes", "owner_id": 450789469, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/915396079"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": "450789469", "owner_resource": "order"},
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'metafield%5Bowner_id%5D=450789469&metafield%5Bowner_resource%5D=order',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 721389482, "namespace": "affiliates", "key": "app_key", "value": "app_key", "description": null, "owner_id": 548380009, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "shop", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/721389482"}]}));

    await shopify.rest.Metafield.all({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafields": [{"id": 1069228986, "namespace": "my_fields", "key": "my_items", "value": "{\"items\":[\"some item\"]}", "description": null, "owner_id": 548380009, "created_at": "2023-10-03T13:26:58-04:00", "updated_at": "2023-10-03T13:26:58-04:00", "owner_resource": "shop", "type": "json", "admin_graphql_api_id": "gid://shopify/Metafield/1069228986"}]}));

    await shopify.rest.Metafield.all({
      session: session,
      since_id: "721389482",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: 'since_id=721389482',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228982, "namespace": "my_fields", "key": "sponsor", "value": "Shopify", "description": null, "owner_id": 382285388, "created_at": "2023-10-03T13:26:53-04:00", "updated_at": "2023-10-03T13:26:53-04:00", "owner_resource": "blog", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228982"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.blog_id = 382285388;
    metafield.namespace = "my_fields";
    metafield.key = "sponsor";
    metafield.type = "single_line_text_field";
    metafield.value = "Shopify";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/blogs/382285388/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "sponsor", "type": "single_line_text_field", "value": "Shopify"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228983, "namespace": "my_fields", "key": "discount", "value": "25%", "description": null, "owner_id": 482865238, "created_at": "2023-10-03T13:26:55-04:00", "updated_at": "2023-10-03T13:26:55-04:00", "owner_resource": "collection", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228983"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.collection_id = 482865238;
    metafield.namespace = "my_fields";
    metafield.key = "discount";
    metafield.type = "single_line_text_field";
    metafield.value = "25%";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/collections/482865238/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "discount", "type": "single_line_text_field", "value": "25%"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228958, "namespace": "discounts", "key": "special", "value": "yes", "description": null, "owner_id": 207119551, "created_at": "2023-10-03T13:25:58-04:00", "updated_at": "2023-10-03T13:25:58-04:00", "owner_resource": "customer", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228958"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.customer_id = 207119551;
    metafield.namespace = "discounts";
    metafield.key = "special";
    metafield.value = "yes";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/customers/207119551/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "discounts", "key": "special", "value": "yes", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_16', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228985, "namespace": "my_fields", "key": "purchase_order", "value": "97453", "description": null, "owner_id": 622762746, "created_at": "2023-10-03T13:26:58-04:00", "updated_at": "2023-10-03T13:26:58-04:00", "owner_resource": "draft_order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228985"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.draft_order_id = 622762746;
    metafield.namespace = "my_fields";
    metafield.key = "purchase_order";
    metafield.type = "single_line_text_field";
    metafield.value = "97453";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/draft_orders/622762746/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "purchase_order", "type": "single_line_text_field", "value": "97453"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_17', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069229002, "namespace": "my_fields", "key": "subtitle", "value": "A subtitle for my page", "description": null, "owner_id": 131092082, "created_at": "2023-10-03T13:27:34-04:00", "updated_at": "2023-10-03T13:27:34-04:00", "owner_resource": "page", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069229002"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.page_id = 131092082;
    metafield.namespace = "my_fields";
    metafield.key = "subtitle";
    metafield.type = "single_line_text_field";
    metafield.value = "A subtitle for my page";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/pages/131092082/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "subtitle", "type": "single_line_text_field", "value": "A subtitle for my page"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_18', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228963, "namespace": "inventory", "key": "warehouse", "value": 25, "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:26:08-04:00", "updated_at": "2023-10-03T13:26:08-04:00", "owner_resource": "product", "type": "number_integer", "admin_graphql_api_id": "gid://shopify/Metafield/1069228963"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.product_id = 632910392;
    metafield.namespace = "inventory";
    metafield.key = "warehouse";
    metafield.value = 25;
    metafield.type = "number_integer";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/products/632910392/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "inventory", "key": "warehouse", "value": 25, "type": "number_integer"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228990, "namespace": "translation", "key": "title_spanish", "value": "botas", "description": null, "owner_id": 850703190, "created_at": "2023-10-03T13:27:07-04:00", "updated_at": "2023-10-03T13:27:07-04:00", "owner_resource": "product_image", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228990"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.product_image_id = 850703190;
    metafield.namespace = "translation";
    metafield.key = "title_spanish";
    metafield.type = "single_line_text_field";
    metafield.value = "botas";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/product_images/850703190/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "translation", "key": "title_spanish", "type": "single_line_text_field", "value": "botas"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_20', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228994, "namespace": "my_fields", "key": "liner_material", "value": "synthetic leather", "description": null, "owner_id": 49148385, "created_at": "2023-10-03T13:27:16-04:00", "updated_at": "2023-10-03T13:27:16-04:00", "owner_resource": "variant", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228994"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.variant_id = 49148385;
    metafield.namespace = "my_fields";
    metafield.key = "liner_material";
    metafield.type = "single_line_text_field";
    metafield.value = "synthetic leather";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/variants/49148385/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "liner_material", "type": "single_line_text_field", "value": "synthetic leather"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_21', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228973, "namespace": "my_fields", "key": "category", "value": "outdoors", "description": null, "owner_id": 674387490, "created_at": "2023-10-03T13:26:36-04:00", "updated_at": "2023-10-03T13:26:36-04:00", "owner_resource": "article", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228973"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.article_id = 674387490;
    metafield.namespace = "my_fields";
    metafield.key = "category";
    metafield.type = "single_line_text_field";
    metafield.value = "outdoors";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/articles/674387490/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "category", "type": "single_line_text_field", "value": "outdoors"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_22', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069228968, "namespace": "my_fields", "key": "purchase_order", "value": "123", "description": null, "owner_id": 450789469, "created_at": "2023-10-03T13:26:22-04:00", "updated_at": "2023-10-03T13:26:22-04:00", "owner_resource": "order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1069228968"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.order_id = 450789469;
    metafield.namespace = "my_fields";
    metafield.key = "purchase_order";
    metafield.type = "single_line_text_field";
    metafield.value = "123";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/orders/450789469/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "purchase_order", "type": "single_line_text_field", "value": "123"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_23', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1069229003, "namespace": "my_fields", "key": "my_items", "value": "{\"items\":[\"some item\"]}", "description": null, "owner_id": 548380009, "created_at": "2023-10-03T13:27:35-04:00", "updated_at": "2023-10-03T13:27:35-04:00", "owner_resource": "shop", "type": "json", "admin_graphql_api_id": "gid://shopify/Metafield/1069229003"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.namespace = "my_fields";
    metafield.key = "my_items";
    metafield.value = "{\"items\":[\"some item\"]}";
    metafield.type = "json";
    await metafield.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2022-10/metafields.json',
      query: '',
      headers,
      data: { "metafield": {"namespace": "my_fields", "key": "my_items", "value": "{\"items\":[\"some item\"]}", "type": "json"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_24', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 0}));

    await shopify.rest.Metafield.count({
      session: session,
      blog_id: 382285388,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/blogs/382285388/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_25', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 3}));

    await shopify.rest.Metafield.count({
      session: session,
      collection_id: 482865238,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/collections/482865238/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_26', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Metafield.count({
      session: session,
      customer_id: 207119551,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/customers/207119551/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_27', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Metafield.count({
      session: session,
      draft_order_id: 622762746,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/draft_orders/622762746/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_28', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Metafield.count({
      session: session,
      page_id: 131092082,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/pages/131092082/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_29', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 16}));

    await shopify.rest.Metafield.count({
      session: session,
      product_id: 632910392,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/products/632910392/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_30', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Metafield.count({
      session: session,
      product_image_id: 850703190,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/product_images/850703190/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_31', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 0}));

    await shopify.rest.Metafield.count({
      session: session,
      variant_id: 49148385,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/variants/49148385/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_32', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 0}));

    await shopify.rest.Metafield.count({
      session: session,
      article_id: 674387490,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/articles/674387490/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_33', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Metafield.count({
      session: session,
      order_id: 450789469,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_34', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"count": 1}));

    await shopify.rest.Metafield.count({
      session: session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields/count.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_35', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 534526895, "namespace": "translation", "key": "title_fr", "value": "Le iPod", "description": "Blog French title translation", "owner_id": 241253187, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "blog", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/534526895"}}));

    await shopify.rest.Metafield.find({
      session: session,
      blog_id: 382285388,
      id: 534526895,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/blogs/382285388/metafields/534526895.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_36', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1010236510, "namespace": "global", "key": "title_tag", "value": "Some seo title value", "description": null, "owner_id": 482865238, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "collection", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1010236510"}}));

    await shopify.rest.Metafield.find({
      session: session,
      collection_id: 482865238,
      id: 1010236510,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/collections/482865238/metafields/1010236510.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_37', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 220591908, "namespace": "discounts", "key": "returning_customer", "value": "no", "description": "Customer deserves discount", "owner_id": 207119551, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "customer", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/220591908"}}));

    await shopify.rest.Metafield.find({
      session: session,
      customer_id: 207119551,
      id: 220591908,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/customers/207119551/metafields/220591908.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_38', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 106172460, "namespace": "notes", "key": "note", "value": "B flat", "description": "This is for notes", "owner_id": 622762746, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "draft_order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/106172460"}}));

    await shopify.rest.Metafield.find({
      session: session,
      draft_order_id: 622762746,
      id: 106172460,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/draft_orders/622762746/metafields/106172460.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_39', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 290519330, "namespace": "translation", "key": "title_fr", "value": "Le TOS", "description": "Page French title translation", "owner_id": 131092082, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "page", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/290519330"}}));

    await shopify.rest.Metafield.find({
      session: session,
      page_id: 131092082,
      id: 290519330,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/pages/131092082/metafields/290519330.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_40', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 1001077698, "namespace": "my_fields", "key": "best_for", "value": "travel", "description": null, "owner_id": 632910392, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1001077698"}}));

    await shopify.rest.Metafield.find({
      session: session,
      product_id: 632910392,
      id: 1001077698,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/products/632910392/metafields/1001077698.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_41', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 625663657, "namespace": "translation", "key": "title_fr", "value": "tbn", "description": "French product image title", "owner_id": 850703190, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "product_image", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/625663657"}}));

    await shopify.rest.Metafield.find({
      session: session,
      product_image_id: 850703190,
      id: 625663657,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/product_images/850703190/metafields/625663657.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_42', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 323119633, "namespace": "my_fields", "key": "color", "value": "Pink", "description": null, "owner_id": 808950810, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "variant", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/323119633"}}));

    await shopify.rest.Metafield.find({
      session: session,
      variant_id: 49148385,
      id: 323119633,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/variants/49148385/metafields/323119633.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_43', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 838981074, "namespace": "translation", "key": "title_fr", "value": "Le Article", "description": "Article French title translation", "owner_id": 134645308, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "article", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/838981074"}}));

    await shopify.rest.Metafield.find({
      session: session,
      article_id: 674387490,
      id: 838981074,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/articles/674387490/metafields/838981074.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_44', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 915396079, "namespace": "notes", "key": "buyer", "value": "Notes about this buyer", "description": "This field is for buyer notes", "owner_id": 450789469, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/915396079"}}));

    await shopify.rest.Metafield.find({
      session: session,
      order_id: 450789469,
      id: 915396079,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/orders/450789469/metafields/915396079.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_45', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"id": 721389482, "namespace": "affiliates", "key": "app_key", "value": "app_key", "description": null, "owner_id": 548380009, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:19:52-04:00", "owner_resource": "shop", "type": "string", "admin_graphql_api_id": "gid://shopify/Metafield/721389482"}}));

    await shopify.rest.Metafield.find({
      session: session,
      id: 721389482,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2022-10/metafields/721389482.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_46', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "a translated blog title", "owner_id": 241253187, "namespace": "translation", "key": "title_fr", "id": 534526895, "description": "Blog French title translation", "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:26:08-04:00", "owner_resource": "blog", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/534526895"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.blog_id = 382285388;
    metafield.id = 534526895;
    metafield.value = "a translated blog title";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/blogs/382285388/metafields/534526895.json',
      query: '',
      headers,
      data: { "metafield": {"value": "a translated blog title", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_47', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "seo title", "owner_id": 482865238, "namespace": "global", "key": "title_tag", "id": 1010236510, "description": null, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:26:15-04:00", "owner_resource": "collection", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1010236510"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.collection_id = 482865238;
    metafield.id = 1010236510;
    metafield.value = "seo title";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/collections/482865238/metafields/1010236510.json',
      query: '',
      headers,
      data: { "metafield": {"value": "seo title", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_48', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "yes", "owner_id": 207119551, "namespace": "discounts", "key": "returning_customer", "id": 220591908, "description": "Customer deserves discount", "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:25:53-04:00", "owner_resource": "customer", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/220591908"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.customer_id = 207119551;
    metafield.id = 220591908;
    metafield.value = "yes";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/customers/207119551/metafields/220591908.json',
      query: '',
      headers,
      data: { "metafield": {"value": "yes", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_49', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "110000", "owner_id": 622762746, "namespace": "notes", "key": "note", "id": 106172460, "description": "This is for notes", "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:26:05-04:00", "owner_resource": "draft_order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/106172460"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.draft_order_id = 622762746;
    metafield.id = 106172460;
    metafield.value = "110000";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/draft_orders/622762746/metafields/106172460.json',
      query: '',
      headers,
      data: { "metafield": {"value": "110000", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_50', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "An updated translation", "owner_id": 131092082, "namespace": "translation", "key": "title_fr", "id": 290519330, "description": "Page French title translation", "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:26:07-04:00", "owner_resource": "page", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/290519330"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.page_id = 131092082;
    metafield.id = 290519330;
    metafield.value = "An updated translation";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/pages/131092082/metafields/290519330.json',
      query: '',
      headers,
      data: { "metafield": {"value": "An updated translation", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_51', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "having fun", "owner_id": 632910392, "namespace": "my_fields", "key": "best_for", "id": 1001077698, "description": null, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:27:19-04:00", "owner_resource": "product", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/1001077698"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.product_id = 632910392;
    metafield.id = 1001077698;
    metafield.value = "having fun";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/products/632910392/metafields/1001077698.json',
      query: '',
      headers,
      data: { "metafield": {"value": "having fun", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_52', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "translated description", "owner_id": 850703190, "namespace": "translation", "key": "title_fr", "id": 625663657, "description": "French product image title", "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:26:54-04:00", "owner_resource": "product_image", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/625663657"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.product_image_id = 850703190;
    metafield.id = 625663657;
    metafield.value = "translated description";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/product_images/850703190/metafields/625663657.json',
      query: '',
      headers,
      data: { "metafield": {"value": "translated description", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_53', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "Red", "owner_id": 808950810, "namespace": "my_fields", "key": "color", "id": 323119633, "description": null, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:27:31-04:00", "owner_resource": "variant", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/323119633"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.variant_id = 49148385;
    metafield.id = 323119633;
    metafield.value = "Red";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/variants/49148385/metafields/323119633.json',
      query: '',
      headers,
      data: { "metafield": {"value": "Red", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_54', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "[\"something new\"]", "owner_id": 548380009, "namespace": "affiliates", "key": "app_key", "id": 721389482, "description": null, "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:27:06-04:00", "owner_resource": "shop", "type": "list.single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/721389482"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.id = 721389482;
    metafield.value = "[\"something new\"]";
    metafield.type = "list.single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/metafields/721389482.json',
      query: '',
      headers,
      data: { "metafield": {"value": "[\"something new\"]", "type": "list.single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_55', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "a translated title", "owner_id": 134645308, "namespace": "translation", "key": "title_fr", "id": 838981074, "description": "Article French title translation", "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:25:57-04:00", "owner_resource": "article", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/838981074"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.article_id = 674387490;
    metafield.id = 838981074;
    metafield.value = "a translated title";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/articles/674387490/metafields/838981074.json',
      query: '',
      headers,
      data: { "metafield": {"value": "a translated title", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_56', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({"metafield": {"value": "Provided a discount code", "owner_id": 450789469, "namespace": "notes", "key": "buyer", "id": 915396079, "description": "This field is for buyer notes", "created_at": "2023-10-03T13:19:52-04:00", "updated_at": "2023-10-03T13:27:33-04:00", "owner_resource": "order", "type": "single_line_text_field", "admin_graphql_api_id": "gid://shopify/Metafield/915396079"}}));

    const metafield = new shopify.rest.Metafield({session: session});
    metafield.order_id = 450789469;
    metafield.id = 915396079;
    metafield.value = "Provided a discount code";
    metafield.type = "single_line_text_field";
    await metafield.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2022-10/orders/450789469/metafields/915396079.json',
      query: '',
      headers,
      data: { "metafield": {"value": "Provided a discount code", "type": "single_line_text_field"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_57', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      blog_id: 382285388,
      id: 534526895,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/blogs/382285388/metafields/534526895.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_58', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      collection_id: 482865238,
      id: 1010236510,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/collections/482865238/metafields/1010236510.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_59', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      customer_id: 207119551,
      id: 220591908,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/customers/207119551/metafields/220591908.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_60', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      draft_order_id: 622762746,
      id: 106172460,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/draft_orders/622762746/metafields/106172460.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_61', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      page_id: 131092082,
      id: 290519330,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/pages/131092082/metafields/290519330.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_62', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      product_id: 632910392,
      id: 1001077698,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/products/632910392/metafields/1001077698.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_63', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      product_image_id: 850703190,
      id: 625663657,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/product_images/850703190/metafields/625663657.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_64', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      variant_id: 49148385,
      id: 323119633,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/variants/49148385/metafields/323119633.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_65', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      article_id: 674387490,
      id: 838981074,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/articles/674387490/metafields/838981074.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_66', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      order_id: 450789469,
      id: 915396079,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/orders/450789469/metafields/915396079.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

  it('test_67', async () => {
    const shopify = shopifyApi(
      testConfig({apiVersion: ApiVersion.October22, restResources}),
    );

    queueMockResponse(JSON.stringify({}));

    await shopify.rest.Metafield.delete({
      session: session,
      id: 721389482,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2022-10/metafields/721389482.json',
      query: '',
      headers,
      data: undefined
    }).toMatchMadeHttpRequest();
  });

});
