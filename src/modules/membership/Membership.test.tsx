import { fireEvent } from '@testing-library/react-native';
import React from 'react';
import { RefreshControl } from 'react-native';

import Membership from '@/modules/membership/Membership';
import { mockMembershipTypesOnce, renderWithProviders, testUser } from '@/testUtils';
import type { UserType } from '@/types/data';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate }),
}));

it('shows the membership pitch when logged out', async () => {
  const { findByText } = renderWithProviders(<Membership />);

  expect(await findByText('Bli medlem')).toBeTruthy();
  expect(await findByText('Logg inn')).toBeTruthy();
});

it('lets a logged in non-member pick a membership type and shows its price', async () => {
  const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };

  mockMembershipTypesOnce();
  const { findByText, getByText } = renderWithProviders(<Membership />, {
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
  fireEvent.press(getByText('Student'));
  expect(await findByText('Kjøp medlemskap (150 NOK)')).toBeTruthy();

  fireEvent.press(getByText('Støtte'));
  expect(await findByText('Kjøp medlemskap (500 NOK)')).toBeTruthy();
});

it('shows the membership proof when logged in', async () => {
  mockMembershipTypesOnce();
  const { findByText } = renderWithProviders(<Membership />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  expect(await findByText('MEDLEM')).toBeTruthy();
  expect(await findByText('Test Testesen')).toBeTruthy();
});

it('fetches the user with the stored token when only the token survives a cold start', async () => {
  // The user fetch resolves first; Proof then mounts and fetches membership types
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    status: 200,
    json: async () => testUser,
  });
  mockMembershipTypesOnce();

  const { findByText } = renderWithProviders(<Membership />, {
    initialToken: 'test-token',
  });

  expect(await findByText('MEDLEM')).toBeTruthy();
  expect(await findByText('Test Testesen')).toBeTruthy();
  expect(global.fetch).toHaveBeenCalledWith(
    'https://dusken.example.test/api/me/',
    expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({ Authorization: 'Token test-token' }),
    }),
  );
});

it('refetches and renders updated user data on pull-to-refresh', async () => {
  const fetchMock = global.fetch as jest.Mock;
  const nonMember: UserType = { ...testUser, is_member: false, last_membership: null };

  mockMembershipTypesOnce();
  const { findByText, UNSAFE_getByType } = renderWithProviders(<Membership />, {
    initialToken: 'test-token',
    initialUser: nonMember,
  });
  expect(await findByText('Velg medlemskapstype')).toBeTruthy();

  // the server now reports an active membership, bought elsewhere
  fetchMock.mockResolvedValueOnce({ ok: true, status: 200, json: async () => testUser });
  fireEvent(UNSAFE_getByType(RefreshControl), 'refresh');

  expect(await findByText('MEDLEM')).toBeTruthy();
  expect(fetchMock).toHaveBeenLastCalledWith(
    'https://dusken.example.test/api/me/',
    expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({ Authorization: 'Token test-token' }),
    }),
  );
});

it('signs out when the stored token has been revoked', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 401,
    json: async () => ({ detail: 'Ugyldig token.' }),
  });

  const { findByText } = renderWithProviders(<Membership />, {
    initialToken: 'revoked-token',
  });

  expect(await findByText('Bli medlem')).toBeTruthy();
});

it('logs out and shows the logged-out membership screen again', async () => {
  mockMembershipTypesOnce();
  const { findByText } = renderWithProviders(<Membership />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  fireEvent.press(await findByText('Logg ut'));

  expect(await findByText('Bli medlem')).toBeTruthy();
  expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' });
});
