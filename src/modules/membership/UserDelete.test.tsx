import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import UserDelete from '@/modules/membership/UserDelete';
import { renderWithProviders, testUser } from '@/testUtils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));

const fetchMock = global.fetch as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders the delete confirmation for a logged in user', () => {
  const { getByText } = renderWithProviders(<UserDelete />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  expect(getByText('Slett meg')).toBeTruthy();
  expect(mockNavigate).not.toHaveBeenCalled();
});

it('renders nothing and navigates back to Membership when not logged in', () => {
  const { queryByText } = renderWithProviders(<UserDelete />);

  expect(queryByText('Slett meg')).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' });
});

it('deletes the account and returns to Membership once the username is typed to confirm', async () => {
  fetchMock.mockResolvedValueOnce({ ok: true, status: 204, json: async () => ({}) });
  const { getByText, getByDisplayValue } = renderWithProviders(<UserDelete />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  fireEvent.changeText(getByDisplayValue(''), 'testbruker');
  fireEvent.press(getByText('Jeg forstår, slett kontoen min'));

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' }));
  expect(fetchMock).toHaveBeenCalledWith(
    'https://dusken.example.test/api/me/delete/',
    expect.objectContaining({
      method: 'DELETE',
      headers: expect.objectContaining({ Authorization: 'Token test-token' }),
    }),
  );
});

it('shows the server error when deletion fails', async () => {
  fetchMock.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: async () => ({ detail: 'Kunne ikke slette kontoen akkurat nå' }),
  });
  const { getByText, getByDisplayValue, findByText } = renderWithProviders(<UserDelete />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  fireEvent.changeText(getByDisplayValue(''), 'testbruker');
  fireEvent.press(getByText('Jeg forstår, slett kontoen min'));

  expect(await findByText('Kunne ikke slette kontoen akkurat nå')).toBeTruthy();
  expect(mockNavigate).not.toHaveBeenCalled();
});
