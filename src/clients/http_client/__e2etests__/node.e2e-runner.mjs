import {spawn} from 'child_process';
import fetch from 'node-fetch';

/* eslint-disable-next-line no-undef */
// const jest = require('jest');

// jest --no-coverage --testPathPattern=src/clients/http_client/__e2etests__/.*node\\.test\\.tsx?$
const nodeServer = spawn(
  'yarn', [
    'jest',
    '--no-coverage',
    '--testPathPattern=src/clients/http_client/__e2etests__/http_client-node.test.ts',
  ],
  {
    detached: true,
    env: {
      ...process.env,
      E2ETESTS: '1',
    },
  },
);
nodeServer.stdout.on('data', (data) => {
  const trimmedOutput = String(data).trim();
  console.log(`nodeServer: ${trimmedOutput}`);
});

nodeServer.stderr.on('data', (data) => {
  const trimmedOutput = String(data).trim();
  console.error(`nodeServer: ${trimmedOutput}`);
});

nodeServer.on('close', (code) => {
  console.log(`nodeServer exited with code ${code}`);
});

const httpServer = spawn(
  'yarn',
  [
    'node',
    'src/clients/http_client/__e2etests__/http_server.js',
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
