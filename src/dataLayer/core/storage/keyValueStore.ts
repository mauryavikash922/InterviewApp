import { AppError } from '../errors/AppError';

export type StorageDriver = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

export type KeyValueStore = {
  getJSON: (key: string) => Promise<unknown>;
  setJSON: (key: string, value: unknown) => Promise<void>;
};

export const createKeyValueStore = (driver: StorageDriver): KeyValueStore => ({
  getJSON: async (key) => {
    let raw: string | null;
    try {
      raw = await driver.getItem(key);
    } catch (error) {
      throw new AppError('STORAGE_READ_FAILED', `Failed to read ${key}`, error);
    }
    if (raw === null) {
      return null;
    }
    try {
      const parsed: unknown = JSON.parse(raw);
      return parsed;
    } catch (error) {
      throw new AppError('MALFORMED_DATA', `Invalid JSON in ${key}`, error);
    }
  },
  setJSON: async (key, value) => {
    try {
      await driver.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw new AppError('STORAGE_WRITE_FAILED', `Failed to write ${key}`, error);
    }
  },
});

export const createInMemoryStorageDriver = (
  initial: Record<string, string> = {},
): StorageDriver => {
  const data = new Map(Object.entries(initial));
  return {
    getItem: async (key) => data.get(key) ?? null,
    setItem: async (key, value) => {
      data.set(key, value);
    },
  };
};
