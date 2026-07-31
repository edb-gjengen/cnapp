import AsyncStorage from '@react-native-async-storage/async-storage';

import { migrateReduxPersistAuth } from '@/auth/migrateFromReduxPersist';

const TOKEN_KEY = 'cnapp.authToken';
const PERSIST_KEY = 'persist:root';

const grisen = { username: 'grisen', email: 'grisen@example.test', is_member: true };

// redux-persist double-encodes: each value in the blob is its own JSON document
const persistBlob = (fields: Record<string, unknown>) =>
  JSON.stringify(Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, JSON.stringify(value)])));

const seedBlob = (fields: Record<string, unknown>) =>
  AsyncStorage.setItem(PERSIST_KEY, persistBlob({ _persist: { version: -1, rehydrated: true }, ...fields }));

beforeEach(async () => {
  // The AsyncStorage mock's methods are shared jest.fn()s; clear their history
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

it('reports logged out when no redux-persist blob exists', async () => {
  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBeNull();
});

it('moves the token to the new key and returns the cached user', async () => {
  await seedBlob({ userToken: '9a8b', user: grisen });

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: '9a8b', user: grisen });

  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBe('9a8b');
  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('treats a malformed outer blob as logged out and removes it', async () => {
  await AsyncStorage.setItem(PERSIST_KEY, 'not-json{');

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBeNull();
  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('treats a blob without userToken as logged out and removes it', async () => {
  await seedBlob({ user: grisen });

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('treats a logged out blob (userToken null) as logged out and removes it', async () => {
  await seedBlob({ userToken: null });

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBeNull();
  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('treats a non-string token as logged out and removes the blob', async () => {
  await seedBlob({ userToken: 42 });

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('treats an unparseable inner token as logged out and removes the blob', async () => {
  await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify({ userToken: 'not{json' }));

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('returns logged out and touches nothing when storage is unreadable', async () => {
  await seedBlob({ userToken: '9a8b' });
  jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('storage unreadable'));
  const removeSpy = jest.spyOn(AsyncStorage, 'removeItem');

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(removeSpy).not.toHaveBeenCalled();
  expect(await AsyncStorage.getItem(PERSIST_KEY)).not.toBeNull();
});

it('keeps an already-migrated token, without seeding, and still removes the blob', async () => {
  await AsyncStorage.setItem(TOKEN_KEY, 'existing-token');
  await seedBlob({ userToken: 'old-token', user: grisen });

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: 'existing-token', user: null });

  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBe('existing-token');
  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('migrates dev fake tokens verbatim', async () => {
  await seedBlob({ userToken: 'dev-fake-token:member' });

  const result = await migrateReduxPersistAuth();

  expect(result.token).toBe('dev-fake-token:member');
  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBe('dev-fake-token:member');
});

it('keeps the token when the user blob is unparseable', async () => {
  await AsyncStorage.setItem(PERSIST_KEY, JSON.stringify({ userToken: JSON.stringify('9a8b'), user: 'not{json' }));

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: '9a8b', user: null });

  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBe('9a8b');
  expect(await AsyncStorage.getItem(PERSIST_KEY)).toBeNull();
});

it('keeps the blob for a retry when the token cannot be stored', async () => {
  await seedBlob({ userToken: '9a8b' });
  jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('disk full'));

  await expect(migrateReduxPersistAuth()).resolves.toEqual({ token: null, user: null });

  expect(await AsyncStorage.getItem(PERSIST_KEY)).not.toBeNull();
});

it('never throws when removing the blob fails', async () => {
  await seedBlob({ userToken: '9a8b' });
  jest.spyOn(AsyncStorage, 'removeItem').mockRejectedValueOnce(new Error('storage error'));

  await expect(migrateReduxPersistAuth()).resolves.toMatchObject({ token: '9a8b' });

  expect(await AsyncStorage.getItem(TOKEN_KEY)).toBe('9a8b');
});
