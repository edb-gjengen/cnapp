import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { QueryClient } from '@tanstack/react-query';
import type { PersistQueryClientOptions } from '@tanstack/react-query-persist-client';

import { ApiError } from '@/errors';

// How long the persisted cache, and thus the offline membership proof, lives
const PERSIST_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

export const appQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 401 = dead token, retrying can't help
      retry: (failureCount, error) => !(error instanceof ApiError && error.status === 401) && failureCount < 1,
      // No GC timer (90 days overflows setTimeout), maxAge bounds entry age
      gcTime: Infinity,
      staleTime: 60 * 1000,
    },
    mutations: {
      retry: 0,
    },
  },
});

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: 'cnapp.queryCache',
  // 0 in tests so throttle timers don't hold Jest open
  throttleTime: process.env.NODE_ENV === 'test' ? 0 : undefined,
});

export const persistOptions: Omit<PersistQueryClientOptions, 'queryClient'> = {
  persister,
  maxAge: PERSIST_MAX_AGE_MS,
  // Bump manually to bust the persisted cache
  buster: 'v1',
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => query.state.status === 'success',
  },
};
