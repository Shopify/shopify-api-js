import fetchMock from "jest-fetch-mock";

import { createGraphQLClient } from "../../graphql-client";
import { GraphQLClient } from "../../types";
import {
  SDK_VARIANT_HEADER,
  SDK_VERSION_HEADER,
  DEFAULT_CLIENT_VERSION,
  DEFAULT_SDK_VARIANT,
} from "../../constants";

import {
  operation,
  variables,
  clientConfig,
  getValidClient,
  defaultHeaders,
} from "./fixtures";

type ClientFunctionNames = keyof Omit<GraphQLClient, "config">;

export const fetchApiTests = (
  functionName: ClientFunctionNames,
  gqlOperation: string = operation,
) => {
  let client: GraphQLClient;

  beforeEach(() => {
    client = getValidClient();
  });

  it("uses the global fetch when a custom fetch API is not provided at initialization ", () => {
    client[functionName](gqlOperation);

    expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: {
        ...clientConfig.headers,
        [SDK_VARIANT_HEADER]: DEFAULT_SDK_VARIANT,
        [SDK_VERSION_HEADER]: DEFAULT_CLIENT_VERSION,
      },
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
  });

  it("uses the provided custom fetch when a custom fetch API is provided at initialization ", () => {
    const customFetchApi = jest
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ data: {} }))) as any;

    const client = createGraphQLClient({
      ...clientConfig,
      customFetchApi,
    });

    const props: [string] = [gqlOperation];

    client[functionName](...props);

    expect(customFetchApi).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });
};

export const parametersTests = (
  functionName: ClientFunctionNames,
  gqlOperation: string = operation,
) => {
  let client: GraphQLClient;

  beforeEach(() => {
    client = getValidClient();
  });

  it("calls fetch API with provided operation", async () => {
    await client[functionName](gqlOperation);
    expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
  });

  it("calls fetch API with provided variables", async () => {
    await client[functionName](gqlOperation, { variables });
    expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        query: gqlOperation,
        variables,
      }),
    });
  });

  it("calls fetch API with provided url override", async () => {
    const url = "http://test-store.myshopify.com/api/2023-07/graphql.json";
    await client[functionName](gqlOperation, { url });
    expect(fetchMock).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
  });

  it("calls fetch API with provided headers override", async () => {
    const arrayHeadersProp = "array-headers";
    const arrayHeadersValue = ["1", "2", "3"];

    const stringHeaders = {
      "Content-Type": "application/graphql",
      "custom-header": "custom-headers",
    };

    await client[functionName](gqlOperation, {
      headers: { ...stringHeaders, [arrayHeadersProp]: arrayHeadersValue },
    });

    expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: {
        ...defaultHeaders,
        ...stringHeaders,
        [arrayHeadersProp]: arrayHeadersValue.join(", "),
      },
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
  });
};

export const sdkHeadersTests = (
  functionName: ClientFunctionNames,
  gqlOperation: string = operation,
) => {
  let client: GraphQLClient;

  beforeEach(() => {
    client = getValidClient();
  });

  it("includes the default SDK variant and SDK version headers if none were provided in the init config headers or override header", async () => {
    await client[functionName](gqlOperation);
    expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: defaultHeaders,
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
  });

  describe("SDK headers provided in client init", () => {
    it("includes the custom SDK variant and SDK version headers if they were provided in the init config headers", async () => {
      const initCustomHeaders = {
        [SDK_VARIANT_HEADER]: "custom-client",
        [SDK_VERSION_HEADER]: "0.0.1",
      };

      client = getValidClient({
        headers: initCustomHeaders,
      });

      await client[functionName](gqlOperation);
      expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
        method: "POST",
        headers: {
          ...clientConfig.headers,
          ...initCustomHeaders,
        },
        body: JSON.stringify({
          query: gqlOperation,
        }),
      });
    });

    it("does not includes the default SDK variant and version headers if an SDK variant was provided in the init config headers", async () => {
      const initCustomHeaders = {
        [SDK_VARIANT_HEADER]: "custom-client",
      };

      client = getValidClient({
        headers: initCustomHeaders,
      });

      await client[functionName](gqlOperation);
      expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
        method: "POST",
        headers: {
          ...clientConfig.headers,
          ...initCustomHeaders,
        },
        body: JSON.stringify({
          query: gqlOperation,
        }),
      });
    });

    it("does not includes the default SDK variant and version headers if an SDK version was provided in the init config headers", async () => {
      const initCustomHeaders = {
        [SDK_VERSION_HEADER]: "0.0.1",
      };

      client = getValidClient({
        headers: initCustomHeaders,
      });

      await client[functionName](gqlOperation);
      expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
        method: "POST",
        headers: {
          ...clientConfig.headers,
          ...initCustomHeaders,
        },
        body: JSON.stringify({
          query: gqlOperation,
        }),
      });
    });
  });

  describe("SDK headers provided in function parameter headers", () => {
    it("includes the custom SDK variant and SDK version headers if they were provided in the function parameter headers", async () => {
      const customHeaders = {
        [SDK_VARIANT_HEADER]: "custom-client",
        [SDK_VERSION_HEADER]: "0.0.1",
      };

      await client[functionName](gqlOperation, { headers: customHeaders });
      expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
        method: "POST",
        headers: {
          ...clientConfig.headers,
          ...customHeaders,
        },
        body: JSON.stringify({
          query: gqlOperation,
        }),
      });
    });

    it("includes the function parameter custom SDK variant and version headers if both function parameter and client init config includes SDK headers", async () => {
      const initCustomHeaders = {
        [SDK_VARIANT_HEADER]: "custom-client",
        [SDK_VERSION_HEADER]: "0.0.1",
      };

      const customHeaders = {
        [SDK_VARIANT_HEADER]: "custom-client-1",
        [SDK_VERSION_HEADER]: "0.0.2",
      };

      client = getValidClient({
        headers: initCustomHeaders,
      });

      await client[functionName](gqlOperation, { headers: customHeaders });
      expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
        method: "POST",
        headers: {
          ...clientConfig.headers,
          ...customHeaders,
        },
        body: JSON.stringify({
          query: gqlOperation,
        }),
      });
    });

    it("does not includes the default SDK variant and version headers if an SDK variant was provided in the function parameter headers", async () => {
      const customHeaders = {
        [SDK_VARIANT_HEADER]: "custom-client",
      };

      await client[functionName](gqlOperation, { headers: customHeaders });
      expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
        method: "POST",
        headers: {
          ...clientConfig.headers,
          ...customHeaders,
        },
        body: JSON.stringify({
          query: gqlOperation,
        }),
      });
    });

    it("does not includes the default SDK variant and version headers if an SDK version was provided in the functiono parameter headers", async () => {
      const customHeaders = {
        [SDK_VERSION_HEADER]: "0.0.1",
      };

      await client[functionName](gqlOperation, { headers: customHeaders });
      expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
        method: "POST",
        headers: {
          ...clientConfig.headers,
          ...customHeaders,
        },
        body: JSON.stringify({
          query: gqlOperation,
        }),
      });
    });
  });
};

export const retryTests = (
  functionName: ClientFunctionNames,
  gqlOperation: string = operation,
) => {
  let client: GraphQLClient;

  beforeEach(() => {
    client = getValidClient();
  });

  it("does not retry additional network requests if the initial response is successful", async () => {
    const mockedSuccessResponse = new Response(JSON.stringify({ data: {} }), {
      status: 200,
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    fetchMock.mockResolvedValue(mockedSuccessResponse);
    await client[functionName](gqlOperation, { retries: 2 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not retry additional network requests on a failed response that is not a 429 or 503", async () => {
    const mockedFailedResponse = new Response(JSON.stringify({ data: {} }), {
      status: 500,
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    });

    fetchMock.mockResolvedValue(mockedFailedResponse);
    await client[functionName](gqlOperation, { retries: 2 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
};
