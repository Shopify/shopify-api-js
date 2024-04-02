import { TextEncoder, TextDecoder } from "util";
import { Readable } from "stream";

import { ReadableStream } from "web-streams-polyfill";

import { createGraphQLClient } from "../../graphql-client";
import {
  LogContentTypes,
  ClientOptions,
  Headers as TypesHeaders,
} from "../../types";
import {
  SDK_VARIANT_HEADER,
  SDK_VERSION_HEADER,
  DEFAULT_CLIENT_VERSION,
  DEFAULT_SDK_VARIANT,
} from "../../constants";

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

export const defaultHeaders = {
  ...clientConfig.headers,
  [SDK_VARIANT_HEADER]: DEFAULT_SDK_VARIANT,
  [SDK_VERSION_HEADER]: DEFAULT_CLIENT_VERSION,
};

export function getValidClient({
  retries,
  logger,
  headers,
}: {
  retries?: number;
  logger?: (logContent: LogContentTypes) => void;
  headers?: TypesHeaders;
} = {}) {
  const updatedConfig: ClientOptions = { ...clientConfig };

  if (typeof retries === "number") {
    updatedConfig.retries = retries;
  }

  if (logger !== undefined) {
    updatedConfig.logger = logger;
  }

  if (headers !== undefined) {
    updatedConfig.headers = {
      ...updatedConfig.headers,
      ...headers,
    };
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

function getStringEncoder() {
  const textEncoder = new TextEncoder();

  return (str: any) => {
    return textEncoder.encode(str);
  };
}

function createReadableStream(
  responseArray: string[],
  stringEncoder: (str: any) => Uint8Array = getStringEncoder(),
) {
  return new ReadableStream({
    start(controller) {
      let index = 0;
      queueData();
      function queueData() {
        const chunk = responseArray[index];
        const string = stringEncoder(chunk);

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
  const stream = createReadableStream(responseArray);

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

export function createIterableBufferResponse(responseArray: string[]) {
  const encoder = new TextEncoder();
  const stream = createReadableStream(responseArray, (str) => {
    return Buffer.from(encoder.encode(str));
  });

  return new Response(Readable.from(stream) as any, streamResponseConfig);
}
