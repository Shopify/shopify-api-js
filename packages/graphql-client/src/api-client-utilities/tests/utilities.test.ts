import { generateGetHeaders, generateGetGQLClientParams } from "../utilities";

describe("generateGetHeaders()", () => {
  const config = {
    storeDomain: "https://test.shopify.io",
    apiUrl: "https://test.shopify.io/api/2023-10/graphql.json",
    apiVersion: "2023-10",
    headers: {
      "X-Shopify-Storefront-Access-Token": "public-access-token",
    },
  };

  let getHeader: ReturnType<typeof generateGetHeaders>;

  beforeEach(() => {
    getHeader = generateGetHeaders(config);
  });

  it("returns a function ", () => {
    expect(getHeader).toEqual(expect.any(Function));
  });

  describe("returned function", () => {
    it("returns the config headers if no custom headers were passed in", () => {
      expect(getHeader()).toEqual(config.headers);
    });

    it("returns a set of headers that includes both the provided custom headers and the config headers", () => {
      const customHeaders = {
        "Shopify-Storefront-Id": "shop-id",
      };

      expect(getHeader(customHeaders)).toEqual({
        ...customHeaders,
        ...config.headers,
      });
    });

    it("returns a set of headers where the client config headers cannot be overwritten with the custom headers", () => {
      const customHeaders = {
        "Shopify-Storefront-Id": "shop-id",
        "X-Shopify-Storefront-Access-Token": "",
      };

      const headers = getHeader(customHeaders);
      expect(headers["X-Shopify-Storefront-Access-Token"]).toEqual(
        config.headers["X-Shopify-Storefront-Access-Token"],
      );
    });
  });
});

describe("generateGetGQLClientParams()", () => {
  const mockHeaders = {
    "X-Shopify-Storefront-Access-Token": "public-access-token",
  };
  const mockApiUrl = "https://test.shopify.io/api/unstable/graphql.json";
  const operation = `
      query products{
        products(first: 1) {
          nodes {
            id
            title
          }
        }
      }
    `;

  let getHeaderMock: jest.Mock;
  let getApiUrlMock: jest.Mock;
  let getGQLClientParams: ReturnType<typeof generateGetGQLClientParams>;

  beforeEach(() => {
    getHeaderMock = jest.fn().mockReturnValue(mockHeaders);
    getApiUrlMock = jest.fn().mockReturnValue(mockApiUrl);
    getGQLClientParams = generateGetGQLClientParams({
      getHeaders: getHeaderMock,
      getApiUrl: getApiUrlMock,
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it("returns a function", () => {
    expect(getGQLClientParams).toEqual(expect.any(Function));
  });

  describe("returned function", () => {
    it("returns an array with only the operation string if no additional options were passed into the function", () => {
      const params = getGQLClientParams(operation);

      expect(params).toHaveLength(1);
      expect(params[0]).toBe(operation);
    });

    it("returns an array with only the operation string if an empty options object was passed into the function", () => {
      const params = getGQLClientParams(operation, {});

      expect(params).toHaveLength(1);
      expect(params[0]).toBe(operation);
    });

    it("returns an array with the operation string and an option with variables when variables were provided", () => {
      const variables = { first: 10 };
      const params = getGQLClientParams(operation, { variables });

      expect(params).toHaveLength(2);

      expect(params[0]).toBe(operation);
      expect(params[1]).toEqual({ variables });
    });

    it("returns an array with the operation string and an option with headers when custom headers were provided", () => {
      const headers = { "Shopify-Storefront-Id": "shop-id" };
      const params = getGQLClientParams(operation, { headers });

      expect(params).toHaveLength(2);

      expect(params[0]).toBe(operation);
      expect(getHeaderMock).toHaveBeenCalledWith(headers);
      expect(params[1]).toEqual({ headers: mockHeaders });
    });

    it("returns an array with the operation string and an option with url when an api version was provided", () => {
      const apiVersion = "unstable";
      const params = getGQLClientParams(operation, { apiVersion });

      expect(params).toHaveLength(2);

      expect(params[0]).toBe(operation);
      expect(getApiUrlMock).toHaveBeenCalledWith(apiVersion);
      expect(params[1]).toEqual({ url: mockApiUrl });
    });

    it("returns an array with the operation string and an option with retries when a retries value was provided", () => {
      const retries = 2;
      const params = getGQLClientParams(operation, { retries });

      expect(params).toHaveLength(2);

      expect(params[0]).toBe(operation);
      expect(params[1]).toEqual({ retries });
    });
  });
});
