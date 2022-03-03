import {Session} from '../../../auth/session';
import {Context} from '../../../context';
import {ApiVersion} from '../../../base-types';

import {Product} from '../../2021-07';

describe('Product resource', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'this_is_a_test_token'};
  const test_session = new Session('1234', domain, '1234', true);
  test_session.accessToken = 'this_is_a_test_token';

  beforeEach(() => {
    Context.API_VERSION = ApiVersion.July21;
  });

  it('test_1', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.all({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_2', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.all({
      session: test_session,
      ids: "632910392,921728736",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: 'ids=632910392%2C921728736',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_3', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.all({
      session: test_session,
      fields: "id,images,title",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: 'fields=id%2Cimages%2Ctitle',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_4', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.all({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_5', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.all({
      session: test_session,
      since_id: "632910392",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: 'since_id=632910392',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_6', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.all({
      session: test_session,
      presentment_currencies: "USD",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: 'presentment_currencies=USD',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_7', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.tags = [
      "Barnes & Noble",
      "Big Air",
      "John's Fav"
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", tags: ["Barnes & Noble", "Big Air", "John's Fav"]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_8', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.published = false;
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", published: false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_9', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.status = "draft";
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", status: "draft"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_10', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.variants = [
      {
        option1: "First",
        price: "10.00",
        sku: "123"
      },
      {
        option1: "Second",
        price: "20.00",
        sku: "123"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", variants: [{option1: "First", price: "10.00", sku: "123"}, {option1: "Second", price: "20.00", sku: "123"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_11', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.variants = [
      {
        option1: "Blue",
        option2: "155"
      },
      {
        option1: "Black",
        option2: "159"
      }
    ];
    product.options = [
      {
        name: "Color",
        values: [
          "Blue",
          "Black"
        ]
      },
      {
        name: "Size",
        values: [
          "155",
          "159"
        ]
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", variants: [{option1: "Blue", option2: "155"}, {option1: "Black", option2: "159"}], options: [{name: "Color", values: ["Blue", "Black"]}, {name: "Size", values: ["155", "159"]}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_12', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.images = [
      {
        attachment: "R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\n"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", images: [{attachment: "R0lGODlhAQABAIAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==\n"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_13', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.images = [
      {
        src: "http://example.com/rails_logo.gif"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", images: [{src: "http://example.com/rails_logo.gif"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_14', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.metafields_global_title_tag = "Product SEO Title";
    product.metafields_global_description_tag = "Product SEO Description";
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", metafields_global_title_tag: "Product SEO Title", metafields_global_description_tag: "Product SEO Description"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_15', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.title = "Burton Custom Freestyle 151";
    product.body_html = "<strong>Good snowboard!</strong>";
    product.vendor = "Burton";
    product.product_type = "Snowboard";
    product.metafields = [
      {
        key: "new",
        value: "newvalue",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await product.save({});

    expect({
      method: 'POST',
      domain,
      path: '/admin/api/2021-07/products.json',
      query: '',
      headers,
      data: { "product": {title: "Burton Custom Freestyle 151", body_html: "<strong>Good snowboard!</strong>", vendor: "Burton", product_type: "Snowboard", metafields: [{key: "new", value: "newvalue", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_16', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.count({
      session: test_session,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/count.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_17', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.count({
      session: test_session,
      collection_id: "841564295",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/count.json',
      query: 'collection_id=841564295',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_18', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.find({
      session: test_session,
      id: 632910392,
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_19', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.find({
      session: test_session,
      id: 632910392,
      fields: "id,images,title",
    });

    expect({
      method: 'GET',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: 'fields=id%2Cimages%2Ctitle',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

  it('test_20', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.title = "New product title";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, title: "New product title"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_21', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.status = "draft";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, status: "draft"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_22', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.tags = "Barnes & Noble, John's Fav";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, tags: "Barnes & Noble, John's Fav"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_23', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.images = [];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, images: []} }
    }).toMatchMadeHttpRequest();
  });

  it('test_24', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.images = [
      {
        id: 850703190
      },
      {
        id: 562641783
      },
      {
        id: 378407906
      },
      {
        src: "http://example.com/rails_logo.gif"
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, images: [{id: 850703190}, {id: 562641783}, {id: 378407906}, {src: "http://example.com/rails_logo.gif"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_25', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.images = [
      {
        id: 850703190,
        position: 3
      },
      {
        id: 562641783,
        position: 2
      },
      {
        id: 378407906,
        position: 1
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, images: [{id: 850703190, position: 3}, {id: 562641783, position: 2}, {id: 378407906, position: 1}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_26', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.variants = [
      {
        id: 457924702
      },
      {
        id: 39072856
      },
      {
        id: 49148385
      },
      {
        id: 808950810
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, variants: [{id: 457924702}, {id: 39072856}, {id: 49148385}, {id: 808950810}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_27', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.title = "Updated Product Title";
    product.variants = [
      {
        id: 808950810,
        price: "2000.00",
        sku: "Updating the Product SKU"
      },
      {
        id: 49148385
      },
      {
        id: 39072856
      },
      {
        id: 457924702
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, title: "Updated Product Title", variants: [{id: 808950810, price: "2000.00", sku: "Updating the Product SKU"}, {id: 49148385}, {id: 39072856}, {id: 457924702}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_28', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.metafields_global_title_tag = "Brand new title";
    product.metafields_global_description_tag = "Brand new description";
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, metafields_global_title_tag: "Brand new title", metafields_global_description_tag: "Brand new description"} }
    }).toMatchMadeHttpRequest();
  });

  it('test_29', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.published = true;
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, published: true} }
    }).toMatchMadeHttpRequest();
  });

  it('test_30', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.published = false;
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, published: false} }
    }).toMatchMadeHttpRequest();
  });

  it('test_31', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    const product = new Product({session: test_session});
    product.id = 632910392;
    product.metafields = [
      {
        key: "new",
        value: "newvalue",
        type: "single_line_text_field",
        namespace: "global"
      }
    ];
    await product.save({});

    expect({
      method: 'PUT',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: { "product": {id: 632910392, metafields: [{key: "new", value: "newvalue", type: "single_line_text_field", namespace: "global"}]} }
    }).toMatchMadeHttpRequest();
  });

  it('test_32', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}));

    await Product.delete({
      session: test_session,
      id: 632910392,
    });

    expect({
      method: 'DELETE',
      domain,
      path: '/admin/api/2021-07/products/632910392.json',
      query: '',
      headers,
      data: null
    }).toMatchMadeHttpRequest();
  });

});
