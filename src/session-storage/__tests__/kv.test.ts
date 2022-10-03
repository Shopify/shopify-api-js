import {Miniflare} from 'miniflare';

import {KVSessionStorage} from '../kv';

import {batteryOfTests} from './battery-of-tests';

describe('KVSessionStorage', () => {
  let storage: KVSessionStorage | undefined;
  beforeAll(async () => {
    const mf = new Miniflare({
      scriptPath: './src/session-storage/__tests__/kv-bucket-dummy-worker.ts',
      kvNamespaces: ['KV_TEST_BUCKET'],
    });

    storage = new KVSessionStorage(await mf.getKVNamespace('KV_TEST_BUCKET'));
  });

  batteryOfTests(async () => storage!);
});
