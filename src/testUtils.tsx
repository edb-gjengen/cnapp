import { InMemoryCache } from '@apollo/client';
import type { MockedResponse } from '@apollo/client/testing';
import { MockedProvider } from '@apollo/client/testing';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import React from 'react';
import type { ReactElement } from 'react';

import { AuthProvider } from '@/auth/AuthContext';
import { queryKeys } from '@/queries/queryKeys';
import type { UserType } from '@/types/data';

/** A member with an active membership, for screens that require a logged in user. */
export const testUser: UserType = {
  username: 'testbruker',
  email: 'test@example.test',
  first_name: 'Test',
  last_name: 'Testesen',
  is_member: true,
  is_volunteer: false,
  last_membership: {
    membership_type: 'standard',
    end_date: '2099-08-01',
  },
};

interface RenderWithProvidersOptions {
  /** Auth token the app has stored; being set means the user is logged in. */
  initialToken?: string | null;
  /** Already-fetched user data, as after a completed /api/me/ request. */
  initialUser?: UserType | null;
  apolloMocks?: readonly MockedResponse[];
}

/**
 * Renders a screen inside the providers it expects in the real app: a fresh
 * query client (no persister), AuthProvider, Apollo's MockedProvider and a
 * NavigationContainer.
 */
export function renderWithProviders(
  ui: ReactElement,
  { initialToken = null, initialUser = null, apolloMocks = [] }: RenderWithProvidersOptions = {},
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      // No retries, no GC timers holding Jest open, and no mount refetches
      // (those would clobber a seeded initialUser with global fetch mock data)
      queries: { retry: false, gcTime: Infinity, refetchOnMount: false },
      mutations: { retry: false, gcTime: Infinity },
    },
  });
  if (initialUser) {
    queryClient.setQueryData(queryKeys.user, initialUser);
  }

  const result = render(
    <MockedProvider mocks={apolloMocks} cache={new InMemoryCache()}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider initialToken={initialToken}>
          <NavigationContainer>{ui}</NavigationContainer>
        </AuthProvider>
      </QueryClientProvider>
    </MockedProvider>,
  );

  return { queryClient, ...result };
}
