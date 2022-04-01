import * as child_process from 'child_process';
import fetch from 'node-fetch';

/* eslint-disable-next-line no-undef */
// const jest = require('jest');

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

// /* eslint-disable-next-line no-process-env, no-undef */
// process.env.TESTSERVER_PORT = 8080;
// const result = await jest.runSuite('./isomorphic-testsuite.js');
// async function delayStart() {
//   await sleep(4000);
// }

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

describe('HTTP client', () => {
  beforeAll(async () => {
    await sleep(4000);
  });

  afterAll(async () => {
    await sleep(1000);
    await killChildProcesses();
  });

  it('runs the test suite', async () => {
    await expect(fetch('http://localhost:8787', {method: 'get'})).resolves.toEqual(
      buildExpectedResponse(),
    );
  });
});

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