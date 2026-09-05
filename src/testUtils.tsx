import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import React from 'react';
import type { ReactElement } from 'react';
import { TextInput } from 'react-native';

import { AuthProvider } from '@/auth/AuthContext';
import { queryKeys } from '@/queries/queryKeys';
import type { MembershipTypeOption, UserType } from '@/types/data';

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

/** The purchase options offered in the app. */
export const testMembershipTypes: MembershipTypeOption[] = [
  { slug: 'student', price: 15000 },
  { slug: 'regular', price: 30000 },
  { slug: 'support', price: 50000 },
];

/** Label of the field focused last; the mocked TextInput shares a single focus() mock across instances. */
export const focusedFieldLabel = () =>
  (TextInput.prototype.focus as jest.Mock).mock.contexts.at(-1)?.props.accessibilityLabel;

interface RenderWithProvidersOptions {
  /** Auth token the app has stored; being set means the user is logged in. */
  initialToken?: string | null;
  /** Already-fetched user data, as after a completed /api/me/ request. */
  initialUser?: UserType | null;
  /** Membership purchase options already in the cache; null leaves the query
   * empty for tests that exercise its loading and error states. */
  initialMembershipTypes?: MembershipTypeOption[] | null;
}

/**
 * Renders a screen inside the providers it expects in the real app: a fresh
 * query client (no persister), AuthProvider and a NavigationContainer.
 */
export async function renderWithProviders(
  ui: ReactElement,
  {
    initialToken = null,
    initialUser = null,
    initialMembershipTypes = testMembershipTypes,
  }: RenderWithProvidersOptions = {},
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
  if (initialMembershipTypes) {
    queryClient.setQueryData(queryKeys.membershipTypes, initialMembershipTypes);
  }

  const result = await render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialToken={initialToken}>
        <NavigationContainer>{ui}</NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>,
  );

  return { queryClient, ...result };
}
