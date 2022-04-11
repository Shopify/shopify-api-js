import * as fs from 'fs/promises';

import {Session} from '../../session';
import {SessionStorage} from '../../session_storage';

interface StorageModuleDescriptor {
  name: string;
  instantiate: () => Promise<SessionStorage>;
  shutdown?: () => Promise<void>;
}

const sqliteDbFile = './sqlite.testDb';
const storageModules: StorageModuleDescriptor[] = [
  {
    name: 'in-Memory SessionStorage ',
    async instantiate() {
      const mod = await import('../memory');
      const instance = new mod.MemorySessionStorage();
      return instance;
    },
  },
  {
    name: 'SQLite SessionStorage',
    async instantiate() {
      const mod = await import('../sqlite');
      await fs.unlink(sqliteDbFile).catch(() => {});
      const instance = new mod.SQLiteSessionStorage(sqliteDbFile, {
        createDBWhenMissing: true,
      });
      return instance;
    },
    async shutdown() {
      await fs.unlink(sqliteDbFile).catch(() => {});
    },
  },
];

for (const storageModule of storageModules) {
  // eslint-disable-next-line no-loop-func
  describe(`Generic test suite for ${storageModule.name}`, () => {
    let storage: SessionStorage;
    beforeAll(async () => {
      storage = await storageModule.instantiate();
    });

    afterAll(async () => {
      await storageModule.shutdown?.();
    });

    it('can store and delete sessions in memory', async () => {
      const sessionId = 'test_session';
      const session = new Session(sessionId, 'shop', 'state', false);

      await expect(storage.storeSession(session)).resolves.toBe(true);
      await expect(storage.loadSession(sessionId)).resolves.toEqual(session);

      await expect(storage.storeSession(session)).resolves.toBe(true);
      await expect(storage.loadSession(sessionId)).resolves.toEqual(session);

      await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
      await expect(storage.loadSession(sessionId)).resolves.toBeUndefined();

      // Deleting a non-existing session should work
      await expect(storage.deleteSession(sessionId)).resolves.toBe(true);
    });

    it('wrong ids return null sessions from memory', async () => {
      await expect(
        storage.loadSession('not_a_session_id'),
      ).resolves.toBeUndefined();
    });
  });
}
