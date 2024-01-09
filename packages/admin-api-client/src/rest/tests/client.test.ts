import fetchMock from "jest-fetch-mock";

import {
  ACCESS_TOKEN_HEADER,
  CLIENT,
  DEFAULT_CLIENT_VERSION,
} from "../../constants";
import * as constants from "../../constants";
import { createAdminRestApiClient } from "../client";

const successResponse = JSON.stringify({
  message: "Your HTTP request was successful!",
});

interface AssertRequestOptions {
  request: Request;
}

describe("REST Admin API Client", () => {
  fetchMock.enableMocks();

  beforeEach(() => {
    // Change the default retry time to a very low value to speed things up
    (constants as any).DEFAULT_RETRY_WAIT_TIME = 10;
    fetchMock.mockResponse(() => Promise.resolve(successResponse));
  });

  afterEach(() => {
    fetchMock.resetMocks();
    jest.restoreAllMocks();
  });

  describe("createAdminRestApiClient()", () => {
    const config = {
      storeDomain: "https://test-store.myshopify.io",
      apiVersion: "2023-10",
      accessToken: "access-token",
    };

    function apiUrl(
      path: string,
      queryString?: string,
      version = config.apiVersion,
    ): string {
      return `${config.storeDomain}/admin/api/${version}${path}.json${
        queryString ? `?${queryString}` : ""
      }`;
    }

    const headers = new Headers({
      "Content-Type": "application/json",
      Accept: "application/json",
      [ACCESS_TOKEN_HEADER]: config.accessToken,
      "User-Agent": `${CLIENT} v${DEFAULT_CLIENT_VERSION}`,
    });

    afterEach(() => {
      jest.resetAllMocks();
      jest.restoreAllMocks();
    });

    it("can make GET request", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      // WHEN
      const response = await client.get("/url/path");

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("handles non-json, non-2xx response", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);
      fetchMock.mockResponseOnce("not a json object", {
        status: 404,
        statusText: "not found",
      });

      // WHEN
      const response = await client.get("/url/path");

      // THEN
      expect(response.ok).toBe(false);
      expect(await response.text()).toBe("not a json object");
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("can make POST request", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);
      const postData = {
        title: "Test product",
        amount: 10,
      };

      // WHEN
      const response = await client.post("/url/path", { data: postData });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "POST",
          headers,
          body: JSON.stringify(postData),
        }),
      });
    });

    it("can make POST request and data is already formatted", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);
      const postData = {
        title: "Test product",
        amount: 10,
      };

      // WHEN
      const response = await client.post("/url/path", {
        data: JSON.stringify(postData),
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "POST",
          headers,
          body: JSON.stringify(postData),
        }),
      });
    });

    it("can make POST request with zero-length JSON", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      // WHEN
      const response = await client.post("/url/path", {
        data: "",
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "POST",
          headers,
          body: "",
        }),
      });
    });

    it("can make POST request with GraphQL type", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      const graphqlQuery = `
        query {
          webhookSubscriptions(first:5) {
            edges {
              node {
                id
                endpoint
              }
            }
          }
        }
      `;
      const expectedHeaders = new Headers(headers);
      expectedHeaders.set("Content-Type", "application/graphql");

      // WHEN
      const response = await client.post("/url/path", {
        data: graphqlQuery,
        headers: { "Content-Type": "application/graphql" },
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "POST",
          headers: expectedHeaders,
          body: graphqlQuery,
        }),
      });
    });

    it("can make PUT request", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);
      const putData = {
        title: "Test product",
        amount: 10,
      };

      // WHEN
      const response = await client.put("/url/path", { data: putData });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "PUT",
          headers,
          body: JSON.stringify(putData),
        }),
      });
    });

    it("can make DELETE request", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      // WHEN
      const response = await client.delete("/url/path");

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "DELETE",
          headers,
        }),
      });
    });

    it("allows custom headers", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      const customHeaders = { "X-Not-A-Real-Header": "some_value" };
      const expectedHeaders = new Headers({
        ...Object.fromEntries(headers.entries()),
        ...customHeaders,
      });

      // WHEN
      const response = await client.get("/url/path", {
        headers: customHeaders,
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "GET",
          headers: expectedHeaders,
        }),
      });
    });

    it("extends User-Agent (uppercase) if it is provided", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      const customHeaders = { "User-Agent": "My agent" };
      const expectedHeaders = new Headers({
        ...Object.fromEntries(headers.entries()),
        "user-agent": `My agent | ${headers.get("User-Agent")}`,
      });

      // WHEN
      const response = await client.get("/url/path", {
        headers: customHeaders,
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "GET",
          headers: expectedHeaders,
        }),
      });
    });

    it("extends User-Agent (lowercase) if it is provided", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      const customHeaders = { "user-agent": "My agent" };
      const expectedHeaders = new Headers({
        ...Object.fromEntries(headers.entries()),
        "user-agent": `My agent | ${headers.get("User-Agent")}`,
      });

      // WHEN
      const response = await client.get("/url/path", {
        headers: customHeaders,
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "GET",
          headers: expectedHeaders,
        }),
      });
    });

    it("extends a User-Agent provided by config", async () => {
      // GIVEN
      const client = createAdminRestApiClient({
        ...config,
        userAgentPrefix: "Config Agent",
      });

      const expectedHeaders = new Headers({
        ...Object.fromEntries(headers.entries()),
        "user-agent": `Config Agent | ${headers.get("User-Agent")}`,
      });

      // WHEN
      const response = await client.get("/url/path");

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "GET",
          headers: expectedHeaders,
        }),
      });
    });

    it("extends a User-Agent provided by config and an extra header", async () => {
      // GIVEN
      const client = createAdminRestApiClient({
        ...config,
        userAgentPrefix: "Config Agent",
      });

      const customHeaders = { "user-agent": "My agent" };
      const expectedHeaders = new Headers({
        ...Object.fromEntries(headers.entries()),
        "user-agent": `My agent | Config Agent | ${headers.get("User-Agent")}`,
      });

      // WHEN
      const response = await client.get("/url/path", {
        headers: customHeaders,
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), {
          method: "GET",
          headers: expectedHeaders,
        }),
      });
    });

    it("fails with invalid retry count", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      // THEN
      await expect(client.get("/url/path", { retries: -1 })).rejects.toThrow();
    });

    it("retries failed requests but returns success", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      const mockResponses = [
        new Response("Something went wrong!", {
          status: 503,
          statusText: "Did not work",
        }),
        new Response("Something went wrong!", {
          status: 429,
          statusText: "Did not work",
        }),
        new Response(JSON.stringify(successResponse)),
      ];

      let count = 0;
      fetchMock.mockImplementation(() => {
        return Promise.resolve(mockResponses[count++]);
      });

      // WHEN
      const response = await client.get("/url/path", { retries: 2 });

      // THEN
      expect(response).toBe(mockResponses[2]);
      expect(fetch).toHaveBeenCalledTimes(3);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("retries failed requests and stops on non-retriable errors", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      const mockResponses = [
        new Response("Something went wrong!", {
          status: 503,
          statusText: "Did not work",
        }),
        new Response("Something went wrong!", {
          status: 403,
          statusText: "Did not work",
        }),
      ];

      let count = 0;
      fetchMock.mockImplementation(() => {
        return Promise.resolve(mockResponses[count++]);
      });

      // WHEN
      const response = await client.get("/url/path", { retries: 2 });

      // THEN
      expect(response).toBe(mockResponses[1]);
      expect(fetch).toHaveBeenCalledTimes(2);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("stops retrying after reaching the limit, and returns the last response", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);
      const errorResponse = new Response("Something went wrong!", {
        status: 503,
        statusText: "Did not work",
      });

      fetchMock.mockResolvedValue(errorResponse);

      // WHEN
      const response = await client.get("/url/path", { retries: 2 });

      // THEN
      expect(response.status).toBe(503);
      expect(fetch).toHaveBeenCalledTimes(3);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("throws after reaching the limit if all fetches were aborted", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      fetchMock.mockAbort();

      // WHEN
      await expect(client.get("/url/path", { retries: 2 })).rejects.toThrow();

      // THEN
      expect(fetch).toHaveBeenCalledTimes(3);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("waits for the amount of time defined by the Retry-After header", async () => {
      // Default to 10 seconds to ensure the test will timeout if this fails
      (constants as any).DEFAULT_RETRY_WAIT_TIME = 10000;

      // GIVEN
      const client = createAdminRestApiClient(config);

      const realWaitTime = 0.05;
      const errorResponse = new Response("Something went wrong!", {
        status: 503,
        statusText: "Did not work",
        headers: { "Retry-After": realWaitTime.toString() },
      });

      fetchMock.mockResolvedValue(errorResponse);

      // WHEN
      const response = await client.get("/url/path", { retries: 1 });

      // THEN
      expect(response.status).toBe(503);
      expect(fetch).toHaveBeenCalledTimes(2);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("adds missing slashes to paths", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      // WHEN
      const response = await client.get("url/path");

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(apiUrl("/url/path"), { method: "GET", headers }),
      });
    });

    it("properly formats arrays and hashes in query strings", async () => {
      // GIVEN
      const client = createAdminRestApiClient(config);

      // WHEN
      const response = await client.get("/url/path", {
        searchParams: { array: ["a", "b", "c"], hash: { a1: "b", a2: "d" } },
      });

      // THEN
      expect(response.ok).toBe(true);
      expect(await response.text()).toBe(successResponse);
      await assertRequest({
        request: new Request(
          apiUrl(
            "/url/path",
            encodeURI("array[]=a&array[]=b&array[]=c&hash[a1]=b&hash[a2]=d"),
          ),
          { method: "GET", headers },
        ),
      });
    });

    it("logs requests and responses when given a logger", async () => {
      // GIVEN
      const logger = jest.fn();
      const client = createAdminRestApiClient({ ...config, logger });

      // WHEN
      const response = await client.get("/url/path");

      // THEN
      expect(response.ok).toBe(true);

      expect(logger).toHaveBeenCalledTimes(1);

      const log = logger.mock.calls[0][0];

      expect(log.type).toBe("HTTP-Response");
      expect(log.content.response).toBe(response);
      expect(log.content.requestParams[0]).toEqual(apiUrl("/url/path"));
      expect(log.content.requestParams[1]).toMatchObject({
        method: "GET",
        headers: expect.anything(),
      });
    });

    it("logs retries and responses when given a logger", async () => {
      // GIVEN
      const logger = jest.fn();
      const client = createAdminRestApiClient({ ...config, logger });

      const retryResponse = new Response("Something went wrong!", {
        status: 429,
        statusText: "Did not work",
      });
      const mockResponses = [
        retryResponse,
        new Response(JSON.stringify(successResponse)),
      ];

      let count = 0;
      fetchMock.mockImplementation(() => {
        return Promise.resolve(mockResponses[count++]);
      });

      // WHEN
      const response = await client.get("/url/path", { retries: 1 });

      // THEN
      expect(response.ok).toBe(true);
      expect(logger).toHaveBeenCalledTimes(3);

      expect(logger).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ type: "HTTP-Response" }),
      );

      const log = logger.mock.calls[1][0];

      expect(log.type).toBe("HTTP-Retry");
      expect(log.content.lastResponse).toBe(retryResponse);
      expect(log.content.retryAttempt).toBe(1);
      expect(log.content.maxRetries).toBe(1);
      expect(log.content.requestParams[0]).toEqual(apiUrl("/url/path"));
      expect(log.content.requestParams[1]).toMatchObject({
        method: "GET",
        headers: expect.anything(),
      });

      expect(logger).toHaveBeenNthCalledWith(
        3,
        expect.objectContaining({ type: "HTTP-Response" }),
      );
    });
  });
});

async function assertRequest({ request }: AssertRequestOptions) {
  const mockParams: [any, any] = fetchMock.mock.calls[0];
  const mockRequest = new Request(...mockParams);

  const requestHeaders = Object.fromEntries(request.headers.entries());
  const mockHeaders = Object.fromEntries(mockRequest.headers.entries());

  expect(mockRequest.method).toEqual(request.method);
  expect(mockRequest.url).toEqual(request.url);
  expect(await mockRequest.text()).toEqual(await request.text());
  expect(mockHeaders).toMatchObject(requestHeaders);
}
