import { TextEncoder, TextDecoder } from "util";
import { Readable } from "stream";

import { ReadableStream } from "web-streams-polyfill/es2018";

import { createGraphQLClient } from "../../graphql-client";
import { LogContentTypes, ClientOptions } from "../../types";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

export const clientConfig = {
  url: "http://test-store.myshopify.com/api/2023-10/graphql.json",
  headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": "public-token",
  },
};

export const operation = `
query {
  shop {
    name
  }
}
`;

export const variables = {
  country: "US",
};

export function getValidClient({
  retries,
  logger,
}: {
  retries?: number;
  logger?: (logContent: LogContentTypes) => void;
} = {}) {
  const updatedConfig: ClientOptions = { ...clientConfig };

  if (typeof retries === "number") {
    updatedConfig.retries = retries;
  }

  if (logger !== undefined) {
    updatedConfig.logger = logger;
  }

  return createGraphQLClient(updatedConfig);
}

const streamResponseConfig = {
  status: 200,
  ok: true,
  headers: new Headers({
    "Content-Type": "multipart/mixed; boundary=graphql",
  }),
};

function createReadableStream(
  responseArray: string[],
  stringEncoder?: (str: any) => Uint8Array,
) {
  return new ReadableStream({
    start(controller) {
      let index = 0;
      queueData();
      function queueData() {
        const chunk = responseArray[index];
        const string = stringEncoder ? stringEncoder(chunk) : chunk;

        // Add the string to the stream
        controller.enqueue(string);

        index++;

        if (index > responseArray.length - 1) {
          controller.close();
        } else {
          return queueData();
        }
        return {};
      }
    },
  });
}

export function createReaderStreamResponse(responseArray: string[]) {
  const encoder = new TextEncoder();
  const stream = createReadableStream(responseArray, (str) => {
    return encoder.encode(str);
  });

  return {
    ...streamResponseConfig,
    body: {
      getReader: () => stream.getReader(),
    },
  } as any;
}

export function createIterableResponse(responseArray: string[]) {
  const stream = createReadableStream(responseArray);

  return new Response(Readable.from(stream) as any, streamResponseConfig);
}
