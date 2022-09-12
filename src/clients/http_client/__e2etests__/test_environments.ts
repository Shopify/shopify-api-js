import {spawn} from 'child_process';

const nodeAppPort = '6666';
// const cfWorkerAppPort = '7777';
const httpServerPort = '9999';

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function shutdownEnvironments(): void {
  for (const env of allEnvironments) {
    if (typeof env.process.pid !== 'undefined') {
      process.kill(-env.process.pid);
    }
  }
}

async function serverReady(domain: string): Promise<boolean> {
  try {
    const response = await fetch(domain);
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

function allEnvironmentsReady(): boolean {
  return allEnvironments
    .map((env) => env.ready)
    .reduce((prev, curr) => prev && curr, true);
}

export async function runEnvironments(): Promise<boolean> {
  const maxAttempts = 5;

  if (allEnvironmentsReady()) return true;

  for (const env of allEnvironments) {
    let attempts = 0;
    let ready = false;

    while (!ready && attempts < maxAttempts) {
      attempts++;
      await sleep(100);
      ready = await serverReady(env.domain);
    }
    env.ready = ready;
  }
  return allEnvironmentsReady();
}

const allEnvironments = [
  {
    name: 'NodeJS',
    domain: `http://localhost:${nodeAppPort}`,
    process: spawn(
      'yarn',
      ['node', 'dist/clients/http_client/__e2etests__/test-node-app.js'],
      {
        env: {
          ...process.env, // eslint-disable-line no-process-env
          PORT: nodeAppPort,
          HTTP_SERVER_PORT: httpServerPort,
          E2ETESTS: '1',
        },
        detached: true,
        stdio: 'inherit',
      },
    ),
    testable: true,
    ready: false,
  },
  // {
  //   name: 'CF Worker',
  //   domain: `http://localhost:${cfWorkerAppPort}`,
  //   process: spawn(
  //     'yarn',
  //     [
  //       'miniflare',
  //       '--env',
  //       'src/clients/http_client/__e2etests__/.env.test',
  //       '--global',
  //       'E2ETESTS=1',
  //       '--port',
  //       `${cfWorkerAppPort}`,
  //       '--modules',
  //       'bundle/test-cf-worker-app.js',
  //     ],
  //     {
  //       detached: true,
  //       // stdio: 'inherit',
  //     },
  //   ),
  //   testable: true,
  //   ready: false,
  // },
  {
    name: 'HTTP server',
    domain: `http://localhost:${httpServerPort}`,
    process: spawn(
      'yarn',
      ['node', 'dist/clients/http_client/__e2etests__/http_server.js'],
      {
        env: {
          ...process.env, // eslint-disable-line no-process-env
          HTTP_SERVER_PORT: httpServerPort,
        },
        detached: true,
        stdio: 'inherit',
      },
    ),
    testable: false,
    ready: false,
  },
];

export const testEnvironments = allEnvironments.filter((env) => env.testable);
