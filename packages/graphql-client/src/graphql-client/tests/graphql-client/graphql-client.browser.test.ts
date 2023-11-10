import fetchMock from "jest-fetch-mock";

import { GraphQLClient } from "../../types";

import { getValidClient, operation } from "./fixtures";

describe("GraphQL Client", () => {
  const abortMessage = "The operation was aborted. ";
  let client: GraphQLClient;

  fetchMock.enableMocks();

  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation(jest.fn((resolve) => resolve() as any));

    client = getValidClient();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    jest.restoreAllMocks();
  });

  describe("createGraphQLClient()", () => {
    describe("fetch()", () => {
      describe("calling the function", () => {
        describe("retries", () => {
          describe("Aborted fetch responses", () => {
            beforeEach(() => {
              fetchMock.mockAbort();
            });

            it("calls the global fetch 1 time and throws a plain error when the client retries value is 0", async () => {
              await expect(async () => {
                await client.fetch(operation);
              }).rejects.toThrow(`GraphQL Client: ${abortMessage}`);
              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the global fetch 2 times and throws a retry error when the client was initialized with 1 retries and all fetches were aborted", async () => {
              const client = getValidClient({ retries: 1 });

              await expect(async () => {
                await client.fetch(operation);
              }).rejects.toThrow(
                `GraphQL Client: Attempted maximum number of 1 network retries. Last message - ${abortMessage}`
              );
              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the global fetch 3 times and throws a retry error when the function is provided with 2 retries and all fetches were aborted", async () => {
              await expect(async () => {
                await client.fetch(operation, { retries: 2 });
              }).rejects.toThrow(
                `GraphQL Client: Attempted maximum number of 2 network retries. Last message - ${abortMessage}`
              );

              expect(fetchMock).toHaveBeenCalledTimes(3);
            });
          });
        });
      });
    });

    describe("request()", () => {
      describe("calling the function", () => {
        describe("retries", () => {
          describe("Aborted fetch responses", () => {
            beforeEach(() => {
              fetchMock.mockAbort();
            });

            it("calls the global fetch 1 time and returns a response object with a plain error when the client default retries value is 0 ", async () => {
              const response = await client.request(operation);

              expect(response.errors?.message).toBe(
                `GraphQL Client: ${abortMessage}`
              );

              expect(fetchMock).toHaveBeenCalledTimes(1);
            });

            it("calls the global fetch 2 times and returns a response object with an error when the client was initialized with 1 retries and all fetches were aborted", async () => {
              const client = getValidClient({ retries: 1 });
              const response = await client.request(operation);

              expect(response.errors?.message).toBe(
                `GraphQL Client: Attempted maximum number of 1 network retries. Last message - ${abortMessage}`
              );

              expect(fetchMock).toHaveBeenCalledTimes(2);
            });

            it("calls the global fetch 3 times and returns a response object with an error when the function is provided with 2 retries and all fetches were aborted", async () => {
              const response = await client.request(operation, { retries: 2 });

              expect(response.errors?.message).toBe(
                `GraphQL Client: Attempted maximum number of 2 network retries. Last message - ${abortMessage}`
              );

              expect(fetchMock).toHaveBeenCalledTimes(3);
            });
          });
        });
      });
    });
  });
});
