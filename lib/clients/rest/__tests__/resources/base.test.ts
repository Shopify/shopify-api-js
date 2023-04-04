import {
  testConfig,
  queueMockResponse,
  queueMockResponses,
} from '../../../../__tests__/test-helper';
import {Session} from '../../../../session/session';
import {HttpResponseError} from '../../../../error';
import {PageInfo} from '../../../types';
import {ApiVersion, LATEST_API_VERSION} from '../../../../types';
import {shopifyApi, Shopify} from '../../../../index';

import {restResources} from './test-resources';

describe('Base REST resource', () => {
  let prefix: string;
  let shopify: Shopify<typeof restResources>;

  beforeEach(() => {
    shopify = shopifyApi({
      ...testConfig,
      restResources,
    });

    prefix = `/admin/api/${shopify.config.apiVersion}`;
  });

  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'access-token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'access-token';

  it('finds resource by id', async () => {
    const body = {fake_resource: {id: 1, attribute: 'attribute'}};
    queueMockResponse(JSON.stringify(body));

    const got = (await shopify.rest.FakeResource.find({id: 1, session}))!;

    expect([got.id, got.attribute]).toEqual([1, 'attribute']);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('finds resource with param', async () => {
    const body = {fake_resource: {id: 1, attribute: 'attribute'}};
    queueMockResponse(JSON.stringify(body));

    const got = (await shopify.rest.FakeResource.find({
      id: 1,
      session,
      param: 'value',
    }))!;

    expect([got.id, got.attribute]).toEqual([1, 'attribute']);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json?param=value`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('finds resource and children by id', async () => {
    const body = {
      fake_resource: {
        id: 1,
        attribute: 'attribute1',
        has_one_attribute: {id: 2, attribute: 'attribute2'},
        has_many_attribute: [{id: 3, attribute: 'attribute3'}],
      },
    };
    queueMockResponse(JSON.stringify(body));

    const got = (await shopify.rest.FakeResource.find({id: 1, session}))!;

    expect([got.id, got.attribute]).toEqual([1, 'attribute1']);

    expect(got.has_one_attribute!.constructor.name).toEqual('FakeResource');
    expect([
      got.has_one_attribute!.id,
      got.has_one_attribute!.attribute,
    ]).toEqual([2, 'attribute2']);

    expect(got.has_many_attribute![0].constructor.name).toEqual('FakeResource');
    expect([
      got.has_many_attribute![0].id,
      got.has_many_attribute![0].attribute,
    ]).toEqual([3, 'attribute3']);

    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('fails on finding nonexistent resource by id', async () => {
    const body = {errors: 'Not Found'};
    queueMockResponse(JSON.stringify(body), {
      statusCode: 404,
      statusText: 'Not Found',
      headers: {'X-Test-Header': 'value'},
    });

    const expectedError = await expect(
      shopify.rest.FakeResource.find({id: 1, session}),
    ).rejects;
    expectedError.toThrowError(HttpResponseError);
    expectedError.toMatchObject({
      response: {
        body: {errors: 'Not Found'},
        code: 404,
        statusText: 'Not Found',
        headers: {'X-Test-Header': ['value']},
      },
    });

    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('finds all resources', async () => {
    const body = {
      fake_resources: [
        {id: 1, attribute: 'attribute1'},
        {id: 2, attribute: 'attribute2'},
      ],
    };
    queueMockResponse(JSON.stringify(body));

    const got = (await shopify.rest.FakeResource.all({session})).data;

    expect([got[0].id, got[0].attribute]).toEqual([1, 'attribute1']);
    expect([got[1].id, got[1].attribute]).toEqual([2, 'attribute2']);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('saves', async () => {
    const expectedRequestBody = {fake_resource: {attribute: 'attribute'}};
    const responseBody = {fake_resource: {id: 1, attribute: 'attribute'}};
    queueMockResponse(JSON.stringify(responseBody));

    const resource = new shopify.rest.FakeResource({session});
    resource.attribute = 'attribute';
    await resource.save();

    expect(resource.id).toBeUndefined();
    expect({
      method: 'POST',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves and updates', async () => {
    const expectedRequestBody = {fake_resource: {attribute: 'attribute'}};
    const responseBody = {fake_resource: {id: 1, attribute: 'attribute'}};
    queueMockResponse(JSON.stringify(responseBody));

    const resource = new shopify.rest.FakeResource({session});
    resource.attribute = 'attribute';
    await resource.saveAndUpdate();

    expect(resource.id).toEqual(1);
    expect({
      method: 'POST',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves existing resource', async () => {
    const expectedRequestBody = {
      fake_resource: {id: 1, attribute: 'attribute'},
    };
    const responseBody = {fake_resource: {id: 1, attribute: 'attribute'}};
    queueMockResponse(JSON.stringify(responseBody));

    const resource = new shopify.rest.FakeResource({session});
    resource.id = 1;
    resource.attribute = 'attribute';
    await resource.save();

    expect(resource.id).toEqual(1);
    expect({
      method: 'PUT',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves with children', async () => {
    const expectedRequestBody = {
      fake_resource: {
        id: 1,
        attribute: 'attribute',
        has_one_attribute: {attribute: 'attribute1'},
        has_many_attribute: [
          {attribute: 'attribute2'},
          {attribute: 'attribute3'},
        ],
      },
    };
    queueMockResponse(JSON.stringify({}));

    const child1 = new shopify.rest.FakeResource({session});
    child1.attribute = 'attribute1';

    const child2 = new shopify.rest.FakeResource({session});
    child2.attribute = 'attribute2';

    const child3 = new shopify.rest.FakeResource({session});
    child3.attribute = 'attribute3';

    const resource = new shopify.rest.FakeResource({session});
    resource.id = 1;
    resource.attribute = 'attribute';
    resource.has_one_attribute = child1;
    resource.has_many_attribute = [child2, child3];

    await resource.save();

    expect({
      method: 'PUT',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('loads unknown attribute', async () => {
    const responseBody = {
      fake_resource: {attribute: 'attribute', 'unknown?': 'some-value'},
    };
    queueMockResponse(JSON.stringify(responseBody));

    const got = (await shopify.rest.FakeResource.find({id: 1, session}))!;

    expect(got.attribute).toEqual('attribute');
    expect(got['unknown?']).toEqual('some-value');
    expect(got.serialize()['unknown?']).toEqual('some-value');
  });

  it('saves with unknown attribute', async () => {
    const expectedRequestBody = {fake_resource: {unknown: 'some-value'}};
    queueMockResponse(JSON.stringify({}));

    const resource = new shopify.rest.FakeResource({session});
    resource.unknown = 'some-value';
    await resource.save();

    expect({
      method: 'POST',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('saves forced null attributes', async () => {
    const expectedRequestBody = {
      fake_resource: {id: 1, has_one_attribute: null},
    };
    queueMockResponse(JSON.stringify({}));

    const resource = new shopify.rest.FakeResource({session});
    resource.id = 1;
    resource.has_one_attribute = null;
    await resource.save();

    expect({
      method: 'PUT',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('ignores unsaveable attribute', async () => {
    const expectedRequestBody = {fake_resource: {attribute: 'attribute'}};
    const responseBody = {fake_resource: {id: 1, attribute: 'attribute'}};
    queueMockResponse(JSON.stringify(responseBody));

    const resource = new shopify.rest.FakeResource({session});
    resource.attribute = 'attribute';
    resource.unsaveable_attribute = 'unsaveable_attribute';
    await resource.save();

    expect(resource.id).toBeUndefined();
    expect({
      method: 'POST',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
      data: JSON.stringify(expectedRequestBody),
    }).toMatchMadeHttpRequest();
  });

  it('deletes existing resource', async () => {
    queueMockResponse(JSON.stringify({}));

    const resource = new shopify.rest.FakeResource({session});
    resource.id = 1;

    await resource.delete();

    expect({
      method: 'DELETE',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('deletes with other resource', async () => {
    queueMockResponse(JSON.stringify({}));

    const resource = new shopify.rest.FakeResource({session});
    resource.id = 1;
    resource.other_resource_id = 2;

    await resource.delete();

    expect({
      method: 'DELETE',
      domain,
      path: `${prefix}/other_resources/2/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('fails to delete nonexistent resource', async () => {
    const body = {errors: 'Not Found'};
    queueMockResponse(JSON.stringify(body), {
      statusCode: 404,
      statusText: 'Not Found',
    });

    const resource = new shopify.rest.FakeResource({session});
    resource.id = 1;

    await expect(resource.delete()).rejects.toThrowError(HttpResponseError);

    expect({
      method: 'DELETE',
      domain,
      path: `${prefix}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('makes custom request', async () => {
    const body = {fake_resource: {id: 1, attribute: 'attribute'}};
    queueMockResponse(JSON.stringify(body));

    const got = await shopify.rest.FakeResource.custom({
      session,
      id: 1,
      other_resource_id: 2,
    });

    expect(got).toEqual(body);
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/other_resources/2/fake_resources/1/custom.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('paginates requests', async () => {
    const previousUrl = `https://${domain}/admin/api/${shopify.config.apiVersion}/fake_resources.json?page_info=previousToken`;
    const nextUrl = `https://${domain}/admin/api/${shopify.config.apiVersion}/fake_resources.json?page_info=nextToken`;

    const body = {fake_resources: []};
    queueMockResponses(
      [JSON.stringify(body), {headers: {link: `<${nextUrl}>; rel="next"`}}],
      [
        JSON.stringify(body),
        {headers: {link: `<${previousUrl}>; rel="previous"`}},
      ],
      [JSON.stringify(body), {}],
    );

    const response1 = await shopify.rest.FakeResource.all({session});
    expect(response1.pageInfo?.nextPage).not.toBeUndefined();
    expect(response1.pageInfo?.prevPage).toBeUndefined();

    const response2 = await shopify.rest.FakeResource.all({
      ...response1.pageInfo?.nextPage?.query,
      session,
    });
    expect(response2.pageInfo?.nextPage).toBeUndefined();
    expect(response2.pageInfo?.prevPage).not.toBeUndefined();

    const response3 = await shopify.rest.FakeResource.all({
      ...response2.pageInfo?.prevPage?.query,
      session,
    });
    expect(response3.pageInfo?.nextPage).toBeUndefined();
    expect(response3.pageInfo?.prevPage).toBeUndefined();

    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json`,
      headers,
    }).toMatchMadeHttpRequest();
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json?page_info=nextToken`,
      headers,
    }).toMatchMadeHttpRequest();
    expect({
      method: 'GET',
      domain,
      path: `${prefix}/fake_resources.json?page_info=previousToken`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('allows pagination within a loop', async () => {
    const nextUrl = `https://${domain}/admin/api/${shopify.config.apiVersion}/fake_resources.json?page_info=nextToken`;

    const responseBodies = [
      JSON.stringify({fake_resources: [{id: 1}]}),
      JSON.stringify({fake_resources: [{id: 2}]}),
      JSON.stringify({fake_resources: [{id: 3}]}),
    ];

    queueMockResponses(
      [responseBodies[0], {headers: {link: `<${nextUrl}>; rel="next"`}}],
      [responseBodies[1], {headers: {link: `<${nextUrl}>; rel="next"`}}],
      [responseBodies[2], {}],
    );

    let pageInfo: PageInfo | undefined;
    let i = 0;
    do {
      const response = await shopify.rest.FakeResource.all({
        ...pageInfo?.nextPage?.query,
        session,
      });

      if (i < 2) {
        expect(response.headers.Link).toBeDefined();
      } else {
        expect(response.headers.Link).toBeUndefined();
      }
      expect(response.data[0].id).toEqual(i + 1);

      pageInfo = response.pageInfo;
      i++;
    } while (pageInfo?.nextPage);
  });

  it('allows custom prefixes', async () => {
    const body = {
      fake_resource_with_custom_prefix: {id: 1, attribute: 'attribute'},
    };
    queueMockResponse(JSON.stringify(body));

    const got = (await shopify.rest.FakeResourceWithCustomPrefix.find({
      id: 1,
      session,
    }))!;

    expect([got.id, got.attribute]).toEqual([1, 'attribute']);
    expect({
      method: 'GET',
      domain,
      path: `/admin/custom_prefix/fake_resource_with_custom_prefix/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });

  it('includes unsaveable attributes when default serialize called', async () => {
    const resource = new shopify.rest.FakeResource({session});
    resource.attribute = 'attribute';
    resource.unsaveable_attribute = 'unsaveable_attribute';

    const hash = resource.serialize();

    expect(hash).toHaveProperty('unsaveable_attribute', 'unsaveable_attribute');
    expect(hash).toHaveProperty('attribute', 'attribute');
  });

  it('excludes session attribute when default serialize called', async () => {
    const resource = new shopify.rest.FakeResource({session});
    const hash = resource.serialize();

    expect(hash).not.toHaveProperty('session');
    expect(hash).not.toHaveProperty('#session');
  });

  it('excludes unsaveable attributes when serialize called for saving', async () => {
    const resource = new shopify.rest.FakeResource({session});
    resource.attribute = 'attribute';
    resource.unsaveable_attribute = 'unsaveable_attribute';

    const hash = resource.serialize(true);

    expect(hash).not.toHaveProperty(
      'unsaveable_attribute',
      'unsaveable_attribute',
    );
    expect(hash).toHaveProperty('attribute', 'attribute');
  });

  it('excludes session attribute when serialize called for saving', async () => {
    const resource = new shopify.rest.FakeResource({session});
    const hash = resource.serialize(true);

    expect(hash).not.toHaveProperty('session');
    expect(hash).not.toHaveProperty('#session');
  });

  it('does not leak the session object', async () => {
    const resource = new shopify.rest.FakeResource({session});

    expect(Object.keys(resource)).not.toContain(['session', '#session']);
    expect(JSON.stringify(resource)).not.toMatch(/"[#]?session"/);
  });
});

describe('REST resources with a different API version', () => {
  const domain = 'test-shop.myshopify.io';
  const headers = {'X-Shopify-Access-Token': 'access-token'};
  const session = new Session({
    id: '1234',
    shop: domain,
    state: '1234',
    isOnline: true,
  });
  session.accessToken = 'access-token';

  it('can load class an run requests', async () => {
    const shopify = shopifyApi({
      ...testConfig,
      apiVersion: '2020-01' as any as ApiVersion,
      restResources,
    });

    // The shopify object is set to an older version, but the resources use the latest
    expect(shopify.rest.FakeResource.apiVersion).toBe(LATEST_API_VERSION);
    expect(shopify.config.apiVersion).not.toBe(LATEST_API_VERSION);

    queueMockResponses(
      [JSON.stringify({fake_resource: {attribute: 'attribute'}})],
      [JSON.stringify({fake_resource: {id: 1, attribute: 'attribute'}})],
      [JSON.stringify({fake_resource: {id: 1, attribute: 'attribute'}})],
      [JSON.stringify({})],
    );

    // POST
    const fakeResource = new shopify.rest.FakeResource({session});
    fakeResource.attribute = 'attribute';
    await fakeResource.save();
    expect(fakeResource!.attribute).toEqual('attribute');
    expect({
      method: 'POST',
      domain,
      path: `/admin/api/${LATEST_API_VERSION}/fake_resources.json`,
      headers,
      data: {fake_resource: {attribute: 'attribute'}},
    }).toMatchMadeHttpRequest();

    // GET
    const fakeResource2 = (await shopify.rest.FakeResource.find({
      id: 1,
      session,
    }))!;
    expect(fakeResource).not.toEqual(fakeResource2);
    expect(fakeResource2.id).toEqual(1);
    expect(fakeResource2.attribute).toEqual('attribute');
    expect({
      method: 'GET',
      domain,
      path: `/admin/api/${LATEST_API_VERSION}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();

    // PUT
    fakeResource2.attribute = 'attribute2';
    await fakeResource2.save();
    expect(fakeResource!.attribute).toEqual('attribute');
    expect({
      method: 'PUT',
      domain,
      path: `/admin/api/${LATEST_API_VERSION}/fake_resources/1.json`,
      headers,
      data: {fake_resource: {attribute: 'attribute2'}},
    }).toMatchMadeHttpRequest();

    // DELETE
    await fakeResource2.delete();
    expect({
      method: 'DELETE',
      domain,
      path: `/admin/api/${LATEST_API_VERSION}/fake_resources/1.json`,
      headers,
    }).toMatchMadeHttpRequest();
  });
});
