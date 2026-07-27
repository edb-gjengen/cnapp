import React from 'react';

import UserDelete from '@/modules/membership/UserDelete';
import { renderWithProviders, testUser } from '@/testUtils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));

beforeEach(() => {
  mockNavigate.mockClear();
});

it('renders the delete confirmation for a logged in user', () => {
  const { getByText } = renderWithProviders(<UserDelete />, {
    preloadedState: { isAuthenticated: true, userToken: 'test-token', user: testUser },
  });

  expect(getByText('Slett meg')).toBeTruthy();
  expect(mockNavigate).not.toHaveBeenCalled();
});

it('renders nothing and navigates back to Membership when not logged in', () => {
  const { queryByText } = renderWithProviders(<UserDelete />);

  expect(queryByText('Slett meg')).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' });
});
