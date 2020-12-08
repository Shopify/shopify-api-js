import '../../../test/test_helper';

import { PageInfo, PageInfoParams } from '../page_info';
import { assertHttpRequest } from '../../test/test_helper';
import { RestRequestReturn } from '../rest_client';

const domain = 'test-shop.myshopify.io';
const successResponse = {
  products: [
    {
      title: 'Test title',
      amount: 10,
    }
  ]
};

describe("PageInfo", () => {
  it("can be serialized and de-serialized", () => {
    const params = getDefaultParams();
    const pageInfo = new PageInfo(params);

    const newInfo = PageInfo.deserialize(pageInfo.serialize());
    expect(newInfo).toEqual(pageInfo);
  });

  it("can trigger previous page request", async () => {
    const params = getDefaultParams();

    const pageInfo = new PageInfo(params);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(pageInfo.getPreviousPage('testToken')).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('GET', domain, `/admin/api/unstable/products.json?limit=10&fields=test1%2Ctest2&page_info=previousToken`);
  });

  it("can chain previous page requests until we run out of results", async () => {
    const params = getDefaultParams();

    let pageInfo = new PageInfo(params);

    const linkHeader = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
      `<https://${domain}/admin/api/unstable/products.json?limit=10&fields=test1,test2&page_info=>; rel="previous"`, // No token - will be ignored
      `Not a valid link - will be ignored`, // Invalid link - will be ignored
    ];

    // We make 3 successful requests for the previous page, but the last one only mentions the next page,
    // so the fourth request returns null right away because there are no more results.
    fetchMock.mockResponses(
      [JSON.stringify(successResponse), { headers: { 'link': linkHeader.join(', ') } }],
      [JSON.stringify(successResponse), { headers: { 'link': linkHeader.join(', ') } }],
      [JSON.stringify(successResponse), { headers: { 'link': `<${params.nextPageUrl}>; rel="next"` } }],
    );

    const checkPreviousPageRequest = (result: RestRequestReturn | null, pageInfo?: PageInfo): PageInfo => {
      expect(result).toEqual(buildExpectedResponse(successResponse, pageInfo));
      assertHttpRequest('GET', domain, `/admin/api/unstable/products.json?limit=10&fields=test1%2Ctest2&page_info=previousToken`);

      if (!result?.pageInfo) {
        throw "Expected page info object to be in the response after a request";
      }

      return result?.pageInfo;
    };

    let result = await pageInfo.getPreviousPage('testToken');
    pageInfo = checkPreviousPageRequest(result, pageInfo);

    result = await pageInfo.getPreviousPage('testToken');
    pageInfo = checkPreviousPageRequest(result, pageInfo);

    result = await pageInfo.getPreviousPage('testToken');
    pageInfo = checkPreviousPageRequest(result);

    // This will have all the info except the previous URL which wasn't present
    expect(result?.pageInfo).toEqual(new PageInfo({
      limit: params.limit,
      fields: params.fields,
      nextPageUrl: params.nextPageUrl,
    }));
    await expect(pageInfo.getPreviousPage('testToken')).resolves.toBeNull();
  });

  it("can trigger next page request", async () => {
    const params = getDefaultParams();

    const pageInfo = new PageInfo(params);

    fetchMock.mockResponseOnce(buildMockResponse(successResponse));

    await expect(pageInfo.getNextPage('testToken')).resolves.toEqual(buildExpectedResponse(successResponse));
    assertHttpRequest('GET', domain, `/admin/api/unstable/products.json?limit=10&fields=test1%2Ctest2&page_info=nextToken`);
  });

  it("can chain next page requests until we run out of results", async () => {
    const params = getDefaultParams();

    let pageInfo = new PageInfo(params);

    const linkHeader = [
      `<${params.previousPageUrl}>; rel="previous"`,
      `<${params.nextPageUrl}>; rel="next"`,
      `<https://${domain}/admin/api/unstable/products.json?limit=10&fields=test1,test2&page_info=>; rel="previous"`, // No token - will be ignored
      `Not a valid link - will be ignored`, // Invalid link - will be ignored
    ];

    // We make 3 successful requests for the next page, but the last one only mentions the previous page,
    // so the fourth request returns null right away because there are no more results.
    fetchMock.mockResponses(
      [JSON.stringify(successResponse), { headers: { 'link': linkHeader.join(', ') } }],
      [JSON.stringify(successResponse), { headers: { 'link': linkHeader.join(', ') } }],
      [JSON.stringify(successResponse), { headers: { 'link': `<${params.previousPageUrl}>; rel="previous"` } }],
    );

    const checkNextPageRequest = (result: RestRequestReturn | null, pageInfo?: PageInfo): PageInfo => {
      expect(result).toEqual(buildExpectedResponse(successResponse, pageInfo));
      assertHttpRequest('GET', domain, `/admin/api/unstable/products.json?limit=10&fields=test1%2Ctest2&page_info=nextToken`);

      if (!result?.pageInfo) {
        throw "Expected page info object to be in the response after a request";
      }

      return result?.pageInfo;
    };

    let result = await pageInfo.getNextPage('testToken');
    pageInfo = checkNextPageRequest(result, pageInfo);

    result = await pageInfo.getNextPage('testToken');
    pageInfo = checkNextPageRequest(result, pageInfo);

    result = await pageInfo.getNextPage('testToken');
    pageInfo = checkNextPageRequest(result);

    // This will have all the info except the next URL which wasn't present
    expect(result?.pageInfo).toEqual(new PageInfo({
      limit: params.limit,
      fields: params.fields,
      previousPageUrl: params.previousPageUrl,
    }));
    await expect(pageInfo.getNextPage('testToken')).resolves.toBeNull();
  });
});

function getDefaultParams(): PageInfoParams {
  const limit = 10;
  const fields = ['test1', 'test2'];
  const previousUrl = `https://${domain}/admin/api/unstable/products.json?limit=${limit}&fields=${fields.join(',')}&page_info=previousToken`;
  const nextUrl = `https://${domain}/admin/api/unstable/products.json?limit=${limit}&fields=${fields.join(',')}&page_info=nextToken`;

  return {
    limit: limit,
    fields: fields,
    previousPageUrl: previousUrl,
    nextPageUrl: nextUrl,
  };
}

function buildMockResponse(obj: unknown): string {
  return JSON.stringify(obj);
}

function buildExpectedResponse(obj: unknown, pageInfo?: PageInfo): RestRequestReturn {
  const expectedResponse: RestRequestReturn = {
    body: obj,
    headers: expect.objectContaining({}),
  };

  if (pageInfo) {
    expectedResponse.pageInfo = pageInfo;
  }

  return expect.objectContaining(expectedResponse);
}
