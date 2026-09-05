import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

import Navigation from '@/Navigation';
import * as api from '@/api';
import { AuthProvider } from '@/auth/AuthContext';
import { queryKeys } from '@/queries/queryKeys';
import { testUser } from '@/testUtils';

// Navigation owns the NavigationContainer, so it can't go through renderWithProviders
const renderNavigation = (token: string | null) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity, refetchOnMount: false } },
  });
  if (token) {
    queryClient.setQueryData(queryKeys.user, testUser);
  }
  return render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider initialToken={token}>
        <Navigation />
      </AuthProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  jest.spyOn(api, 'fetchUserData').mockResolvedValue(testUser);
});

it('opens the settings screen from the membership header when logged in', async () => {
  const { findByText, findByRole } = await renderNavigation('test-token');

  // The tab label is the only 'Medlemskap' text: native-stack passes titles to the native header
  await fireEvent.press(await findByText('Medlemskap'));
  expect(await findByText('MEDLEM')).toBeTruthy();

  await fireEvent.press(await findByRole('button', { name: 'Innstillinger' }));

  expect(await findByText('Logg ut')).toBeTruthy();
  expect(await findByText('Slett bruker')).toBeTruthy();
});

it('has no settings button when logged out', async () => {
  const { findByText, queryByRole } = await renderNavigation(null);

  await fireEvent.press(await findByText('Medlemskap'));
  expect(await findByText('Bli medlem')).toBeTruthy();

  expect(queryByRole('button', { name: 'Innstillinger' })).toBeNull();
});
