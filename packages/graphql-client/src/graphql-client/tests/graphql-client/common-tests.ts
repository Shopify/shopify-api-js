import { createGraphQLClient } from "../../graphql-client";
import { GraphQLClient } from "../../types";

import { operation, variables, clientConfig, getValidClient } from "./fixtures";

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
      headers: clientConfig.headers,
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
      headers: clientConfig.headers,
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
      headers: clientConfig.headers,
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
  });

  it("calls fetch API with provided variables", async () => {
    await client[functionName](gqlOperation, { variables });
    expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: clientConfig.headers,
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
      headers: clientConfig.headers,
      body: JSON.stringify({
        query: gqlOperation,
      }),
    });
  });

  it("calls fetch API with provided headers override", async () => {
    const headers = {
      "Content-Type": "application/graphql",
      "custom-header": "custom-headers",
    };

    await client[functionName](gqlOperation, { headers });
    expect(fetchMock).toHaveBeenCalledWith(clientConfig.url, {
      method: "POST",
      headers: { ...clientConfig.headers, ...headers },
      body: JSON.stringify({
        query: gqlOperation,
      }),
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
