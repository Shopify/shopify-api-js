import fetchMock from "jest-fetch-mock";

import { clientConfig, getValidClient } from "./fixtures";

describe("GraphQL Client", () => {
  fetchMock.enableMocks();

  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation(jest.fn((resolve) => resolve() as any));
    fetchMock.mockResponse(() => Promise.resolve(JSON.stringify({ data: {} })));
  });

  afterEach(() => {
    fetchMock.resetMocks();
    jest.restoreAllMocks();
  });

  describe("createGraphQLClient()", () => {
    describe("client initialization", () => {
      it("returns a client object that contains a config object and request, requestStream and fetch functions", () => {
        const client = getValidClient();
        expect(client).toHaveProperty("config");
        expect(client).toMatchObject({
          fetch: expect.any(Function),
          request: expect.any(Function),
          requestStream: expect.any(Function),
        });
      });

      it("throws an error when the retries config value is less than 0", () => {
        const retries = -1;
        expect(() => getValidClient({ retries })).toThrowError(
          `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
        );
      });

      it("throws an error when the retries config value is greater than 3", () => {
        const retries = 4;
        expect(() => getValidClient({ retries })).toThrowError(
          `GraphQL Client: The provided "retries" value (${retries}) is invalid - it cannot be less than 0 or greater than 3`,
        );
      });
    });

    describe("config object", () => {
      it("returns a config object that includes the url", () => {
        const client = getValidClient();
        expect(client.config.url).toBe(clientConfig.url);
      });

      it("returns a config object that includes the headers", () => {
        const client = getValidClient();
        expect(client.config.headers).toBe(clientConfig.headers);
      });

      it("returns a config object that includes the default retries value when it is not provided at initialization", () => {
        const client = getValidClient();
        expect(client.config.retries).toBe(0);
      });

      it("returns a config object that includes the provided retries value", () => {
        const retries = 3;
        const client = getValidClient({ retries });
        expect(client.config.retries).toBe(retries);
      });
    });
  });
});
