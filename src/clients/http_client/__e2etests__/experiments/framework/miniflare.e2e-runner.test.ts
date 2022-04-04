import * as child_process from 'child_process';
import fetch from 'node-fetch';
import {DataType} from '../../../types';

import {ExpectedResponse, TestConfig} from './test_config';

/* eslint-disable-next-line no-undef */
// const jest = require('jest');

const testAppServer: string = "http://localhost:8787";

const miniflareServer: child_process.ChildProcess = child_process.spawn(
  'yarn', [
    'miniflare',
    '-e',
    'src/clients/http_client/__e2etests__/experiments/framework/.env.test',
    '--global',
    'E2ETESTS=1',
    '--modules',
    'bundle/test-cf-worker-app.js',
  ],
  {
    detached: true,
  },
);
// miniflareServer.stdout?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.log(` miniflare: ${trimmedOutput}`);
// });

// miniflareServer.stderr?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.error(` miniflare: ${trimmedOutput}`);
// });

// miniflareServer.on('close', (code) => {
//   console.log(`miniflare exited with code ${code}`);
// });

const httpServer: child_process.ChildProcess = child_process.spawn(
  'yarn',
  [
    'node',
    'dist/clients/http_client/__e2etests__/experiments/framework/http_server.js',
  ],
  {
    detached: true,
  }
);
// httpServer.stdout?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.log(`httpServer: ${trimmedOutput}`);
// });

// httpServer.stderr?.on('data', (data) => {
//   const trimmedOutput: string = String(data).trim();
//   console.error(`httpServer: ${trimmedOutput}`);
// });

// httpServer.on('close', (code) => {
//   console.log(`httpServer process exited with code ${code}`);
// });

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('CF Worker HTTP client', () => {
  const expectedSuccessResponse: ExpectedResponse = {
    statusCode: 200,
    statusText: 'OK',
    body: JSON.stringify({
      message: 'Your HTTP request was successful!',
    }),
  };

  beforeAll(async () => {
    await sleep(3000);
  });

  afterAll(async () => {
    await sleep(1000);
    await killChildProcesses();
  });

  it('can make GET request', async () => {
    const getTest: TestConfig = {
      testRequest: {
        method: 'get',
        url: '/url/path',
        headers: {},
      },
      expectedResponse: expectedSuccessResponse,
    };

    await expect(fetch(testAppServer, fetchParams(getTest))).resolves.toEqual(
      buildExpectedResponse(),
    );
  });

  it('can make POST request with type JSON', async () => {
    const postData = {
      title: 'Test product',
      amount: 10,
    };

    const postTest: TestConfig = {
      testRequest: {
        method: 'post',
        url: '/url/path',
        headers: {},
        bodyType: DataType.JSON,
        body: JSON.stringify(postData),
      },
      expectedResponse: expectedSuccessResponse,
    };

    await expect(fetch(testAppServer, fetchParams(postTest))).resolves.toEqual(
      buildExpectedResponse(),
    );
  });

  it('can make PUT request with type JSON', async () => {
    const putData = {
      title: 'Test product',
      amount: 10,
    };

    const putTest: TestConfig = {
      testRequest: {
        method: 'put',
        url: '/url/path/123',
        headers: {},
        bodyType: DataType.JSON,
        body: JSON.stringify(putData),
      },
      expectedResponse: expectedSuccessResponse,
    };

    await expect(fetch(testAppServer, fetchParams(putTest))).resolves.toEqual(
      buildExpectedResponse(),
    );
  });

        /**
       * 9. 'can make DELETE request'
      //  */
      //    response = await client.delete({path: '/url/path/123'});
      //    allPassed =
      //      allPassed &&
      //      JSON.stringify(response.body) === JSON.stringify(expectedResponse.body);
  it('can make DELETE request', async () => {
    const deleteTest: TestConfig = {
      testRequest: {
        method: 'delete',
        url: '/url/path/123',
        headers: {},
      },
      expectedResponse: expectedSuccessResponse,
    };

    await expect(fetch(testAppServer, fetchParams(deleteTest))).resolves.toEqual(
      buildExpectedResponse(),
    );
  });
});

function fetchParams(testConfig: TestConfig): any {
  return {
    method: 'post',
    body: JSON.stringify(testConfig),
    headers: { 'Content-Type': 'application/json' }
  }
}

function buildExpectedResponse(): Response {
  const expectedResponse: Partial<Response> = {
    status: 200,
  };

  return expect.objectContaining(expectedResponse);
}

async function killChildProcesses(): Promise<void> {
  if (typeof httpServer.pid !== 'undefined' ) {
    process.kill(-httpServer.pid);
  }
  if (typeof miniflareServer.pid !== 'undefined' ) {
    process.kill(-miniflareServer.pid);
  }
}