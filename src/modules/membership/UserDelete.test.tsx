import { fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';

import * as api from '@/api';
import { ApiError } from '@/errors';
import UserDelete from '@/modules/membership/UserDelete';
import { renderWithProviders, testUser } from '@/testUtils';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  ...jest.requireActual('@react-navigation/native'),
  useNavigation: () => ({ navigate: mockNavigate, goBack: jest.fn() }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

it('renders the delete confirmation for a logged in user', async () => {
  const { getByText } = await renderWithProviders(<UserDelete />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  expect(getByText('Slett meg')).toBeTruthy();
  expect(mockNavigate).not.toHaveBeenCalled();
});

it('renders nothing and navigates back to Membership when not logged in', async () => {
  const { queryByText } = await renderWithProviders(<UserDelete />);

  expect(queryByText('Slett meg')).toBeNull();
  expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' });
});

it('deletes the account and returns to Membership once the username is typed to confirm', async () => {
  const deleteUser = jest.spyOn(api, 'deleteUser').mockResolvedValueOnce(undefined);
  const { getByText, getByDisplayValue } = await renderWithProviders(<UserDelete />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  await fireEvent.changeText(getByDisplayValue(''), 'testbruker');
  await fireEvent.press(getByText('Jeg forstår, slett kontoen min'));

  await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('UserStack', { screen: 'Membership' }));
  expect(deleteUser).toHaveBeenCalledWith('test-token');
});

it('shows the server error when deletion fails', async () => {
  jest
    .spyOn(api, 'deleteUser')
    .mockRejectedValueOnce(new ApiError({ detail: 'Kunne ikke slette kontoen akkurat nå' }, 400));
  const { getByText, getByDisplayValue, findByText } = await renderWithProviders(<UserDelete />, {
    initialToken: 'test-token',
    initialUser: testUser,
  });

  await fireEvent.changeText(getByDisplayValue(''), 'testbruker');
  await fireEvent.press(getByText('Jeg forstår, slett kontoen min'));

  expect(await findByText('Kunne ikke slette kontoen akkurat nå')).toBeTruthy();
  expect(mockNavigate).not.toHaveBeenCalled();
});
