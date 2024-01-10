import fetchMock from "jest-fetch-mock";

import { generateHttpFetch } from "../http-fetch";
import { CustomFetchApi } from "../types";

const globalFetchMock = JSON.stringify({ data: {} });

const url = "http://localhost:1234/graphql";
export const operation = `
query {
  shop {
    name
  }
}
`;

export const variables = {};

describe("httpFetch utility", () => {
  let clientLogger: jest.Mock = jest.fn();

  fetchMock.enableMocks();

  beforeEach(() => {
    jest
      .spyOn(global, "setTimeout")
      .mockImplementation(jest.fn((resolve) => resolve() as any));
    fetchMock.mockResponse(() => Promise.resolve(globalFetchMock));
    clientLogger = jest.fn();
  });

  afterEach(() => {
    fetchMock.resetMocks();
    jest.restoreAllMocks();
  });

  describe("generateHttpFetch()", () => {
    describe("initialization", () => {
      it("can create a new function", () => {
        const httpFetch = generateHttpFetch({ clientLogger });

        expect(httpFetch).toBeDefined();
      });
    });

    describe("httpFetch()", () => {
      it("uses the global fetch when a custom fetch API is not provided at initialization", () => {
        const httpFetch = generateHttpFetch({ clientLogger });

        httpFetch([url, { method: "POST", body: operation }], 1, 0);

        expect(fetch).toHaveBeenCalledWith(url, {
          method: "POST",
          body: operation,
        });
      });

      it("uses the fetch override if one is given", () => {
        const mockFetch = jest.fn();
        mockFetch.mockReturnValue(
          Promise.resolve(new Response(globalFetchMock)),
        );

        const httpFetch = generateHttpFetch({
          customFetchApi: mockFetch,
          clientLogger,
        });

        httpFetch([url, { method: "POST", body: operation }], 1, 0);

        expect(fetch).not.toHaveBeenCalled();
        expect(mockFetch).toHaveBeenCalledWith(url, {
          method: "POST",
          body: operation,
        });
      });

      it("uses all fetch RequestInit fields", async () => {
        const httpFetch = generateHttpFetch({ clientLogger });

        const requestParams: Parameters<CustomFetchApi> = [
          url,
          {
            method: "POST",
            body: JSON.stringify({ query: operation }),
            headers: { "X-My-Header": "1" },
          },
        ];

        await httpFetch(requestParams, 1, 0);

        expect(fetch).toHaveBeenCalledWith(...requestParams);
      });

      it("uses default client name for errors", async () => {
        const httpFetch = generateHttpFetch({ clientLogger });

        fetchMock.mockAbort();

        await expect(async () => {
          await httpFetch([operation], 1, 0);
        }).rejects.toThrow(new RegExp(/^GraphQL Client: /));
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      it("logs responses with client name override", async () => {
        const httpFetch = generateHttpFetch({ clientLogger, client: "foo" });

        fetchMock.mockAbort();

        await expect(async () => {
          await httpFetch([operation], 1, 0);
        }).rejects.toThrow(new RegExp(/^foo: /));
        expect(fetch).toHaveBeenCalledTimes(1);
      });

      describe("retries", () => {
        let httpFetch: ReturnType<typeof generateHttpFetch>;

        beforeEach(() => {
          httpFetch = generateHttpFetch({ clientLogger });
        });

        it("waits for the override retry wait time", async () => {
          const httpFetch = generateHttpFetch({
            clientLogger,
            defaultRetryWaitTime: 500,
          });

          fetchMock.mockAbort();

          await expect(async () => {
            await httpFetch([operation], 1, 1);
          }).rejects.toThrow();

          expect(setTimeout).toHaveBeenCalledTimes(1);
          expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 500);
        });

        describe("Aborted fetch responses", () => {
          it("calls the global fetch 1 time and throws a plain error when the client retries value is 0", async () => {
            fetchMock.mockAbort();

            await expect(async () => {
              await httpFetch([operation], 1, 0);
            }).rejects.toThrow(new RegExp(/^GraphQL Client: /));
            expect(fetch).toHaveBeenCalledTimes(1);
          });

          it("calls the global fetch 2 times and throws a retry error when the client was initialized with 1 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            await expect(async () => {
              await httpFetch([operation], 1, 1);
            }).rejects.toThrow(
              new RegExp(
                /^GraphQL Client: Attempted maximum number of 1 network retries. Last message - /,
              ),
            );
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("calls the global fetch 3 times and throws a retry error when the function is provided with 2 retries and all fetches were aborted", async () => {
            fetchMock.mockAbort();

            await expect(async () => {
              await httpFetch([operation], 1, 2);
            }).rejects.toThrow(
              new RegExp(
                /^GraphQL Client: Attempted maximum number of 2 network retries. Last message - /,
              ),
            );

            expect(fetch).toHaveBeenCalledTimes(3);
          });

          it("returns a valid http response after an aborted fetch and the next response is valid", async () => {
            fetchMock.mockAbortOnce();

            const response = await httpFetch([operation], 1, 2);

            expect(response.status).toBe(200);
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("delays a retry by 1000ms", async () => {
            fetchMock.mockAbort();

            await expect(async () => {
              await httpFetch([operation], 1, 1);
            }).rejects.toThrow();

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            fetchMock.mockAbort();

            const requestParams: Parameters<CustomFetchApi> = [
              url,
              {
                method: "POST",
                body: JSON.stringify({ query: operation }),
              },
            ];

            await expect(async () => {
              await httpFetch(requestParams, 1, 2);
            }).rejects.toThrow();

            expect(clientLogger).toHaveBeenCalledTimes(2);
            expect(clientLogger).toHaveBeenNthCalledWith(1, {
              type: "HTTP-Retry",
              content: {
                requestParams,
                lastResponse: undefined,
                retryAttempt: 1,
                maxRetries: 2,
              },
            });

            expect(clientLogger).toHaveBeenNthCalledWith(2, {
              type: "HTTP-Retry",
              content: {
                requestParams,
                lastResponse: undefined,
                retryAttempt: 2,
                maxRetries: 2,
              },
            });
          });
        });

        describe("429 responses", () => {
          const status = 429;
          const mockedFailedResponse = new Response(JSON.stringify({}), {
            status,
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          });

          it("calls the global fetch 1 time and returns the failed http response when the client default retries value is 0", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await httpFetch([operation], 1, 0);

            expect(response.status).toBe(status);
            expect(fetch).toHaveBeenCalledTimes(1);
          });

          it("calls the global fetch 2 times and returns the failed http response when the client was initialized with 1 retries and all fetches returned 429 responses", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const response = await httpFetch([operation], 1, 1);

            expect(response.status).toBe(status);
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("calls the global fetch 3 times and returns the failed http response when the function is provided with 2 retries and all fetches returned 429 responses", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await httpFetch([operation], 1, 2);

            expect(response.status).toBe(status);
            expect(fetch).toHaveBeenCalledTimes(3);
          });

          it("returns a valid response after an a failed 429 fetch response and the next response is valid", async () => {
            const mockedSuccessData = { data: {} };
            fetchMock.mockResponses(
              ["", { status }],
              [JSON.stringify(mockedSuccessData), { status: 200 }],
            );

            const response = await httpFetch([operation], 1, 2);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual(mockedSuccessData);
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("returns a failed non 429/503 response after an a failed 429 fetch response and the next response has failed", async () => {
            const mockedSuccessData = { data: {} };
            fetchMock.mockResponses(
              ["", { status }],
              [JSON.stringify(mockedSuccessData), { status: 500 }],
            );

            const response = await httpFetch([operation], 1, 2);

            expect(response.status).toBe(500);
            expect(await response.json()).toEqual(mockedSuccessData);
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("delays a retry by 1000ms", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const response = await httpFetch([operation], 1, 1);

            expect(response.status).toBe(status);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const requestParams: Parameters<CustomFetchApi> = [
              url,
              { method: "POST", body: JSON.stringify({ query: operation }) },
            ];

            await httpFetch(requestParams, 1, 2);

            const retryLogs = clientLogger.mock.calls.filter(
              (args) => args[0].type === "HTTP-Retry",
            );

            expect(retryLogs.length).toBe(2);

            const firstLogContent = retryLogs[0][0].content;
            expect(firstLogContent.requestParams).toEqual(requestParams);
            expect(firstLogContent.lastResponse.status).toBe(status);
            expect(firstLogContent.retryAttempt).toBe(1);
            expect(firstLogContent.maxRetries).toBe(2);

            const secondLogContent = retryLogs[1][0].content;
            expect(secondLogContent.requestParams).toEqual(requestParams);
            expect(secondLogContent.lastResponse.status).toBe(status);
            expect(secondLogContent.retryAttempt).toBe(2);
            expect(secondLogContent.maxRetries).toBe(2);
          });
        });

        describe("503 responses", () => {
          const status = 503;
          const mockedFailedResponse = new Response(JSON.stringify({}), {
            status,
            headers: new Headers({
              "Content-Type": "application/json",
            }),
          });

          it("calls the global fetch 1 time and returns the failed http response when the client default retries value is 0", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await httpFetch([operation], 1, 0);

            expect(response.status).toBe(status);
            expect(fetch).toHaveBeenCalledTimes(1);
          });

          it("calls the global fetch 2 times and returns the failed http response when the client was initialized with 1 retries and all fetch responses were 503 ", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const response = await httpFetch([operation], 1, 1);

            expect(response.status).toBe(status);
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("calls the global fetch 3 times and returns the failed http response when the function is provided with 2 retries and all fetch responses were 503", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);
            const response = await httpFetch([operation], 1, 2);

            expect(response.status).toBe(status);
            expect(fetch).toHaveBeenCalledTimes(3);
          });

          it("returns a valid response after a failed 503 fetch response and the next response is valid", async () => {
            const mockedSuccessData = { data: {} };
            fetchMock.mockResponses(
              ["", { status }],
              [JSON.stringify(mockedSuccessData), { status: 200 }],
            );

            const response = await httpFetch([operation], 1, 2);

            expect(response.status).toBe(200);
            expect(await response.json()).toEqual(mockedSuccessData);
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("returns a failed non 429/503 response after a failed 503 fetch response and the next response has failed", async () => {
            const mockedSuccessData = { data: {} };
            fetchMock.mockResponses(
              ["", { status }],
              [JSON.stringify(mockedSuccessData), { status: 500 }],
            );

            const response = await httpFetch([operation], 1, 1);

            expect(response.status).toBe(500);
            expect(await response.json()).toEqual(mockedSuccessData);
            expect(fetch).toHaveBeenCalledTimes(2);
          });

          it("delays a retry by 1000ms", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const response = await httpFetch([operation], 1, 1);

            expect(response.status).toBe(status);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
          });

          it("logs each retry attempt if a logger is provided", async () => {
            fetchMock.mockResolvedValue(mockedFailedResponse);

            const requestParams: Parameters<CustomFetchApi> = [
              url,
              { method: "POST", body: JSON.stringify({ query: operation }) },
            ];
            await httpFetch(requestParams, 1, 2);

            const retryLogs = clientLogger.mock.calls.filter(
              (args) => args[0].type === "HTTP-Retry",
            );

            expect(retryLogs.length).toBe(2);

            const firstLogContent = retryLogs[0][0].content;
            expect(firstLogContent.requestParams).toEqual(requestParams);
            expect(firstLogContent.lastResponse.status).toBe(status);
            expect(firstLogContent.retryAttempt).toBe(1);
            expect(firstLogContent.maxRetries).toBe(2);

            const secondLogContent = retryLogs[1][0].content;
            expect(secondLogContent.requestParams).toEqual(requestParams);
            expect(secondLogContent.lastResponse.status).toBe(status);
            expect(secondLogContent.retryAttempt).toBe(2);
            expect(secondLogContent.maxRetries).toBe(2);
          });
        });

        it("does not retry additional network requests if the initial response is successful", async () => {
          const mockedSuccessResponse = new Response(
            JSON.stringify({ data: {} }),
            {
              status: 200,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            },
          );

          fetchMock.mockResolvedValue(mockedSuccessResponse);
          const response = await httpFetch([operation], 1, 2);

          expect(response.status).toBe(200);
          expect(fetch).toHaveBeenCalledTimes(1);
        });

        it("does not retry additional network requests on a failed response that is not a 429 or 503", async () => {
          const mockedFailedResponse = new Response(
            JSON.stringify({ data: {} }),
            {
              status: 500,
              headers: new Headers({
                "Content-Type": "application/json",
              }),
            },
          );

          fetchMock.mockResolvedValue(mockedFailedResponse);
          const response = await httpFetch([operation], 1, 2);

          expect(response.status).toBe(500);
          expect(fetch).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
