import { render, waitFor } from '@testing-library/react-native';
import React from 'react';

import App from '@/App';
import { appQueryClient } from '@/queries/queryClient';

// The official stripe jest mock renders a placeholder instead of its children;
// pass them through so the app tree below it can mount
jest.mock('@stripe/stripe-react-native', () => ({
  ...jest.requireActual('@stripe/stripe-react-native/jest/mock.js'),
  StripeProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// The app-level query client is module-global, don't leak cache between tests
afterEach(() => appQueryClient.clear());

it('renders the whole app up to the navigation tabs', async () => {
  const { findByText } = await render(<App />);

  // A tab label proves the auth bootstrap finished and Navigation mounted
  expect(await findByText('Medlemskap')).toBeTruthy();

  // Let the mounted screens' queries settle before the test ends
  await waitFor(() => expect(appQueryClient.isFetching()).toBe(0));
});
