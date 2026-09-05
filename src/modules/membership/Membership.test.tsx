import { fireEvent } from '@testing-library/react-native';
import React from 'react';

import * as api from '@/api';
import { ApiError } from '@/errors';
import Membership from '@/modules/membership/Membership';
import { renderWithProviders, testUser } from '@/testUtils';
import type { UserType } from '@/types/data';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

it('shows the membership pitch when logged out', async () => {
  const { findByText } = await renderWithProviders(<Membership />);

  expect(await findByText('Bli medlem')).toBeTruthy();
  expect(await findByText('Logg inn')).toBeTruthy();
});

it('lets a logged in non-member pick a membership type and shows its price', async () => {
  const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };

  const { findByText, getByText } = await renderWithProviders(<Membership />, {
    initialToken: 'test-token',
    initialUser: nonMember,
  });

  // All three membership types are offered
  expect(await findByText('Velg medlemskapstype')).toBeTruthy();
  expect(getByText('Student')).toBeTruthy();
  expect(getByText('Ordinær')).toBeTruthy();
  expect(getByText('Støtte')).toBeTruthy();

  // 'Ordinær' (slug: regular) is preselected, so the purchase button shows its price
  expect(await findByText('Kjøp medlemskap (300 NOK)')).toBeTruthy();

  // Selecting another type updates the price
  await fireEvent.press(getByText('Student'));
  expect(await findByText('Kjøp medlemskap (150 NOK)')).toBeTruthy();

  await fireEvent.press(getByText('Støtte'));
  expect(await findByText('Kjøp medlemskap (500 NOK)')).toBeTruthy();
});

it('shows the membership proof when logged in', async () => {
  const { findByText } = await renderWithProviders(<Membership />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  expect(await findByText('MEDLEM')).toBeTruthy();
  expect(await findByText('Test Testesen')).toBeTruthy();
});

it('fetches the user with the stored token when only the token survives a cold start', async () => {
  const fetchUserData = jest.spyOn(api, 'fetchUserData').mockResolvedValue(testUser);

  const { findByText } = await renderWithProviders(<Membership />, {
    initialToken: 'test-token',
  });

  expect(await findByText('MEDLEM')).toBeTruthy();
  expect(await findByText('Test Testesen')).toBeTruthy();
  expect(fetchUserData).toHaveBeenCalledWith('test-token');
});

it('refetches and renders updated user data on pull-to-refresh', async () => {
  const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };

  const { findByText, getByTestId } = await renderWithProviders(<Membership />, {
    initialToken: 'test-token',
    initialUser: nonMember,
  });
  expect(await findByText('Velg medlemskapstype')).toBeTruthy();

  // the server now reports an active membership, bought elsewhere
  const fetchUserData = jest.spyOn(api, 'fetchUserData').mockResolvedValue(testUser);
  await fireEvent(getByTestId('refresh-control'), 'refresh');

  expect(await findByText('MEDLEM')).toBeTruthy();
  expect(fetchUserData).toHaveBeenCalledWith('test-token');
});

it('signs out when the stored token has been revoked', async () => {
  jest.spyOn(api, 'fetchUserData').mockRejectedValueOnce(new ApiError({ detail: 'Ugyldig token.' }, 401));

  const { findByText } = await renderWithProviders(<Membership />, {
    initialToken: 'revoked-token',
  });

  expect(await findByText('Bli medlem')).toBeTruthy();
});

it('logs out and shows the logged-out membership screen again', async () => {
  const { findByText } = await renderWithProviders(<Membership />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  await fireEvent.press(await findByText('Logg ut'));

  expect(await findByText('Bli medlem')).toBeTruthy();
  expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' });
});
