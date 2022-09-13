import {MemorySessionStorage} from '../memory';

import {batteryOfTests} from './battery-of-tests';

describe('MemorySessionStorage', () => {
  let storage: MemorySessionStorage;
  beforeAll(async () => {
    storage = new MemorySessionStorage();
  });

  batteryOfTests(async () => storage);
});
