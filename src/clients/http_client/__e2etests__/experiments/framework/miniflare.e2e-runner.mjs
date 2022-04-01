import {spawn} from 'child_process';
import fetch from 'node-fetch';

/* eslint-disable-next-line no-undef */
// const jest = require('jest');

const miniflareServer = spawn(
  'yarn', [
    'miniflare',
    '-e',
    'src/clients/http_client/__e2etests__/experiments/framework/.env.test',
    '--global',
    'E2ETESTS=1',
    '--modules',
    'bundle/cf-worker.test.js',
  ],
  {
    detached: true,
  },
);
miniflareServer.stdout.on('data', (data) => {
  const trimmedOutput = String(data).trim();
  console.log(` miniflare: ${trimmedOutput}`);
});

miniflareServer.stderr.on('data', (data) => {
  const trimmedOutput = String(data).trim();
  console.error(` miniflare: ${trimmedOutput}`);
});

miniflareServer.on('close', (code) => {
  console.log(`miniflare exited with code ${code}`);
});

const httpServer = spawn(
  'yarn',
  [
    'node',
    'src/clients/http_client/__e2etests__/experiments/framework/http_server.js',
  ],
  {
    detached: true,
  }
);
httpServer.stdout.on('data', (data) => {
  const trimmedOutput = String(data).trim();
  console.log(`httpServer: ${trimmedOutput}`);
});

httpServer.stderr.on('data', (data) => {
  const trimmedOutput = String(data).trim();
  console.error(`httpServer: ${trimmedOutput}`);
});

httpServer.on('close', (code) => {
  console.log(`httpServer process exited with code ${code}`);
});

// /* eslint-disable-next-line no-process-env, no-undef */
// process.env.TESTSERVER_PORT = 8080;
// const result = await jest.runSuite('./isomorphic-testsuite.js');

async function my_asyncFunction() {
  await sleep(4000);
  const resp = await fetch('http://localhost:8787', {method: 'get'});
  process.kill(-miniflareServer.pid);
  if (resp.status === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

my_asyncFunction();
