import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import React from 'react';

import { AuthProvider, useAuth } from '@/auth/AuthContext';
import { queryKeys } from '@/queries/queryKeys';

const TOKEN_KEY = 'cnapp.authToken';

const grisen = { username: 'grisen', email: 'grisen@example.test', is_member: true };

// gcTime: Infinity so no GC timers keep Jest alive
const createQueryClient = () => new QueryClient({ defaultOptions: { queries: { gcTime: Infinity } } });

const renderAuth = ({
  initialToken,
  queryClient = createQueryClient(),
}: { initialToken?: string | null; queryClient?: QueryClient } = {}) => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialToken={initialToken}>{children}</AuthProvider>
    </QueryClientProvider>
  );
  return { queryClient, ...renderHook(() => useAuth(), { wrapper }) };
};

beforeEach(async () => {
  // The AsyncStorage mock's methods are shared jest.fn()s; clear their history
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

it('renders nothing until the stored session is restored', async () => {
  await AsyncStorage.setItem(TOKEN_KEY, 'token-123');

  const { result } = renderAuth();
  // The gate: children (and thus the hook) have not rendered yet
  expect(result.current).toBeNull();

  await waitFor(() => expect(result.current).not.toBeNull());
  expect(result.current.token).toBe('token-123');
  expect(result.current.isAuthenticated).toBe(true);
});

it('starts logged out when nothing is stored', async () => {
  const { result } = renderAuth();

  await waitFor(() => expect(result.current).not.toBeNull());
  expect(result.current.token).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
});

it('runs the redux-persist migration and seeds the cached user', async () => {
  await AsyncStorage.setItem(
    'persist:root',
    JSON.stringify({ userToken: JSON.stringify('9a8b'), user: JSON.stringify(grisen) }),
  );

  const { result, queryClient } = renderAuth();

  await waitFor(() => expect(result.current?.token).toBe('9a8b'));
  expect(queryClient.getQueryData(queryKeys.user)).toEqual(grisen);
  expect(await AsyncStorage.getItem('persist:root')).toBeNull();
});

it('signIn stores the token and flips isAuthenticated', async () => {
  const { result } = renderAuth({ initialToken: null });

  act(() => result.current.signIn('token-1'));

  expect(result.current.token).toBe('token-1');
  expect(result.current.isAuthenticated).toBe(true);
  await waitFor(async () => expect(await AsyncStorage.getItem(TOKEN_KEY)).toBe('token-1'));
});

it('signOut clears the token and drops the cached user', async () => {
  const queryClient = createQueryClient();
  queryClient.setQueryData(queryKeys.user, grisen);
  await AsyncStorage.setItem(TOKEN_KEY, 'token-1');

  const { result } = renderAuth({ initialToken: 'token-1', queryClient });
  act(() => result.current.signOut());

  expect(result.current.token).toBeNull();
  expect(result.current.isAuthenticated).toBe(false);
  expect(queryClient.getQueryData(queryKeys.user)).toBeUndefined();
  await waitFor(async () => expect(await AsyncStorage.getItem(TOKEN_KEY)).toBeNull());
});

it('skips the storage bootstrap when given an initialToken', () => {
  const getItemSpy = jest.spyOn(AsyncStorage, 'getItem');

  const { result } = renderAuth({ initialToken: 'token-x' });

  // Synchronously ready: no gate, no storage reads
  expect(result.current.token).toBe('token-x');
  expect(getItemSpy).not.toHaveBeenCalled();
});
